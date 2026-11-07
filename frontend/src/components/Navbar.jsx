import { Show, SignInButton, useAuth, UserButton } from "@clerk/react";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../lib/api";
import { Link } from "react-router";

import {
  LogInIcon,
  PackageIcon,
  SettingsIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  StoreIcon,
} from "lucide-react";
import { useCart } from "../store/cart";

const NavLinkClass =
  "flex items-center gap-2 border-l-2 border-base-300 px-3 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-base-content/75 transition-colors hover:bg-primary hover:text-primary-content md:px-4";

const Navbar = () => {
  const { getToken, isSignedIn } = useAuth();

  const { data: meData } = useQuery({
    queryKey: ["me"],
    queryFn: () => apiFetch("/api/me", { getToken }),
    enabled: isSignedIn,
  });

  const role = meData?.user?.role;

  const cartCount = useCart((s) => s.items.reduce((n, line) => n + line.quantity, 0));

  return (
    <header className="sticky top-0 z-50 border-b-2 border-base-300 bg-base-100/95 backdrop-blur-md">
      <div className="mx-auto flex min-h-14 max-w-7xl items-stretch">
        <Link to="/" className="group flex items-center gap-2.5 px-4 md:px-6">
          <span className="flex size-8 items-center justify-center bg-primary text-primary-content transition-colors group-hover:bg-base-content group-hover:text-base-100">
            <StoreIcon className="size-5" aria-hidden />
          </span>
          <span className="text-base font-bold uppercase tracking-tight md:text-lg">NovaMart</span>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.25em] text-base-content/35 xl:inline">
            / supply
          </span>
        </Link>

        <nav className="ml-auto flex items-stretch">
          <Link to="/" className={NavLinkClass} aria-label="Shop">
            <ShoppingBagIcon className="size-4" aria-hidden />
            <span className="hidden sm:inline">Shop</span>
          </Link>

          <Show when={"signed-in"}>
            <Link to="/orders" className={NavLinkClass} aria-label="Orders">
              <PackageIcon className="size-4" aria-hidden />
              <span className="hidden sm:inline">Orders</span>
            </Link>

            {role === "admin" ? (
              <Link to="/admin" className={NavLinkClass} aria-label="Admin">
                <SettingsIcon className="size-4" aria-hidden />
                <span className="hidden sm:inline">Admin</span>
              </Link>
            ) : null}
          </Show>

          <Link
            to="/cart"
            className={NavLinkClass}
            aria-label={cartCount > 0 ? `Cart, ${cartCount} items` : "Cart"}
          >
            <span className="relative flex items-center gap-2">
              <ShoppingCartIcon className="size-4" aria-hidden />
              {cartCount > 0 ? (
                <span className="flex min-w-5 items-center justify-center bg-primary px-1 py-px font-mono text-[10px] font-bold leading-4 text-primary-content tabular-nums">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              ) : null}
            </span>
            <span className="hidden sm:inline">Cart</span>
          </Link>

          <Show when={"signed-out"}>
            <SignInButton mode="modal">
              <button
                type="button"
                className="flex items-center gap-2 border-l-2 border-base-300 bg-base-content px-4 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-base-100 transition-colors hover:bg-primary hover:text-primary-content md:px-5"
              >
                <LogInIcon className="size-4" aria-hidden />
                Sign in
              </button>
            </SignInButton>
          </Show>

          <Show when={"signed-in"}>
            <div className="flex items-center gap-2 border-l-2 border-base-300 px-3 md:px-4">
              <UserButton appearance={{ elements: { avatarBox: "size-8" } }} />
              {role === "support" || role === "admin" ? (
                <span className="hidden border border-primary px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-primary md:inline-block">
                  {role}
                </span>
              ) : null}
            </div>
          </Show>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
