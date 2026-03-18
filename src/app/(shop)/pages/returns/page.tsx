'use client';

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Returns & Exchanges</h1>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-4">Return Policy</h2>
            <p className="text-gray-600 leading-relaxed">
              We want you to be completely satisfied with your purchase. If you are not happy
              with your order for any reason, you may return most items within 30 days of delivery
              for a full refund or exchange. Please review our policy below for specific details
              and requirements.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Eligibility for Returns</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Items must be unused, unworn, and in original packaging</li>
              <li>Proof of purchase (order confirmation or receipt) is required</li>
              <li>Items must be returned within 30 days of delivery</li>
              <li>Customized or personalized items may not be eligible for return</li>
              <li>Sale items may be subject to different return terms</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">How to Return an Item</h2>
            <ol className="list-decimal list-inside text-gray-600 space-y-2">
              <li>Contact our customer support to initiate a return request</li>
              <li>Receive a return authorization number and shipping label</li>
              <li>Pack the item securely in original packaging</li>
              <li>Ship the package using the provided label</li>
              <li>Refunds will be processed within 5-7 business days of receiving the return</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Refunds</h2>
            <p className="text-gray-600 leading-relaxed">
              Once your return is received and inspected, we will notify you of the approval
              or rejection of your refund. If approved, the refund will be credited to your
              original payment method within 5-7 business days. Please note that shipping
              costs are non-refundable unless the return is due to our error.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Exchanges</h2>
            <p className="text-gray-600 leading-relaxed">
              If you need to exchange an item for a different size, color, or product, please
              follow the same return process and indicate that you would like an exchange.
              We will ship the replacement item once we receive the original, or you may
              place a new order for the desired item.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Damaged or Defective Items</h2>
            <p className="text-gray-600 leading-relaxed">
              If you receive a damaged or defective item, please contact us immediately with
              photos of the damage. We will arrange for a replacement or full refund at no
              cost to you. Please do not return damaged items without first contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
            <p className="text-gray-600 leading-relaxed">
              If you have any questions about our returns and exchanges policy, please contact
              our customer support team.
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600">
                <strong>Email:</strong> returns@ozozz.com<br />
                <strong>Phone:</strong> 1-800-OZOZZ
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
