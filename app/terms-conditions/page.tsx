import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const metadata = {
  title: "Terms & Conditions | Green Deck Dumpster Rentals",
  description: "Terms and Conditions for Green Deck dumpster rental services.",
};

export default function TermsConditionsPage() {
  return (
    <main className="bg-white min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 py-12 md:py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-[#142A52] mb-2">
            Terms &amp; Conditions
          </h1>
          <p className="text-sm text-gray-500 mb-10">
            Last updated: May 19, 2026
          </p>

          <div className="prose prose-slate max-w-none space-y-8 text-[15px] leading-relaxed text-gray-700">
            {/* 1 */}
            <section>
              <h2 className="text-xl font-bold text-[#142A52] mb-3">
                1. Service Agreement
              </h2>
              <p>
                By placing an order through Green Deck Dumpster Rentals, you
                agree to these Terms &amp; Conditions. This agreement governs
                the rental, delivery, use, and pick-up of dumpster containers
                provided by our company.
              </p>
            </section>

            {/* 2 */}
            <section>
              <h2 className="text-xl font-bold text-[#142A52] mb-3">
                2. Rental Period
              </h2>
              <p>
                The standard rental period is included in your selected plan
                (typically 7 or 14 days depending on dumpster type). Additional
                days beyond the included rental period are billed at{" "}
                <strong>$25 per day</strong>. The rental period begins on the
                date of delivery.
              </p>
            </section>

            {/* 3 */}
            <section>
              <h2 className="text-xl font-bold text-[#142A52] mb-3">
                3. Pricing &amp; Payment
              </h2>
              <p>
                All prices listed on the website are in US Dollars (USD). The
                total price includes delivery, pick-up, and disposal within the
                included weight limit. Overweight charges, surcharges for heavy
                materials, and extra-day fees are outlined during checkout.
                Payment is due in full at the time of booking.
              </p>
            </section>

            {/* 4 */}
            <section>
              <h2 className="text-xl font-bold text-[#142A52] mb-3">
                4. Prohibited Materials
              </h2>
              <p>
                The following materials are <strong>not permitted</strong> in any
                dumpster:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Hazardous waste or chemicals</li>
                <li>Tires and batteries</li>
                <li>Paint, solvents, or flammable liquids</li>
                <li>Asbestos-containing materials</li>
                <li>Propane tanks or pressurized cylinders</li>
                <li>Medical or biological waste</li>
                <li>Electronics (where restricted by local law)</li>
              </ul>
              <p className="mt-2">
                Disposal of prohibited materials may result in additional fees
                and/or refusal of pick-up.
              </p>
            </section>

            {/* 5 */}
            <section>
              <h2 className="text-xl font-bold text-[#142A52] mb-3">
                5. Weight Limits &amp; Overage
              </h2>
              <p>
                Each dumpster has a maximum weight capacity. If the contents
                exceed the weight limit, an overage fee will apply. Heavy
                materials such as concrete, brick, dirt, or rock are subject to
                a <strong>$75 surcharge</strong> and may only be placed in
                approved container types.
              </p>
            </section>

            {/* 6 */}
            <section>
              <h2 className="text-xl font-bold text-[#142A52] mb-3">
                6. Placement &amp; Access
              </h2>
              <p>
                You are responsible for ensuring a clear, accessible area for
                dumpster delivery and pick-up. Dumpsters must be placed on a
                firm, level surface. You are responsible for any damage to
                driveways, sidewalks, or other surfaces caused by dumpster
                placement.
              </p>
            </section>

            {/* 7 */}
            <section>
              <h2 className="text-xl font-bold text-[#142A52] mb-3">
                7. Cancellation &amp; Refunds
              </h2>
              <p>
                Orders may be cancelled at no charge if the dumpster has not yet
                been dispatched. Once a dumpster has been delivered, a
                cancellation/early pick-up fee may apply. Refunds, if
                applicable, will be processed within 5–10 business days.
              </p>
            </section>

            {/* 8 */}
            <section>
              <h2 className="text-xl font-bold text-[#142A52] mb-3">
                8. Liability
              </h2>
              <p>
                Green Deck Dumpster Rentals is not liable for any injury, damage,
                or loss arising from the use of the rented dumpster. The customer
                assumes full responsibility for the proper loading and use of the
                container.
              </p>
            </section>

            {/* 9 */}
            <section>
              <h2 className="text-xl font-bold text-[#142A52] mb-3">
                9. Contact
              </h2>
              <p>
                If you have questions about these terms, please contact us at{" "}
                <a
                  href="mailto:BlueSkyDisposal@gmail.com"
                  className="text-[#C89B2B] font-semibold hover:underline"
                >
                  BlueSkyDisposal@gmail.com
                </a>{" "}
                or call{" "}
                <a
                  href="tel:5864123762"
                  className="text-[#C89B2B] font-semibold hover:underline"
                >
                  (586) 412-3762
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
