export default function VideoEmbed() {
  return (
    <div className="w-full h-full flex justify-center  pointer-events-none">
      <div
        className="w-full flex h-full justify-center items-center"
        style={{
          maxWidth: "1300px",

          overflow: "hidden",
          borderRadius: "12px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}
      >
        <div
          className="flex h-full  justify-center items-center"
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            paddingBottom: "56.25%",
          }}
        >
          <iframe
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              border: "none",
            }}
            src="https://www.youtube.com/embed/WLFXalppvLY?autoplay=1&mute=1&loop=1&rel=0&controls=0&modestbranding=1&showinfo=0&disablekb=1&playlist=WLFXalppvLY"
            allow="autoplay; encrypted-media"
            allowFullScreen
            className="pointer-events-none"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
