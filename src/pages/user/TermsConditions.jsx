import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const TermsConditions = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      sectionRef.current,
      {
        opacity: 0,
        scale: 0.8,
        y: 40,
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
      }
    );
  }, []);

  return (
    <div
      ref={sectionRef}
      className="flex items-center justify-center min-h-screen bg-gray-100 py-12 relative z-5"
    >
      <div
        className="max-w-5xl w-full bg-white text-gray-900 rounded-2xl shadow-xl grid grid-cols-1 md:grid-cols-2 p-8 gap-8 border border-gray-300 overflow-visible"
      >
        {/* Column 1 */}
        <div className="min-h-[200px]">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 border-b-4 border-newPrimary pb-2">
            Terms and Conditions
          </h1>
          <p className="text-gray-800 mb-4 leading-relaxed">
            Welcome to <span className="font-semibold text-newPrimary">Infinity Bytes</span> Mall of Lahore, Cantt, Lahore. Contact #: 0310xxxxx. By using our website, you agree to these terms.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mb-2">1. General Terms</h2>
          <ul className="list-disc list-inside text-gray-800 space-y-1">
            <li>All products are subject to availability</li>
            <li>Prices may change without notice</li>
            <li>We reserve the right to refuse service</li>
            <li>You must be 18+ or have parental consent to purchase</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900 mt-4 mb-2">2. Intellectual Property</h2>
          <ul className="list-disc list-inside text-gray-800 space-y-1">
            <li>All website content is our exclusive property</li>
            <li>Unauthorized use may violate copyright laws</li>
            <li>Trademarks are registered to Infinity Bytes</li>
          </ul>
        </div>

        {/* Column 2 */}
        <div className="min-h-[200px]">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">3. User Obligations</h2>
          <ul className="list-disc list-inside text-gray-800 space-y-1">
            <li>Provide accurate information when ordering</li>
            <li>Do not misuse payment systems</li>
            <li>No fraudulent transactions permitted</li>
            <li>You're responsible for account security</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900 mt-4 mb-2">4. Limitation of Liability</h2>
          <p className="text-gray-800 mb-4 leading-relaxed">
            Infinity Bytes shall not be liable for:
            <ul className="list-disc list-inside text-gray-800 space-y-1 mt-2">
              <li>Indirect, incidental or consequential damages</li>
              <li>Errors in product descriptions</li>
              <li>Delivery delays beyond our control</li>
            </ul>
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mb-2">5. Governing Law</h2>
          <p className="text-gray-800 mb-4 leading-relaxed">
            These terms shall be governed by and construed in accordance with the laws of Pakistan. Any disputes shall be subject to the exclusive jurisdiction of courts in Lahore.
          </p>

          <p className="text-sm italic text-gray-600">
            Last updated: August 2025 . For questions, contact us at{" "}
            <a
              href="mailto:support@infinitybytes.com"
              className="text-newPrimary underline"
            >
             support@infinitybytes.com
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
