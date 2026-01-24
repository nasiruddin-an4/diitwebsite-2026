import React from 'react';

export const metadata = {
    title: 'Privacy Policy | DIIT',
    description: 'Privacy Policy for Daffodil Institute of IT (DIIT)',
};

export default function PrivacyPage() {
    return (
        <div className="bg-neutral-50 min-h-screen font-sans pb-20">
            {/* Header */}
            <div className="bg-[#001229] py-20 text-center">
                <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
                <p className="text-blue-200">Last updated: January 2026</p>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-6 -mt-10 relative z-10">
                <div className="bg-white rounded-xl shadow-xl p-10 md:p-14 border border-gray-100">
                    <div className="prose prose-lg max-w-none text-gray-600">
                        <p>
                            At Daffodil Institute of IT (DIIT), accessible from our website, one of our main priorities is the privacy of our visitors.
                            This Privacy Policy document contains types of information that is collected and recorded by DIIT and how we use it.
                        </p>

                        <h3 className="text-blue-900 font-bold mt-8 mb-4">1. Information We Collect</h3>
                        <p>
                            The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.
                        </p>
                        <p>
                            If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.
                        </p>

                        <h3 className="text-blue-900 font-bold mt-8 mb-4">2. How We Use Your Information</h3>
                        <p>
                            We use the information we collect in various ways, including to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Provide, operate, and maintain our website</li>
                            <li>Improve, personalize, and expand our website</li>
                            <li>Understand and analyze how you use our website</li>
                            <li>Develop new products, services, features, and functionality</li>
                            <li>Communicate with you, either directly or through one of our partners</li>
                            <li>Send you emails</li>
                            <li>Find and prevent fraud</li>
                        </ul>

                        <h3 className="text-blue-900 font-bold mt-8 mb-4">3. Log Files</h3>
                        <p>
                            DIIT follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks.
                        </p>

                        <h3 className="text-blue-900 font-bold mt-8 mb-4">4. Cookies and Web Beacons</h3>
                        <p>
                            Like any other website, DIIT uses "cookies". These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
                        </p>

                        <h3 className="text-blue-900 font-bold mt-8 mb-4">5. Third Party Privacy Policies</h3>
                        <p>
                            DIIT's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.
                        </p>

                        <h3 className="text-blue-900 font-bold mt-8 mb-4">6. Contact Us</h3>
                        <p>
                            If you have any questions about our Privacy Policy, please do not hesitate to contact us.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
