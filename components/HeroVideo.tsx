import { Safari } from "@/components/magicui/safari";

export function SafariDemo() {
  return (
    <div className="relative mx-auto" id="hero-video">
      <Safari
        height={590}
        url="CodeMate.ai"
        className="w-[100%] h-[min-content]"
        videoSrc="/assets/heroVideo.mp4"
      />
    </div>
  );
}
