import { Login } from './components/login-page';
import { Metadata } from 'next';
import { Suspense } from 'react';
import Loading from './components/loading';

export default function LoginPage() {
  return (
    <Suspense fallback={<Loading />}>
      <Login />
    </Suspense>
  );
}
export const metadata: Metadata = {
  title: 'Đăng nhập | FunnyNote',
  description: 'Đăng nhập vào FunnyNote để truy cập các tính năng của ứng dụng',
};
