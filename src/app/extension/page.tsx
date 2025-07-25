'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function EmbedPage() {
  const [iframeHeight, setIframeHeight] = useState<number>(500); // Default height

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Ensure the message comes from the expected origin for security
      // In development, it might be http://localhost:3000
      // In production, it will be your deployed domain
      if (event.origin !== window.location.origin) {
        console.warn('Message from unknown origin:', event.origin);
        return;
      }

      if (event.data && event.data.type === 'EDITOR_HEIGHT') {
        setIframeHeight(event.data.height);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-4xl flex flex-col">
        <CardHeader>
          <CardTitle>Trình soạn thảo nhúng</CardTitle>
          <CardDescription>Chiều cao trình soạn thảo tự động điều chỉnh.</CardDescription>
        </CardHeader>
        <CardContent className="p-0" style={{ height: iframeHeight }}>
          {' '}
          {/* Apply dynamic height to CardContent */}
          <iframe
            src="/extension/iframe/note" // This is the route of the editor you created
            title="Text Editor"
            className="w-full h-full border-none" // Iframe will take up the full width and height of CardContent
            allowFullScreen
          ></iframe>
        </CardContent>
      </Card>
    </div>
  );
}
