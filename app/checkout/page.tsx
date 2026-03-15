import { Suspense } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import CheckoutContent from './checkout-content';

function CheckoutLoading() {
  return (
    <div className="flex-1 py-12 md:py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 md:p-12 mb-8 h-96 animate-pulse" />
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <main className="bg-gradient-to-b from-slate-50 to-white min-h-screen flex flex-col">
      <Header />
      <Suspense fallback={<CheckoutLoading />}>
        <CheckoutContent />
      </Suspense>
      <Footer />
    </main>
  );
}
