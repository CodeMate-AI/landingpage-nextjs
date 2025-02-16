const logos = [
    {
      name: 'Amazon',
      url: 'https://drive.codemate.ai/Amazon.png',
    },
    {
      name: 'Atlassian',
      url: 'https://drive.codemate.ai/atlassian.png',
    },
    {
      name: 'FamPay',
      url: 'https://drive.codemate.ai/FamPay.png',
    },
    {
      name: 'Paypal',
      url: 'https://drive.codemate.ai/paypal.png',
    },
    {
      name: 'Adobe',
      url: 'https://drive.codemate.ai/adobe.png',
    },
    {
      name: 'Amazon',
      url: 'https://drive.codemate.ai/Amazon.png',
    },
    {
      name: 'Atlassian',
      url: 'https://drive.codemate.ai/atlassian.png',
    },
    {
      name: 'FamPay',
      url: 'https://drive.codemate.ai/FamPay.png',
    },
    {
      name: 'Paypal',
      url: 'https://drive.codemate.ai/paypal.png',
    },
    {
      name: 'Adobe',
      url: 'https://drive.codemate.ai/adobe.png',
    },
  ];
  
  const AnimatedLogoCloud = () => {
    return (
        <div className="w-full py-12">
            <h2 className="text-gray-300 text-center text-3xl md:text-4xl font-bold mb-[5rem]">Trusted by your favourite Companies</h2>
        <div className="mx-auto w-full px-4 md:px-8">
          <div
            className="group relative mt-6 flex gap-6 overflow-hidden p-2"
            style={{
              maskImage:
                'linear-gradient(to left, transparent 0%, black 20%, black 80%, transparent 95%)',
            }}
          >
            {Array(5)
              .fill(null)
              .map((_, index) => (
                <div
                  key={index}
                  className="flex shrink-0 animate-logo-cloud flex-row justify-around gap-6"
                >
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
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  };
  
  export default AnimatedLogoCloud;
  