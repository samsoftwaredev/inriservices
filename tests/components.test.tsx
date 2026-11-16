import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SiteHeader } from '../src/components/SiteHeader';
import { SiteFooter } from '../src/components/SiteFooter';
import { ContactActions } from '../src/components/ContactActions';
import { ServiceCard } from '../src/components/ServiceCard';
import { FaqList } from '../src/components/FaqList';
import { Callout } from '../src/components/Callout';
import { SectionHeading } from '../src/components/SectionHeading';
import { business } from '../src/data/business';
import { services } from '../src/data/services';
import { commonFaqs } from '../src/lib/faq';

describe('marketing components', () => {
  it('renders accessible primary navigation without account links', () => {
    render(<SiteHeader />);
    expect(screen.getByRole('navigation',{name:'Primary navigation'})).toBeInTheDocument();
    expect(screen.queryByText(/sign up|log in/i)).not.toBeInTheDocument();
    expect(screen.getByRole('link',{name:`${business.name} homepage`})).toHaveAttribute('href','/');
  });
  it('renders the call and email CTAs as functional links', () => {
    render(<ContactActions />);
    expect(screen.getByRole('link',{name:`Call ${business.name} at ${business.phoneDisplay}`})).toHaveAttribute('href',`tel:${business.phone}`);
    expect(screen.getByRole('link',{name:'Request an Estimate'})).toHaveAttribute('href',expect.stringContaining(`mailto:${business.email}`));
  });
  it('links a service card to its real service detail page', () => {
    render(<ServiceCard service={services[0]} />);
    expect(screen.getByRole('link',{name:services[0].shortTitle})).toHaveAttribute('href',`/services/${services[0].slug}`);
  });
  it('renders expandable useful FAQs', () => {
    render(<FaqList questions={commonFaqs} />);
    expect(screen.getAllByText(/\?/).length).toBeGreaterThan(0);
    expect(screen.getByText(commonFaqs[0].answer)).toBeInTheDocument();
  });
  it('renders a section heading and conversion callout', () => {
    render(<><SectionHeading eyebrow="Test eyebrow" title="Main section" description="Description"/><Callout /></>);
    expect(screen.getByRole('heading',{name:'Main section'})).toBeInTheDocument();
    expect(screen.getByRole('heading',{name:'Ready to discuss your project?'})).toBeInTheDocument();
  });
  it('renders footer with a phone number and links', () => {
    render(<SiteFooter />);
    expect(screen.getByRole('navigation',{name:'Footer navigation'})).toBeInTheDocument();
    expect(screen.getByRole('link',{name:business.phoneDisplay})).toHaveAttribute('href',`tel:${business.phone}`);
  });
});
