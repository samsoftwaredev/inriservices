import type { Metadata } from 'next';
import { pageMetadata } from '../../lib/seo';
import { business } from '../../data/business';

export const metadata: Metadata = pageMetadata({
  title: 'Privacy Policy',
  description: 'How INRI Paint & Wall LLC collects, uses and protects information submitted through our website, including estimate requests, photos and analytics.',
  path: '/privacy-policy',
});

const updated = 'November 15, 2026';

export default function PrivacyPage() {
  return (
    <main id="main-content">
      <section className="page-hero"><div className="container narrow">
        <p className="eyebrow">Legal</p>
        <h1>Privacy policy</h1>
        <p>Last updated {updated}.</p>
      </div></section>
      <section className="section"><div className="container reading-content">
        <h2>Who we are</h2>
        <p>{business.name} is a painting and drywall repair company based in Garland, Texas. This policy covers {business.url.replace('https://', '')}.</p>
        <h2>Information you give us</h2>
        <p>When you request an estimate we collect your name, phone number, email address and a description of your project. If you call, text or email us, we receive the contact details you use.</p>
        <h2>How we use it</h2>
        <ul>
          <li>To respond to your request, schedule an estimate and communicate about your project.</li>
          <li>To keep business records of the work we quote and perform.</li>
        </ul>
        <p>We do not sell your information or use it for third-party advertising.</p>
        <h2>Analytics</h2>
        <p>We use Google Analytics 4 to understand how visitors use the site, such as which pages are viewed and whether people tap the call, text or email buttons or start the estimate form. Analytics receives page and device information and may set cookies. We never send what you type into the form, your name, phone number or email to Analytics, and we have turned off Google Signals and ad personalization. You can block analytics with your browser settings or by using the <a href="https://tools.google.com/dlpage/gaoptout">Google Analytics opt-out add-on</a>.</p>
        <h2>Service providers</h2>
        <p>Estimate requests are collected with Google Forms, which is provided by Google and subject to Google&apos;s privacy policy, and we receive them by email. The website is hosted by a cloud hosting provider, and maps on the site are also provided by Google. These providers process information only to provide their services to us.</p>
        <h2>How long we keep information</h2>
        <p>We keep estimate requests for as long as needed to respond and to maintain our business records, then delete them when no longer needed.</p>
        <h2>Your choices</h2>
        <p>You can ask us to access, correct or delete the information you have given us by emailing <a href={`mailto:${business.email}`}>{business.email}</a> or calling <a href={`tel:${business.phone}`}>{business.phoneDisplay}</a>.</p>
        <h2>Children</h2>
        <p>This site is for adults hiring painting services and is not directed to children.</p>
        <h2>Changes</h2>
        <p>We may update this policy and will change the date above when we do.</p>
        <h2>Contact</h2>
        <p>{business.name}, Garland, Texas. <a href={`mailto:${business.email}`}>{business.email}</a>.</p>
      </div></section>
    </main>
  );
}
