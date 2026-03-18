'use client';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-4">Introduction</h2>
            <p className="text-gray-600 leading-relaxed">
              At Ozozz, we take your privacy seriously. This Privacy Policy explains how we collect,
              use, disclose, and safeguard your information when you visit our website or make
              a purchase. Please read this policy carefully to understand our practices regarding
              your personal data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Information We Collect</h2>
            <p className="text-gray-600 leading-relaxed mb-2">
              We may collect personal information that you voluntarily provide to us when you:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Register an account on our website</li>
              <li>Place an order</li>
              <li>Subscribe to our newsletter</li>
              <li>Contact our customer support</li>
              <li>Participate in promotions or surveys</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-4">
              This information may include your name, email address, phone number, shipping address,
              payment information, and purchase history.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">How We Use Your Information</h2>
            <p className="text-gray-600 leading-relaxed mb-2">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Process and fulfill your orders</li>
              <li>Communicate with you about your orders and account</li>
              <li>Provide customer support</li>
              <li>Send promotional emails and newsletters (with your consent)</li>
              <li>Improve our website and services</li>
              <li>Prevent fraud and ensure security</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Information Sharing</h2>
            <p className="text-gray-600 leading-relaxed">
              We do not sell, trade, or otherwise transfer your personal information to outside
              parties except as described below:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mt-2">
              <li><strong>Service Providers:</strong> We may share information with third-party
              vendors who assist us in operating our website and conducting our business.</li>
              <li><strong>Payment Processing:</strong> We share information with payment processors
              to facilitate transactions.</li>
              <li><strong>Legal Requirements:</strong> We may disclose information when required
              by law or in response to valid requests by public authorities.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Data Security</h2>
            <p className="text-gray-600 leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal
              information against unauthorized access, alteration, disclosure, or destruction.
              However, no method of transmission over the internet or electronic storage is 100%
              secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Your Rights</h2>
            <p className="text-gray-600 leading-relaxed mb-2">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your personal data</li>
              <li>Opt-out of marketing communications</li>
              <li>Request restriction of processing</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Cookies</h2>
            <p className="text-gray-600 leading-relaxed">
              Our website uses cookies to enhance your browsing experience. Cookies are small
              files stored on your device that help us understand your preferences and improve
              our service. You can choose to disable cookies through your browser settings,
              though this may affect some features of our website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Changes to This Policy</h2>
            <p className="text-gray-600 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any
              changes by posting the new policy on this page and updating the &quot;last updated&quot;
              date. You are advised to review this Privacy Policy periodically for any changes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
            <p className="text-gray-600 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us.
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600">
                <strong>Email:</strong> privacy@ozozz.com<br />
                <strong>Phone:</strong> 1-800-OZOZZ
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
