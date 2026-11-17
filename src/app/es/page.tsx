import type { Metadata } from 'next';
import Link from 'next/link';
import { business, hours, paymentMethods } from '../../data/business';
import { patchPackages, bundleOffer } from '../../data/offers';
import { services } from '../../data/services';
import { pageMetadata } from '../../lib/seo';
import { CrewFigure } from '../../components/CrewFigure';
import { SectionHeading } from '../../components/SectionHeading';

export const metadata: Metadata = pageMetadata({
  title: 'Pintores y Reparación de Drywall en Garland, TX',
  description: 'Pintura interior y exterior, reparación de paneles de yeso (drywall), gabinetes y más en Garland y el área de Dallas. Presupuesto de $30 que se descuenta del precio final. Llame a INRI Paint & Wall.',
  path: '/es',
  languages: { 'en-US': '/', 'es-US': '/es', 'x-default': '/' },
});

/** Spanish copy for the main landing content. Have a native speaker review before launch. */
const names: Record<string, { title: string; text: string }> = {
  'interior-painting': { title: 'Pintura interior', text: 'Paredes, techos y molduras con buena preparación y un acabado limpio.' },
  'exterior-painting': { title: 'Pintura exterior', text: 'Pintura exterior, preparación de superficies, sellado y reparación de molduras.' },
  'drywall-repair': { title: 'Reparación e instalación de drywall', text: 'Agujeros, grietas y secciones dañadas, con acabado y textura que se mezclan.' },
  'cabinet-painting': { title: 'Pintura de gabinetes', text: 'Preparación, imprimación y acabado pintado para cocinas y baños.' },
  'popcorn-ceiling-removal': { title: 'Remoción de techo de palomitas (popcorn)', text: 'Eliminación o reparación de textura en techos, con imprimación y pintura.' },
  'trim-and-wood-repair': { title: 'Molduras y reparación de madera', text: 'Zócalos, molduras, sellado y reparaciones menores de madera.' },
  'wall-retexturing': { title: 'Retexturizado de paredes', text: 'Texturas modernas para un look actualizado.' },
  'wallpaper-removal': { title: 'Remoción de papel tapiz', text: 'Quitamos el papel viejo y preparamos las paredes para pintura.' },
  'deck-and-fence-staining': { title: 'Teñido y sellado de terrazas y cercas', text: 'Limpieza, tinte y sellador para proteger la madera exterior.' },
  'pressure-washing': { title: 'Lavado a presión', text: 'Limpie y restaure superficies exteriores.' },
};
const pkg = ['Parche pequeño · 1–5 pulgadas', 'Parche mediano · 6–12 pulgadas', 'Parche grande · 13+ pulgadas'];
const blurbs = ['Arreglos rápidos para daños menores', 'Para reparaciones moderadas que requieren precisión', 'Reparaciones extensas que requieren más material y tiempo'];

export default function SpanishHome() {
  return (
    <main id="main-content" lang="es">
      <section className="page-hero"><div className="container narrow">
        <p className="eyebrow">Garland, Texas • Pintura y drywall</p>
        <h1>Pintura y reparación de drywall en Garland, TX</h1>
        <p>Pintura interior y exterior, reparación de paneles de yeso, gabinetes, techos y molduras para casas en Garland y comunidades cercanas. El presupuesto cuesta $30 y se descuenta del precio final si contrata el servicio.</p>
        <div className="contact-actions">
          <a className="button primary" href={`tel:${business.phone}`} data-analytics-location="es_hero" data-analytics-cta="call">Llame al {business.phoneDisplay}</a>
          <a className="button outline" href={`sms:${business.phone}`} data-analytics-location="es_hero" data-analytics-cta="text">Envíenos un mensaje</a>
        </div>
        <p className="lang-link"><Link href="/" hrefLang="en">View this page in English</Link></p>
      </div></section>
      <ul className="container trust-strip" aria-label="Por qué elegirnos">
        {['Negocio familiar', 'Con licencia y seguro', 'Presupuesto de $30, se descuenta del proyecto'].map((t) => <li key={t}>{t}</li>)}
      </ul>
      <section className="section"><div className="container split-content">
        <div><p className="eyebrow">Negocio familiar</p><h2>Conozca a nuestro equipo</h2><p>Somos más que pintores: también somos dueños de casa. Por eso tratamos cada proyecto con el cuidado y el respeto que merece. Nuestro equipo pone la limpieza y la calidad primero.</p></div>
        <CrewFigure photoKey="garage-team" sizes="(min-width: 960px) 520px, 92vw" />
      </div></section>
      <section className="section section-tint"><div className="container">
        <SectionHeading eyebrow="Servicios" title="Lo que hacemos" />
        <div className="services-grid">
          {services.map((s) => (
            <article className="service-card" key={s.slug}>
              <span className="service-icon" aria-hidden="true">{s.icon}</span>
              <h3>{names[s.slug]?.title ?? s.shortTitle}</h3>
              <p>{names[s.slug]?.text ?? s.summary}</p>
            </article>
          ))}
        </div>
      </div></section>
      <section className="section section-tint"><div className="container">
        <SectionHeading eyebrow="Precios" title="Paquetes y precios" description="Precios iniciales para reparaciones de parches en drywall." />
        <div className="package-grid">
          {patchPackages.map((p, i) => <article className="package-card" key={p.name}><p className="package-size">{pkg[i]}</p><p className="package-price">{p.price}</p><p>{blurbs[i]}</p></article>)}
        </div>
        <p className="package-bundle"><strong>3 parches pequeños + pintura de retoque: solo {bundleOffer.price}</strong></p>
        <p className="payment-note">Aceptamos {paymentMethods.join(', ')}.</p>
      </div></section>
      <section className="section" id="estimate"><div className="container split-content">
        <div>
          <p className="eyebrow">Zonas de servicio</p>
          <h2>Presupuesto de $30</h2>
          <p>Atendemos Garland, Dallas, Richardson, Plano, Mesquite, Rowlett, Rockwall y Addison. Horario: lunes a sábado, 9:00 a. m. a 5:00 p. m. ({hours.closed.replace('Sunday: closed', 'domingo: cerrado')}).</p>
          <p>Cuéntenos qué necesita y envíe fotos si puede. Si habla español, puede escribirnos o llamarnos en cualquier momento.</p>
        </div>
        <div className="quote-panel"><h3>Solicite su presupuesto</h3><p>Si contrata el servicio, los $30 se descuentan del precio final. Llámenos o envíenos un mensaje, o complete el formulario.</p><div className="contact-actions"><a className="button primary" href={`tel:${business.phone}`} data-analytics-location="es_quote" data-analytics-cta="call">Llame al {business.phoneDisplay}</a><a className="button outline" href={`sms:${business.phone}`} data-analytics-location="es_quote" data-analytics-cta="text">Envíenos un mensaje</a><Link className="button outline" href="/contact#estimate" data-analytics-location="es_quote" data-analytics-cta="estimate_form">Formulario (en inglés)</Link></div></div>
      </div></section>
    </main>
  );
}
