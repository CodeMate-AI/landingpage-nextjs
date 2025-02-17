import fs from 'fs';
import path from 'path';

export default function LandingPage() {
  // Read the HTML file content
  const htmlContent = fs.readFileSync(
    path.join(process.cwd(), 'app', 'index.html'),
    'utf-8'
  );

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: htmlContent,
      }}
    />
  );
}
