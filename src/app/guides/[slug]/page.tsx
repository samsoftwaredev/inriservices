import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { guides, getGuide, guidePath } from '../../../data/guides';
import { getService } from '../../../data/services';
import { articleJsonLd, breadcrumbJsonLd, pageMetadata, safeJsonLd } from '../../../lib/seo';
import { Callout } from '../../../components/Callout';

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return guides.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return { title: 'Guide not found', robots: { index: false, follow: false } };
  return pageMetadata({ title: guide.metaTitle, description: guide.description, path: guidePath(slug), imageKey: slug });
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();
  const path = guidePath(guide.slug);
  const related = guide.related.flatMap((s) => { const sv = getService(s); return sv ? [sv] : []; });
  const jsonLd = [
    breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Guides', path: '/guides' }, { name: guide.title, path }]),
    articleJsonLd({ title: guide.title, description: guide.description, path, published: guide.published }),
  ];
  return (
    <main id="main-content">
      <section className="page-hero"><div className="container narrow">
        <nav aria-label="Breadcrumb" className="breadcrumb"><Link href="/">Home</Link><span aria-hidden="true"> / </span><Link href="/guides">Guides</Link><span aria-hidden="true"> / </span><span aria-current="page">{guide.metaTitle}</span></nav>
        <h1>{guide.title}</h1>
        <p>{guide.description}</p>
        <p className="article-meta">By INRI Paint &amp; Wall LLC · Published <time dateTime={guide.published}>{new Date(guide.published + 'T12:00:00Z').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}</time></p>
      </div></section>
      <section className="section"><article className="container reading-content">
        {guide.sections.map((s) => (
          <section key={s.heading}>
            <h2>{s.heading}</h2>
            {s.paragraphs?.map((p) => <p key={p}>{p}</p>)}
            {s.list && <ul>{s.list.map((i) => <li key={i}>{i}</li>)}</ul>}
          </section>
        ))}
        <h2>Related services</h2>
        <ul>{related.map((sv) => <li key={sv.slug}><Link href={`/services/${sv.slug}`}>{sv.shortTitle}</Link>: {sv.summary}</li>)}</ul>
        <p>More <Link href="/guides">homeowner guides</Link>.</p>
      </article></section>
      <div className="container"><Callout title="Have a question about your home?" message="Send us photos and a short description. We will tell you what the job involves and give you an estimate ($30, deducted from your final price if you go ahead)." /></div>
      {jsonLd.map((d, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(d) }} />)}
    </main>
  );
}
