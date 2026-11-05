import "stream-chat";

declare module "stream-chat" {
  interface CustomChannelData {
    name?: string;
  }

  interface CustomMessageData {
    video_invite?: boolean;
    join_url?: string;
  }
}
