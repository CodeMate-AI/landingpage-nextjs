import fs from 'fs';
import path from 'path';
import ChatbotLoader from './components/ChatbotLoader';

// This is a Server Component, so we can use Node.js APIs
export default async function LandingPage() {
  // Read the HTML file content on the server
  const htmlContent = fs.readFileSync(
    path.join(process.cwd(), 'app', 'index.html'),
    'utf-8'
  );

  return (
    <>
      <div
        dangerouslySetInnerHTML={{
          __html: htmlContent,
        }}
      />
      <ChatbotLoader />
    </>
  );
}
