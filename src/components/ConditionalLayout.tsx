'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isPasswordPage = pathname === '/password';

  if (isPasswordPage) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      {children}
    </>
  );
}
