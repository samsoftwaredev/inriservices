import { describe, it, expect, vi, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import { RevealGroup } from '../src/components/RevealGroup';

afterEach(() => vi.unstubAllGlobals());

describe('RevealGroup', () => {
  it('leaves content visible and unarmed when IntersectionObserver is unavailable', () => {
    vi.stubGlobal('IntersectionObserver', undefined);
    const { container } = render(<RevealGroup className="g"><p>a</p><p>b</p></RevealGroup>);
    expect(container.querySelector('.g')?.getAttribute('data-reveal')).toBeNull();
  });
  it('arms children, staggers them and marks each in view when it intersects', () => {
    let callback: IntersectionObserverCallback = () => {};
    const observed: Element[] = [];
    vi.stubGlobal('IntersectionObserver', class { constructor(cb: IntersectionObserverCallback) { callback = cb; } observe(el: Element) { observed.push(el); } unobserve() {} disconnect() {} });
    const { container } = render(<RevealGroup className="g" columns={2}><p>a</p><p>b</p><p>c</p></RevealGroup>);
    const group = container.querySelector('.g') as HTMLElement;
    expect(group.dataset.reveal).toBe('ready');
    expect(observed).toHaveLength(3);
    expect((observed[2] as HTMLElement).style.getPropertyValue('--i')).toBe('0');
    expect((observed[1] as HTMLElement).style.getPropertyValue('--i')).toBe('1');
    callback([{ isIntersecting: true, target: observed[0] } as unknown as IntersectionObserverEntry, { isIntersecting: false, target: observed[1] } as unknown as IntersectionObserverEntry], {} as IntersectionObserver);
    expect('in' in (observed[0] as HTMLElement).dataset).toBe(true);
    expect('in' in (observed[1] as HTMLElement).dataset).toBe(false);
  });
});
