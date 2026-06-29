export default function VideoEmbed() {
  return (
    <iframe
      className="w-full h-full pointer-events-none"
      src="https://www.youtube-nocookie.com/embed/ux5jJgNkslE?autoplay=1&mute=1&loop=1&rel=0&controls=0&modestbranding=1&showinfo=0&disablekb=1&playlist=ux5jJgNkslE&cc_load_policy=0"
      allow="autoplay; encrypted-media"
      allowFullScreen
      referrerPolicy="strict-origin-when-cross-origin"
      style={{ border: "none" }}
    ></iframe>
  );
}
