'use client';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">About Us</h1>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-4">Who We Are</h2>
            <p className="text-gray-600 leading-relaxed">
              Welcome to Ozozz, your premier destination for quality products at competitive prices.
              We are dedicated to providing an exceptional shopping experience with a wide selection
              of products, seamless navigation, and excellent customer service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              Our mission is to make online shopping simple, secure, and enjoyable for everyone.
              We strive to offer high-quality products that meet the diverse needs of our customers,
              all while maintaining transparent pricing and exceptional service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Why Choose Us</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Wide selection of quality products</li>
              <li>Competitive pricing</li>
              <li>Secure payment processing</li>
              <li>Fast and reliable shipping</li>
              <li>Responsive customer support</li>
              <li>Easy returns and exchanges</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
            <p className="text-gray-600 leading-relaxed">
              We value your feedback and are always here to help. If you have any questions,
              suggestions, or concerns, please do not hesitate to reach out to our customer
              support team.
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600">
                <strong>Email:</strong> support@ozozz.com<br />
                <strong>Phone:</strong> 1-800-OZOZZ<br />
                <strong>Hours:</strong> Monday - Friday, 9AM - 6PM EST
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
