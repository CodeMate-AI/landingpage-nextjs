export default function VideoEmbed() {
  return (
    <iframe
      className="w-full h-full pointer-events-none"
      src="https://www.youtube.com/embed/ux5jJgNkslE?autoplay=1&mute=1&loop=1&rel=0&controls=0&modestbranding=1&showinfo=0&disablekb=1&playlist=ux5jJgNkslE"
      allow="autoplay; encrypted-media"
      allowFullScreen
      style={{ border: "none" }}
    ></iframe>
  );
}
