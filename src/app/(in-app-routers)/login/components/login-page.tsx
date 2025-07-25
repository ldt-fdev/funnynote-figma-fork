'use client';

import { redirect } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://note.funnycode.vn';
const FUNNYCODE_URL = process.env.NEXT_PUBLIC_FUNNYCODE_URL || process.env.FUNNYCODE_URL || 'https://funnycode.vn';

export function Login() {
  const searchParams = useSearchParams();
  const originUrl = searchParams.get('originUrl') || undefined;

  if (originUrl) {
    return redirect('/');
  }
  return redirect(`${FUNNYCODE_URL}/vi/authentication?callbackUrl=${SITE_URL}`);
}
