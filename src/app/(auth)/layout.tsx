// Force dynamic rendering for all auth pages to prevent prerender errors
export const dynamic = 'force-dynamic';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 