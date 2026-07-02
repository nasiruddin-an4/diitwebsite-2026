import { Manrope } from "next/font/google";
import "./globals.css";
import ClientLayout from "./ClientLayout";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

// AEO & SEO Optimization Metadata
export const metadata = {
  title: {
    default: "Daffodil Institute of Information Technology (DIIT)",
    template: "%s | DIIT",
  },
  description:
    "Daffodil Institute of Information Technology (DIIT) provides superior education, empowering students with the skills required to excel in the technology and business sectors. Learn, innovate, and grow.",
  keywords: [
    "DIIT",
    "Daffodil Institute of Information Technology",
    "University in Bangladesh",
    "IT Education",
    "Business Degree",
    "Best tech institute BD",
  ],
  authors: [{ name: "DIIT Administration" }],
  creator: "DIIT",
  publisher: "Daffodil Institute of Information Technology",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Daffodil Institute of Information Technology (DIIT)",
    description: "Empowering students through innovative education.",
    url: "https://diit.edu.bd",
    siteName: "DIIT",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "yoursiteverification",
    other: {
      "msvalidate.01": "89A69082F30BCB96EAA807E92331C3A6",
    },
  },
};

export default function RootLayout({ children }) {
  // We extract pathname from headers in a server component (dirty trick) or use ClientLayout
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-P9W7ZR82');`,
          }}
        />
        {/* End Google Tag Manager */}
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-33SB0W857C"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-33SB0W857C');`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "CollegeOrUniversity",
                name: "Daffodil Institute of Information Technology",
                alternateName: "DIIT",
                url: "https://diit.edu.bd",
                logo: "https://diit.edu.bd/logo.svg",
                contactPoint: {
                  "@type": "ContactPoint",
                  telephone: "+880 1847-140188",
                  contactType: "Customer Service",
                  areaServed: "BD",
                  availableLanguage: ["English", "Bengali"],
                },
                location: {
                  "@type": "Place",
                  address: {
                    "@type": "PostalAddress",
                    streetAddress:
                      "Daffodil Plaza, 4/2 Sobhanbag (6th & 7th Floor) Mirpur Road, Dhanmondi, Dhaka-1207",
                    addressLocality: "Dhaka",
                    addressRegion: "Dhaka Division",
                    postalCode: "1207",
                    addressCountry: "BD",
                  },
                },
                sameAs: [
                  "https://www.facebook.com/DaffodilInstituteofIT/",
                  "https://www.linkedin.com/school/diit-nu/?viewAsMember=true",
                ],
              },
              {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: [
                  {
                    "@type": "Question",
                    name: "What programs does Daffodil Institute of Information Technology (DIIT) offer?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "DIIT offers comprehensive undergraduate programs including BBA, B.Sc. in Computer Science & Engineering (CSE), and BTHM, operating under the National University of Bangladesh.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "How can I apply for admission at DIIT?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Prospective students can apply directly through the official National University portal or visit the DIIT Admissions Office at Daffodil Plaza in Dhaka. Minimum GPA eligibility requirements apply.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Does DIIT provide career placement assistance?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Yes, DIIT possesses strong industry affiliations and dedicates extensive resources to practical career training, placement services, and robust alumni networking to successfully integrate graduates into the workforce.",
                    },
                  },
                ],
              },
            ]),
          }}
        />
        {/* LinkedIn Insight Tag */}
        <script
          dangerouslySetInnerHTML={{
            __html: `_linkedin_partner_id = "10508729";
window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
window._linkedin_data_partner_ids.push(_linkedin_partner_id);`,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(l) {
if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
window.lintrk.q=[]}
var s = document.getElementsByTagName("script")[0];
var b = document.createElement("script");
b.type = "text/javascript";b.async = true;
b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
s.parentNode.insertBefore(b, s);})(window.lintrk);`,
          }}
        />
      </head>
      <body className={`${manrope.variable} antialiased font-sans`} suppressHydrationWarning={true}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-P9W7ZR82"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <ClientLayout>{children}</ClientLayout>
        {/* LinkedIn Insight Tag (noscript) */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            alt=""
            src="https://px.ads.linkedin.com/collect/?pid=10508729&fmt=gif"
          />
        </noscript>
      </body>
    </html>
  );
}
