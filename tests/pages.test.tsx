import { describe, it, expect } from 'vitest';
import type { ComponentType } from 'react';
import { render, screen } from '@testing-library/react';
import Home from '../src/app/page';
import About from '../src/app/about/page';
import Services from '../src/app/services/page';
import Areas from '../src/app/areas/page';
import Contact from '../src/app/contact/page';
import Faq from '../src/app/frequently-asked-questions/page';
import Estimates from '../src/app/pricing-and-estimates/page';
import NotFound from '../src/app/not-found';
import { services } from '../src/data/services';
import { business } from '../src/data/business';

describe('all static marketing pages', () => {
  const pages: {label:string; Page:ComponentType; heading:string}[] = [
    {label:'home',Page:Home,heading:'Painting & drywall repair'},
    {label:'about',Page:About,heading:'Thoughtful preparation'},
    {label:'services',Page:Services,heading:'Painting, drywall and finishing'},
    {label:'areas',Page:Areas,heading:'Painting services near Garland'},
    {label:'contact',Page:Contact,heading:'Request a painting or drywall estimate'},
    {label:'faqs',Page:Faq,heading:'Painting and drywall FAQs'},
    {label:'estimates',Page:Estimates,heading:'Clear painting and drywall project estimates'},
    {label:'not found',Page:NotFound,heading:"We could not find that page"},
  ];
  it.each(pages)('renders $label with its own single H1',({Page,heading})=>{
    const {container}=render(<Page />);
    expect(container.querySelectorAll('h1')).toHaveLength(1);
    expect(screen.getByRole('heading',{level:1}).textContent).toContain(heading);
  });
  it('links every service to its detail page from the homepage', () => {
    render(<Home />);
    for (const service of services) expect(screen.getByRole('link',{name:service.shortTitle})).toHaveAttribute('href',`/services/${service.slug}`);
  });
  it('lists real service cities without inventing an address', () => {
    render(<Areas />);
    for (const city of business.areaCities) expect(screen.getByRole('heading',{name:`${city}, TX`})).toBeInTheDocument();
    expect(screen.queryByText(/Balcones|Austin/i)).not.toBeInTheDocument();
  });
});
