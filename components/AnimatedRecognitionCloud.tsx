import { Marquee } from "./magicui/marquee";

const logos = [
    { name: 'Kurativz', url: 'https://i.ibb.co/JQ5VKhJ/kurativz.jpg' },
    { name: 'YourStory', url: 'https://i.ibb.co/d5HqmKT/yourstory.png' },
    { name: 'IIIT Lucknow', url: 'https://i.ibb.co/LN1G2TG/iiitl.jpg' },
    { name: 'ACIR', url: 'https://i.ibb.co/whqrw8q/ACIR.png' },
    { name: 'Startup India', url: 'https://i.ibb.co/C69ZXmg/Startup-India-removebg-preview.png' },
    { name: 'IIT Kanpur', url: 'https://i.ibb.co/wKNVt4J/iit-kanpur.png' },
    { name: 'IIT Roorkee', url: 'https://i.ibb.co/nR427qK/IITR-Logo.png' },
    { name: 'MeitY', url: 'https://i.ibb.co/mtYr1bg/meity.png' },
    { name: 'DST', url: 'https://i.ibb.co/PhNtVmd/dst.png' },
    { name: 'EWC', url: 'https://i.ibb.co/DkBdjHB/EWC.jpg' },
    { name: 'NASSCOM', url: 'https://i.ibb.co/PwN9fyw/nasscom.jpg' },
    { name: 'Google Startup Badge', url: 'https://i.ibb.co/C7Zg0h2/Google-startup-badge.jpg' },
    { name: 'GSEA', url: 'https://i.ibb.co/k1b9JXF/gsea.jpg' },
    { name: 'Microsoft', url: 'https://i.ibb.co/bgsmDhS/microsoft.png' },
    { name: 'Nexus', url: 'https://i.ibb.co/ThvG8Jt/Nexus-Logo-3.png' },
    { name: 'Postman', url: 'https://i.ibb.co/58RJKRM/postman.png' },
    { name: 'Razorpay Rize', url: 'https://i.ibb.co/Xz5Z3bh/razorpay-rize.png' },
    { name: 'SISFS', url: 'https://i.ibb.co/xqsPBvv/SISFS-removebg-preview.png' },
    { name: 'American Center', url: 'https://i.ibb.co/Bc4Kxbh/American-Center-2-removebg-preview.png' },
  ];
  
  
  const AnimatedRecognitionCloud = () => {
    return (
        <div className="w-full py-20">
            <h2 className="text-gray-300 text-center text-3xl md:text-4xl font-bold mb-[5rem]">Proud to be recognised by</h2>
            <Marquee pauseOnHover  className="[--duration:20s]">
                  {logos.map((logo, key) => (
                    <div
                      key={key}
                      className="flex items-center justify-center px-6 text-white"
                    >
                      <img
                        src={logo.url}
                        className="h-10 w-fit opacity-80 transition-opacity hover:opacity-100"
                        alt={`${logo.name}`}
                      />
                    </div>
                  ))}
            </Marquee>
        </div>
    );
  };
  
  export default AnimatedRecognitionCloud;
  