'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ServicesPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home page with the dumpster-services hash
    router.push('/#dumpster-services');
  }, [router]);

  return null;
}
