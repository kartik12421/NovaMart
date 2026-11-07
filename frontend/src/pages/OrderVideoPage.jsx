import { Link, useNavigate } from "react-router";
import useOrderVideoPage from "../hooks/useOrderVideoPage";
import { OrderVideoSkeleton } from "../components/LoadingSkeletons";
import { PageError } from "../components/PageError";
import { ArrowLeftIcon, VideoIcon } from "lucide-react";

import {
  CallControls,
  StreamVideo,
  StreamCall,
  StreamTheme,
  SpeakerLayout,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";

function OrderVideoPage() {
  const navigate = useNavigate();

  const { id, order, paid, isLoading, loadError, client, call, error } = useOrderVideoPage();

  if (isLoading) {
    return <OrderVideoSkeleton />;
  }

  if (loadError || !order) {
    return (
      <PageError
        message="Order not found or you don't have access."
        action={{ to: "/orders", label: "Back to orders" }}
      />
    );
  }

  if (!paid) {
    return (
      <div role="alert" className="alert alert-info">
        <span>This order must be paid before you can join video support.</span>
      </div>
    );
  }

  if (error) {
    return <PageError message={error} />;
  }

  if (!client || !call) {
    return (
      <div className="flex min-h-120 items-center justify-center border-2 border-base-300 bg-base-100">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4 text-left">
      <Link
        to={`/orders/${id}/chat`}
        className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-base-content/55 transition-colors hover:text-primary"
      >
        <ArrowLeftIcon className="size-4" aria-hidden />
        Back to support chat
      </Link>

      <div className="border-2 border-base-300 bg-base-100">
        <div className="flex items-start gap-4 p-5">
          <div className="flex size-12 shrink-0 items-center justify-center bg-secondary text-secondary-content">
            <VideoIcon className="size-6" aria-hidden />
          </div>
          <div>
            <h1 className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-base-content">
              Video call
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-base-content/70">
              Same room as the invite link in chat. Allow camera and microphone when your browser
              asks.
            </p>
          </div>
        </div>
      </div>

      <div className="flex min-h-130 flex-col overflow-hidden border-2 border-base-300 bg-base-100">
        <StreamVideo client={client}>
          <StreamCall call={call}>
            <StreamTheme className="str-video__theme-custom">
              <div className="flex min-h-0 flex-1 flex-col">
                <div className="relative min-h-105 flex-1 bg-neutral text-neutral-content">
                  <SpeakerLayout />
                </div>
                <div className="shrink-0 border-t-2 border-base-300 bg-base-200 px-2 py-3 [&_.str-video__call-controls]:flex-wrap [&_.str-video__call-controls]:justify-center">
                  <CallControls onLeave={() => navigate(`/orders/${id}/chat`)} />
                </div>
              </div>
            </StreamTheme>
          </StreamCall>
        </StreamVideo>
      </div>
    </div>
  );
}

export default OrderVideoPage;
