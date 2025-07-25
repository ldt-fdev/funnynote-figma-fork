'use client';

import { Iframe } from './extension-iframe';

export default function EditorClient({ videoUrl, courseUrl }: { videoUrl: string | null; courseUrl: string | null }) {
  return <Iframe videoUrl={videoUrl} courseUrl={courseUrl} />;
}
