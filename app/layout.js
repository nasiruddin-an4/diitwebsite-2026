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
    title: "Daffodil Institute of Technology (DIIT)",
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
  },
};

export default function RootLayout({ children }) {
  // We extract pathname from headers in a server component (dirty trick) or use ClientLayout
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
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
      </head>
      <body className={`${manrope.variable} antialiased font-sans`} suppressHydrationWarning={true}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
