import dns from "node:dns";

/**
 * Local DNS fallback.
 *
 * Some routers/ISPs refuse to resolve certain hostnames (we saw `EREFUSED` for the
 * Neon database host while `neon.tech` resolved fine), which makes every database
 * query fail with `ENOTFOUND` and the API answer 500.
 *
 * When the OS resolver fails we retry the lookup through a public resolver, so the
 * app can still reach its dependencies. Successful lookups are passed through
 * untouched, so this is a no-op on healthy networks.
 */

const FALLBACK_SERVERS = ["8.8.8.8", "1.1.1.1"];

/** Name-resolution failures that are worth retrying elsewhere. */
const RETRYABLE_CODES = new Set(["ENOTFOUND", "EAI_AGAIN", "EREFUSED", "ESERVFAIL"]);

type LookupOptions = { family?: number; all?: boolean } | number | undefined;

type Resolved = { address: string | dns.LookupAddress[]; family: number };

function resolveViaPublicDns(hostname: string, options: LookupOptions): Promise<Resolved> {
  const family = typeof options === "object" && options ? options.family : undefined;
  const wantAll = typeof options === "object" && options ? options.all === true : false;

  const query = (rrtype: "A" | "AAAA") =>
    new Promise<string[]>((resolve, reject) => {
      const resolver = new dns.Resolver();
      resolver.setServers(FALLBACK_SERVERS);

      const done = (err: Error | null, addresses: string[]) => {
        if (err) reject(err);
        else resolve(addresses);
      };

      if (rrtype === "AAAA") resolver.resolve6(hostname, done);
      else resolver.resolve4(hostname, done);
    });

  return (async (): Promise<Resolved> => {
    const attempts: Array<"A" | "AAAA"> = family === 6 ? ["AAAA"] : family === 4 ? ["A"] : ["A", "AAAA"];
    let lastError: unknown;

    for (const rrtype of attempts) {
      try {
        const addresses = await query(rrtype);
        if (addresses.length === 0) continue;

        const resolvedFamily = rrtype === "AAAA" ? 6 : 4;
        if (wantAll) {
          return {
            address: addresses.map((address) => ({ address, family: resolvedFamily })),
            family: 0,
          };
        }
        return { address: addresses[0], family: resolvedFamily };
      } catch (e) {
        lastError = e;
      }
    }

    throw lastError ?? Object.assign(new Error(`ENOTFOUND ${hostname}`), { code: "ENOTFOUND" });
  })();
}

let installed = false;

/** Wraps `dns.lookup` with the public-DNS fallback. Safe to call more than once. */
export function installDnsFallback() {
  if (installed) return;
  installed = true;

  const originalLookup = dns.lookup as (
    hostname: string,
    options: LookupOptions,
    callback: (err: NodeJS.ErrnoException | null, address?: unknown, family?: number) => void,
  ) => void;

  dns.lookup = ((hostname: string, options: LookupOptions, callback: (...args: unknown[]) => void) => {
    if (typeof options === "function") {
      callback = options as unknown as (...args: unknown[]) => void;
      options = {};
    }
    if (options == null) options = {};

    originalLookup(hostname, options, (err, address, family) => {
      if (!err || !err.code || !RETRYABLE_CODES.has(err.code)) {
        callback(err, address, family);
        return;
      }

      resolveViaPublicDns(hostname, options).then(
        (resolved) => callback(null, resolved.address, resolved.family),
        () => callback(err, address, family),
      );
    });
  }) as typeof dns.lookup;
}

installDnsFallback();
