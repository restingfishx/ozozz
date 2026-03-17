'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function PaymentCancelPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-yellow-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2">Payment Cancelled</h2>
        <p className="text-gray-500 mb-6">
          Your payment was cancelled and no charge has been made. You can try again or continue shopping.
        </p>

        <div className="flex flex-col gap-3">
          {orderId ? (
            <Link
              href={`/payment/success/${orderId}`}
              className="w-full h-12 bg-black text-white rounded-lg font-medium hover:bg-gray-800 flex items-center justify-center"
            >
              Try Payment Again
            </Link>
          ) : (
            <Link
              href="/checkout"
              className="w-full h-12 bg-black text-white rounded-lg font-medium hover:bg-gray-800 flex items-center justify-center"
            >
              Try Payment Again
            </Link>
          )}
          <Link
            href="/products"
            className="w-full h-12 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 flex items-center justify-center"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
