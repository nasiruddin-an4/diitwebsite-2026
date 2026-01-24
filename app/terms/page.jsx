import React from 'react';

export const metadata = {
    title: 'Terms of Service | DIIT',
    description: 'Terms of Service for Daffodil Institute of IT (DIIT)',
};

export default function TermsPage() {
    return (
        <div className="bg-neutral-50 min-h-screen font-sans pb-20">
            {/* Header */}
            <div className="bg-[#001229] py-20 text-center">
                <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
                <p className="text-blue-200">Last updated: January 2026</p>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-6 -mt-10 relative z-10">
                <div className="bg-white rounded-xl shadow-xl p-10 md:p-14 border border-gray-100">
                    <div className="prose prose-lg max-w-none text-gray-600">
                        <p>
                            Welcome to Daffodil Institute of IT (DIIT). These terms and conditions outline the rules and regulations for the use of DIIT's Website.
                        </p>
                        <p>
                            By accessing this website we assume you accept these terms and conditions. Do not continue to use DIIT if you do not agree to take all of the terms and conditions stated on this page.
                        </p>

                        <h3 className="text-blue-900 font-bold mt-8 mb-4">1. License</h3>
                        <p>
                            Unless otherwise stated, DIIT and/or its licensors own the intellectual property rights for all material on DIIT. All intellectual property rights are reserved. You may access this from DIIT for your own personal use subjected to restrictions set in these terms and conditions.
                        </p>
                        <p className="mb-2">You must not:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Republish material from DIIT</li>
                            <li>Sell, rent or sub-license material from DIIT</li>
                            <li>Reproduce, duplicate or copy material from DIIT</li>
                            <li>Redistribute content from DIIT</li>
                        </ul>

                        <h3 className="text-blue-900 font-bold mt-8 mb-4">2. User Comments</h3>
                        <p>
                            Parts of this website offer an opportunity for users to post and exchange opinions and information in certain areas of the website. DIIT does not filter, edit, publish or review Comments prior to their presence on the website. Comments do not reflect the views and opinions of DIIT,its agents and/or affiliates. Comments reflect the views and opinions of the person who post their views and opinions.
                        </p>

                        <h3 className="text-blue-900 font-bold mt-8 mb-4">3. Hyperlinking to our Content</h3>
                        <p>
                            The following organizations may link to our Website without prior written approval:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Government agencies;</li>
                            <li>Search engines;</li>
                            <li>News organizations;</li>
                            <li>Online directory distributors may link to our Website in the same manner as they hyperlink to the Websites of other listed businesses.</li>
                        </ul>

                        <h3 className="text-blue-900 font-bold mt-8 mb-4">4. Content Liability</h3>
                        <p>
                            We shall not be hold responsible for any content that appears on your Website. You agree to protect and defend us against all claims that is rising on your Website. No link(s) should appear on any Website that may be interpreted as libelous, obscene or criminal, or which infringes, otherwise violates, or advocates the infringement or other violation of, any third party rights.
                        </p>

                        <h3 className="text-blue-900 font-bold mt-8 mb-4">5. Reservation of Rights</h3>
                        <p>
                            We reserve the right to request that you remove all links or any particular link to our Website. You approve to immediately remove all links to our Website upon request. We also reserve the right to amen these terms and conditions and it's linking policy at any time. By continuously linking to our Website, you agree to be bound to and follow these linking terms and conditions.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
