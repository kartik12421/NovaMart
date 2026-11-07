import { HeadphonesIcon, VideoIcon } from "lucide-react";
import { OrderChatPanelSkeleton } from "../components/LoadingSkeletons.jsx";
import { PageError } from "../components/PageError.jsx";
import { useOrderChatPage } from "../hooks/useOrderChatPage.js";
import {
  Chat,
  Channel,
  MessageList,
  MessageComposer,
  Thread,
} from "stream-chat-react";
import "stream-chat-react/dist/css/index.css";

function OrderChatPage() {
  const { paid, client, error, channel, canInvite, inviteMutation } = useOrderChatPage();

  if (!paid) {
    return (
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-base-content/60">
        Complete payment to open support chat.
      </p>
    );
  }
  if (error) {
    return <PageError message={error} />;
  }
  if (!client || !channel) {
    return <OrderChatPanelSkeleton />;
  }

  return (
    <div className="space-y-4 text-left">
      <div className="border-2 border-base-300 bg-base-100">
        <div className="flex flex-wrap items-start gap-4 p-5">
          <div className="flex size-12 shrink-0 items-center justify-center bg-primary text-primary-content">
            <HeadphonesIcon className="size-6" aria-hidden />
          </div>

          <div className="flex-1">
            <h3 className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-base-content">
              Message support
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-base-content/70">
              Ask about this order, shipping, or returns. Support can send a video call link here
              when needed; both sides use the same Join button.
            </p>

            {canInvite ? (
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  className="btn-brutal inline-flex items-center gap-2 border-2 border-secondary bg-secondary px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-secondary-content hover:bg-transparent hover:text-secondary"
                  disabled={inviteMutation.isPending}
                  onClick={() => inviteMutation.mutate()}
                >
                  {inviteMutation.isPending ? (
                    <span className="loading loading-spinner loading-xs" />
                  ) : (
                    <VideoIcon className="size-4" aria-hidden />
                  )}
                  Send video call invite
                </button>

                {inviteMutation.isError ? (
                  <span className="font-mono text-[11px] uppercase tracking-widest text-error">
                    Could not send invite.
                  </span>
                ) : null}

                {inviteMutation.isSuccess ? (
                  <span className="font-mono text-[11px] uppercase tracking-widest text-success">
                    Invite sent.
                  </span>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="stream-panel h-140 overflow-hidden border-2 border-base-300 bg-neutral-950 [&_.str-chat\_\_main-panel]:min-h-0">
        <Chat client={client} theme="messaging str-chat__theme-dark">
          <Channel channel={channel}>
            <MessageList />
            <Thread />
            <MessageComposer />
          </Channel>
        </Chat>
      </div>
    </div>
  );
}

export default OrderChatPage;
