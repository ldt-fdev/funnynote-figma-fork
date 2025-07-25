import type { Metadata } from 'next';
import { DrawingCanvas } from './components/drawing-canvas';

export default function DrawPage() {
  return <DrawingCanvas />;
}

export const metadata: Metadata = {
  title: 'Bảng vẽ | FunnyNote',
  description: 'Trình chỉnh sửa vẽ của FunnyNote',
};
