'use client';

import { useEffect } from 'react';

export default function ChatbotLoader() {
  useEffect(() => {
    // Load the pilot.js script
    const pilotScript = document.createElement('script');
    pilotScript.src = 'https://scankart.ai/pilot.js';
    pilotScript.async = true;
    document.body.appendChild(pilotScript);

    // After pilot.js is loaded, initialize the chatbot
    pilotScript.onload = () => {
      const options = {
        apiUrl: "https://scankart.ai/backend",
        token: "fFHHt0xepSHqCdUb",
        initialMessage: "How can I help you today?",
        defaultOpen: false,
        socketUrl: "https://scankart.ai",
        chatbotName: "CodeMate AI",
        containerProps: {
          style: {
            width: "400px",
            height: "600px",
            position: "fixed",
            bottom: "0",
            right: "0",
            zIndex: "9999",
          }
        },
        styles: {
          container: {}, //optional
          header: {}, //optional
          chatContainer: {}, //optional
          chatInput: {}, //optional
        }
      };
      
      // Check if initAiCoPilot function exists and call it
      // @ts-ignore
      if (typeof window.initAiCoPilot === 'function') {
        // @ts-ignore
        window.initAiCoPilot(options);
      } else {
        console.error('initAiCoPilot function not found');
      }
    };

    // Cleanup on component unmount
    return () => {
      document.body.removeChild(pilotScript);
    };
  }, []);

  return null; // This component doesn't render anything
} 