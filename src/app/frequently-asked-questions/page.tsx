import type { Metadata } from 'next';
import { pageMetadata } from '../../lib/seo';
import { commonFaqs } from '../../lib/faq';
import { FaqList } from '../../components/FaqList';
import { Callout } from '../../components/Callout';
export const metadata: Metadata = pageMetadata({ title: 'Painting & Drywall Repair FAQs in Garland', description: 'Answers about estimates, service areas, preparation, painting costs and drywall repair from INRI Paint & Wall LLC.', path: '/frequently-asked-questions' });
export default function FaqPage(){return <main id="main-content"><section className="page-hero"><div className="container narrow"><p className="eyebrow">Questions and answers</p><h1>Painting and drywall FAQs</h1><p>Helpful information before you request an estimate for your home.</p></div></section><section className="section"><div className="container narrow"><FaqList questions={commonFaqs}/></div></section><div className="container"><Callout/></div></main>}
