import React from 'react';

const MetricsComponent = () => {
  const metrics = [
    { value: '10K+', label: 'STUDENTS HELPED' },
    { value: '5K+', label: 'TEACHERS HELPED' },
    { value: '500K+', label: 'LINES OF CODE WRITTEN' }
  ];

  return (
    <div className="w-full py-10 px-4 my-10 mt-12">
      <div className="max-w-5xl mx-auto border-t border-b border-gray-900">
        <div className="flex flex-col md:flex-row">
          {metrics.map((metric, index) => (
            <div 
              key={index} 
              className={`
                flex-1 px-6 py-8 flex flex-col items-center justify-center text-center
                ${index < metrics.length - 1 ? 'border-b md:border-b-0 md:border-r' : ''} 
                border-gray-700
              `}
            >
              <div className="text-5xl font-bold text-white mb-2">{metric.value}</div>
              <div className="text-gray-400 text-sm tracking-wider uppercase">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MetricsComponent;