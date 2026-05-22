import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const metadata = {
  title: "Privacy Policy | Blue Sky Disposal",
  description: "Privacy Policy for Blue Sky Disposal dumpster rental services.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-white min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 py-12 md:py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0A1628] mb-2">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-500 mb-10">
            Last Updated on 24th July 2024
          </p>

          <div className="prose prose-slate max-w-none space-y-6 text-[15px] leading-relaxed text-gray-700">
            <p>This Privacy Policy outlines the privacy practices of Bluesky Disposal (“we,” “our,” or “us”) concerning the collection, use, and disclosure of personal information when you access and use our website: https://blueskydisposal.com/ (the “Website”). Your privacy is of utmost importance to us, and we are committed to protecting the information you share with us. By accessing and using our Website, you agree to the practices described in this Privacy Policy.</p>
            
            <h3 className="text-lg font-bold text-[#0A1628]">Information We Collect:</h3>
            <p><strong>1.1. Personal Information:</strong> When you visit our Website, we may collect personal information that you provide voluntarily, such as your name, email address, phone number, and other contact details when you sign up for our newsletter, fill out contact forms, or make purchases.</p>
            <p><strong>1.2. Usage Information:</strong> We may automatically collect certain information about your interaction with our Website, including your IP address, browser type, operating system, referring URLs, pages viewed, access times, and other information related to your visit.</p>

            <h3 className="text-lg font-bold text-[#0A1628]">Use of Collected Information:</h3>
            <p><strong>2.1. Personal Information:</strong> We may use your personal information to communicate with you, respond to your inquiries, process your orders, and provide you with information about our products, services, and promotions. With your consent, we may also send you marketing communications and updates regarding our offerings.</p>
            <p><strong>2.2. Usage Information:</strong> The usage information we collect helps us to analyze trends, administer the Website, improve user experience, and gather demographic information for statistical purposes.</p>

            <h3 className="text-lg font-bold text-[#0A1628]">Cookies and Similar Technologies:</h3>
            <p>We use cookies and similar technologies to enhance your experience on our Website. Cookies are small data files stored on your device that enable certain functionalities and preferences. You can adjust your browser settings to refuse cookies; however, this may limit some features of the Website.</p>

            <h3 className="text-lg font-bold text-[#0A1628]">Third-Party Services:</h3>
            <p>We may use third-party services, such as analytics providers or payment processors, to assist us in operating the Website or conducting business activities. These third-party services may collect and process your personal information on our behalf, but they are bound by their own privacy policies.</p>

            <h3 className="text-lg font-bold text-[#0A1628]">Data Security:</h3>
            <p>We implement reasonable security measures to protect your personal information from unauthorized access, disclosure, or destruction. However, please note that no method of transmission over the internet or electronic storage is entirely secure, and we cannot guarantee absolute security.</p>

            <h3 className="text-lg font-bold text-[#0A1628]">Disclosure of Information:</h3>
            <p>We do not sell, trade, or rent your personal information to third parties. However, we may share your personal information with trusted service providers who assist us in operating our business. We may also disclose your information if required by law or to protect our rights, privacy, safety, or property.</p>

            <h3 className="text-lg font-bold text-[#0A1628]">Children’s Privacy:</h3>
            <p>Our Website is not intended for use by individuals under the age of 13. We do not knowingly collect personal information from children under 13 years of age. If you are a parent or guardian and believe that your child has provided us with personal information, please contact us, and we will take appropriate steps to remove such information from our records.</p>

            <h3 className="text-lg font-bold text-[#0A1628]">Your Choices:</h3>
            <p>You may update, correct, or delete your personal information by contacting us. You can also opt-out of receiving marketing communications by following the unsubscribe instructions provided in our emails.</p>

            <h3 className="text-lg font-bold text-[#0A1628]">Changes to this Privacy Policy:</h3>
            <p>We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. The most current version will be posted on this page, and the “Last Updated” date will be revised accordingly.</p>

            <h3 className="text-lg font-bold text-[#0A1628]">Contact Us:</h3>
            <p>If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:</p>
            <ul className="list-none p-0 m-0 space-y-1">
              <li><strong>Email:</strong> blueskydisposal@gmail.com</li>
              <li><strong>Address:</strong> 42815 Garfield Rd Suite # 202 Clinton Twp MI 48038</li>
              <li><strong>Phone:</strong> 586-412-3762</li>
            </ul>
            <p className="mt-4">By using our Website, you acknowledge that you have read, understood, and agree to this Privacy Policy.</p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
