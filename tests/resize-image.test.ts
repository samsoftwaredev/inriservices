import { describe, it, expect, vi, afterEach } from 'vitest';
import { resizeImage } from '../src/lib/resizeImage';

afterEach(() => vi.unstubAllGlobals());
const file = (size: number, type = 'image/jpeg', name = 'p.jpg') => new File([new Uint8Array(size)], name, { type });

describe('resizeImage', () => {
  it('rejects non-image and unsupported types', async () => {
    await expect(resizeImage(file(10, 'application/pdf', 'x.pdf'))).rejects.toThrow('unsupported');
    await expect(resizeImage(file(10, 'image/gif', 'x.gif'))).rejects.toThrow('unsupported');
  });
  it('keeps a small original when the browser cannot decode it', async () => {
    vi.stubGlobal('createImageBitmap', vi.fn().mockRejectedValue(new Error('no decode')));
    const f = file(1000);
    expect(await resizeImage(f)).toBe(f);
  });
  it('rejects a large original that cannot be shrunk', async () => {
    vi.stubGlobal('createImageBitmap', vi.fn().mockRejectedValue(new Error('no decode')));
    await expect(resizeImage(file(2_500_000))).rejects.toThrow('too_large');
  });
  it('returns a smaller re-encoded JPEG when resizing succeeds', async () => {
    vi.stubGlobal('createImageBitmap', vi.fn().mockResolvedValue({ width: 4000, height: 3000 }));
    const canvas = { width: 0, height: 0, getContext: () => ({ drawImage: vi.fn() }), toBlob: (cb: (b: Blob | null) => void) => cb(new Blob([new Uint8Array(500)], { type: 'image/jpeg' })) };
    const spy = vi.spyOn(document, 'createElement').mockReturnValue(canvas as unknown as HTMLElement);
    const out = await resizeImage(file(3_000_000, 'image/png', 'big.png'));
    expect(out.name).toBe('big.jpg');
    expect(out.type).toBe('image/jpeg');
    expect(out.size).toBeLessThan(3_000_000);
    expect(canvas.width).toBe(1600);
    spy.mockRestore();
  });
});
