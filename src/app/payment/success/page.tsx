import Link from "next/link";

interface PageProps {
  params: Promise<{ orderId: string }>;
}

export default async function PaymentSuccessPage({ params }: PageProps) {
  const { orderId } = await params;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
        <p className="text-gray-500 mb-6">
          Thank you for your purchase. Your order has been placed successfully.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/orders"
            className="w-full h-12 bg-black text-white rounded-lg font-medium hover:bg-gray-800 flex items-center justify-center"
          >
            View Orders
          </Link>
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
