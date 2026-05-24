"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export function TermsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-4xl max-h-[85vh] bg-white rounded-2xl shadow-xl z-50 flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-[#0A1628]">Terms &amp; Conditions</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto prose prose-slate max-w-none text-[14px] leading-relaxed text-gray-700">
              <p className="text-sm text-gray-500 mb-6">Last Updated on 24th July 2024</p>
              
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-[#0A1628] mb-4">Terms &amp; Condition applied to Roll-off & Rubber Wheeled</h3>
                <section>
                  <p><strong>1. Invoice Charges and Payments.</strong> Customer shall pay the contractor in accordance with charges, or any increases thereto as set forth in this Agreement. Contractors, homeowners shall be charged upfront on the first day the order is placed for all roll off and rubber wheel dumpster services.</p>
                </section>
                <section>
                  <p><strong>2. Payment dispute.</strong> In the event Customer disputes credit card charge such as overweight fees, dry run fees, as agreed upon, Blue Sky Disposal may, upon 5 days’ written notice to Customer remove its equipment and any materials deposited therein, or may leave the equipment on site, without providing service until payment in full is made. The customer will remain personally liable for all the fees incurred for nonpayment and legal fees will be applicable.</p>
                </section>
                <section>
                  <p><strong>3. Cancellations.</strong> If Customer has purchased the dumpster via credit card through Stripe, PayPal, Authorized.net and would like to cancel the order, Blue Sky Disposal reserves the right to charge 10% of your total cost and will refund the difference back onto the customer’s credit card.</p>
                </section>
                <section>
                  <p><strong>4. Definition of Equipment.</strong> The term “equipment” as used herein, shall mean all equipment and containers provided by Blue Sky Disposal providing the services as noted on the face of this Agreement. All equipment provided by Blue Sky Disposal, which Customer has not purchased shall remain the property of Blue Sky Disposal and Customer shall have no right, or interest in the equipment and the equipment shall be returned to Blue Sky Disposal in the same condition as received upon termination of this agreement.</p>
                </section>
                <section>
                  <p><strong>5. Waste Materials, Services Rendered.</strong> Customer guarantees that the waste materials delivered to Blue Sky Disposal under this Agreement will not contain any hazardous, toxic or radioactive waste or other special waste as those terms are defined under applicable federal, state and or local laws or regulation defined substances (e.g., tires, liquids). Customer shall retain liability to all waste materials. Blue Sky Disposal shall be entitled to return the equipment to Customer’s site for unloading waste material that is rejected at the disposal site or that otherwise violated this paragraph. Customer shall identify, defend and hold Blue Sky Disposal harmless from and against all claims, liabilities, fines and costs of any nature whatsoever, arising out of the breach stated above, including extra hauling and/or disposal fees incurred. Customer shall also not load equipment waste control and waste recycling company for all Customer’s locations within Blue Sky Disposal’s geographical service areas. This agreement’s terms and conditions shall supersede customer –issued agreements and/or purchase orders.</p>
                </section>
                <section>
                  <p><strong>6. Placement Areas.</strong> Customer guarantees and represents that any right of way provided by Customer from Customer’s equipment placement location to the most convenient public way, is sufficient to hold the weight of all the Blue Sky Disposal’s equipment and vehicles required to perform the service herein contracted. Blue Sky Disposal shall not be responsible for damage for any private pavement or accompanying subsurface of any route necessary to perform the services contained herein and shall not be responsible for overhead objects such as electrical wire, overhanging rooflines or leaves, trees, ect. Customer agrees that Blue Sky Disposal shall have access to its Equipment at all times. If a container cannot be accessed by driver upon arrival due to, but not limited to, reasons such as overloading or blocked access, a $150.00 per hour demurrage fee shall be applied to Customer’s credit card on file by Blue Sky Disposal. Customer shall defend and hold Blue Sky Disposal harmless from all claims, Damages, suits, penalties, fines, liabilities, and extra costs for any such damage or for extra hauling fees due to inaccessibility of equipment.</p>
                </section>
                <section>
                  <p><strong>7. Force Majeure.</strong> Blue Sky Disposal’s failure to perform its obligations under this Agreement, if caused by Force Majeure, shall not constitute breach. “Force Majeure” means any circumstance beyond the reasonable control of Blue Sky Disposal, including but not limited to, any act of God or a public enemy, accident, explosion, fire, storm, earthquake, other natural disaster, strikes, labor, trouble, riot or war, or mechanical or technological malfunctions.</p>
                </section>
                <section>
                  <p><strong>8. Changes.</strong> Changes in frequency of collection service, locations, or in the number, capacity and type of Equipment, may be agreed in writing by the parties. Customer’s change of its business shall not terminate this agreement when the Customer’s new location and or new owner is within Blue Sky Disposal’s service area unless otherwise provided in writing by Customer.</p>
                </section>
                <section>
                  <p><strong>9. Corporate Authority, Personal Guaranty.</strong> The Customer’s individual signatory to this Agreement hereby agrees that he/she is an authorized agent of Customer, has been directed to enter into this Agreement on behalf of Customer and has full authority to bind Customer to all the terms and conditions contained in this Agreement. If the owner or the officer of the corporation is signing this agreement, the owner or officer individually signing personally guarantees that payment shall be made should the corporation for any reason fail to make necessary payments. Legal action filed against the individual signing and/or the corporation is at the Blue Sky Disposal’s own discretion. Contractor reverses the right to assign this Agreement and/or delegate its obligations hereunder. If Customer sells all parts of its business, this agreement shall be honered by and bind the new owner’s of Customer’s business. Blue Sky Disposal may utilize a subcontractor at any time in performing the services herein.</p>
                </section>
                <section>
                  <p><strong>10. Cost Increases.</strong> Because landfill charges, fuel costs and/or other vendor costs are a significant cost of the services provided by Blue Sky Disposal and/or its vendors under the Agreement, Blue Sky Disposal may increase the price due to the increased costs of nature.</p>
                </section>
              </div>

              <hr className="border-gray-200 my-8" />

              <div className="space-y-6">
                <h3 className="text-xl font-bold text-[#0A1628] mb-4">Terms &amp; Condition applied to Front-load / Permanent Dumpsters</h3>
                <section>
                  <p><strong>1. Invoice Charges and Payments.</strong> Customer shall pay the contractor in accordance with charges or any increases thereto as set forth in this Agreement. Contractor shall be charged upfront on the first day of each month for front end load services and upon services for the roll off services.</p>
                </section>
                <section>
                  <p><strong>2. Payment dispute.</strong> In the event Customer disputes credit card charge such as overweight fees, dry run fees as agreed upon, Blue Sky Disposal may, upon 8 days’ written notice to Customer remove its equipment and any materials deposited therein, or may leave the equipment on site, without providing service until payment in full is made. The customer will remain personally liable for all the fees incurred for nonpayment and legal fees will be applicable.</p>
                </section>
                <section>
                  <p><strong>3. Terms &amp; Early Termination.</strong> The term of this agreement is for 12 months beginning the date this agreement is signed. The agreement shall be automatically extended and renewed for additional 12 periods (renewal term) unless Customer shall give written notice of termination by certified mail return receipt requested to the Contractor at least 90 days prior to, but not more than one-hundred-twenty- four days prior to the expiration date of the initial term or any renewal term prior to Contractor’s acceptance of cancellation. Contractor shall have the right to match any offers given to the customer by a competitor. Contractor may terminate this agreement at any time with notice to the Customer. In the event the customer breaches this agreement terminates the service prior to the expiration of the initial term or any renewal term, closes its business or transport its own waste, customer shall be liable to contractor for all damages, suffered or incurred of whatever kind of nature including, without limitation, direct incidental and consequential damages (including lost revenue/profits and/or removal of equipment) Customer understands that the actual damage to the company in the event of termination is difficult to fix and liquidated damages amount is reasonable with the anticipated loss to the company resulting from such termination and is an agreed upon fee and is not imposed as a penalty. This fee shall be calculated with remaining number of months on the agreement, multiplied by the average monthly revenue generated by Customer from the performance of start date, multiplied by thirty -two percent in the event there is less than six months remaining on this agreement, an additional five hundred dollars shall be added to the fee if the customer averaged more than seven hundred dollars per month in revenue. This formula does not include costs for the removal of the equipment which is a separate charge by contractor.</p>
                </section>
                <section>
                  <p><strong>4. Definition of Equipment.</strong> The term “equipment” as used herein, shall mean all equipment and containers provided by Blue Sky Disposal providing the services as noted on the face of this Agreement. All equipment provided by Blue Sky Disposal, which Customer has not purchased shall remain the property of Blue Sky Disposal and Customer shall have no right, or interest in the equipment and the equipment shall be returned to Blue Sky Disposal in the same condition as received upon termination of this agreement.</p>
                </section>
                <section>
                  <p><strong>5. Waste Materials, Services Rendered.</strong> Customer guarantees that the waste materials delivered to Blue Sky Disposal under this Agreement will not contain any hazardous, toxic or radioactive waste or other special waste as those terms are defined under applicable federal, state and or local laws or regulation defined substances (e.g., tires, liquids). Customer shall retain liability to all waste materials. Blue Sky Disposal shall be entitled to return the equipment to Customer’s site for unloading waste material that is rejected at the disposal site or that otherwise violated this paragraph. Customer shall identify, defend and hold Blue Sky Disposal harmless from and against all claims, liabilities, fines and costs of any nature whatsoever, arising out of the breach stated above, including extra hauling and/or disposal fees incurred. Customer shall also not load equipment waste control and waste recycling company for all Customer’s locations within Blue Sky Disposal’s geographical service areas. This agreement’s terms and conditions shall supersede customer –issued agreements and/or purchase orders.</p>
                </section>
                <section>
                  <p><strong>6. Placement Areas.</strong> Customer guarantees and represents that any right of way provided by Customer from Customer’s equipment placement location to the most convenient public way, is sufficient to hold the weight of all the Blue Sky Disposal’s equipment and vehicles required to perform the service herein contracted. Blue Sky Disposal shall not be responsible for damage for any private pavement or accompanying subsurface of any route necessary to perform the services contained herein and shall not be responsible for overhead objects such as electrical wire, overhanging rooflines or leaves, trees, ect. Customer agrees that Blue Sky Disposal shall have access to its Equipment at all times. If a container cannot be accessed by driver upon arrival due to, but not limited to, reasons such as overloading or blocked access, a $150.00 per hour demurrage fee shall be applied to Customer’s bill by Blue Sky Disposal. Customer shall defend and hold Blue Sky Disposal harmless from all claims, Damages, suits, penalties, fines, liabilities, and extra costs for any such damage or for extra hauling fees due to inaccessibility of equipment.</p>
                </section>
                <section>
                  <p><strong>7. Force Majeure.</strong> Blue Sky Disposal’s failure to perform its obligations under this Agreement, if caused by Force Majeure, shall not constitute breach. “Force Majeure” means any circumstance beyond the reasonable control of Blue Sky Disposal, including but not limited to, any act of God or a public enemy, accident, explosion, fire, storm, earthquake, other natural disaster, strikes, labor, trouble, riot or war, or mechanical or technological malfunctions.</p>
                </section>
                <section>
                  <p><strong>8. Changes.</strong> Changes in frequency of collection service, locations, or in the number, capacity and type of Equipment, may be agreed in writing by the parties. Customer’s change of its business shall not terminate this agreement when the Customer’s new location and or new owner is within Blue Sky Disposal’s service area unless otherwise provided in writing by Customer. If Customer and /or new owner relocate outside of Blue Sky Disposal’s service area, then Customer shall be released from this Agreement.</p>
                </section>
                <section>
                  <p><strong>9. Corporate Authority, Personal Guaranty.</strong> The Customer’s individual signatory to this Agreement hereby agrees that he/she is an authorized agent of Customer, has been directed to enter into this Agreement on behalf of Customer and has full authority to bind Customer to all the terms and conditions contained in this Agreement. If the owner or the officer of the corporation is signing this agreement, the owner or officer individually signing personally guarantees that payment shall be made should the corporation for any reason fail to make necessary payments. Legal action filed against the individual signing and/or the corporation is at the Blue Sky Disposal’s own discretion. Contractor reverses the right to assign this Agreement and/or delegate its obligations hereunder. If Customer sells all parts of its business, this agreement shall be homered by and bind the new owner’s of Customer’s business. Contractor may utilize a subcontractor at any time in performing the services herein.</p>
                </section>
                <section>
                  <p><strong>10. Cost Increases.</strong> Because landfill charges, fuel costs and/or other vendor costs are a significant cost of the services provided by Blue Sky Disposal and/or its vendors under the Agreement, Blue Sky Disposal may increase the price due to the increased costs of nature.</p>
                </section>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-100 flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-[#DAA520] hover:bg-[#c5951c] text-white font-bold rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function PrivacyModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-4xl max-h-[85vh] bg-white rounded-2xl shadow-xl z-50 flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-[#0A1628]">Privacy Policy</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto prose prose-slate max-w-none text-[14px] leading-relaxed text-gray-700">
              <p className="text-sm text-gray-500 mb-6">Last Updated on 24th July 2024</p>
              
              <div className="space-y-6">
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
                <p>By using our Website, you acknowledge that you have read, understood, and agree to this Privacy Policy.</p>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-100 flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-[#DAA520] hover:bg-[#c5951c] text-white font-bold rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
