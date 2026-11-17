import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { business } from '../src/data/business';
import { services } from '../src/data/services';

const root=process.cwd();
function readSourceTree(dir:string):string {
  return readdirSync(dir,{withFileTypes:true}).map(entry=>{
    const path=join(dir,entry.name);
    return entry.isDirectory()?readSourceTree(path):/\.(ts|tsx)$/.test(entry.name)?readFileSync(path,'utf8'):'';
  }).join('\n');
}

describe('content integrity and marketing-only scope',()=>{
  it('has no authentication, billing, Supabase or backend modules',()=>{
    const content=readSourceTree(join(root,'src'));
    expect(content).not.toMatch(/@supabase|createClient\(|AuthProvider|\/auth\/login|\/dashboard|ReceiptGenerator|InvoiceTable/);
    const deps=Object.keys(JSON.parse(readFileSync(join(root,'package.json'),'utf8')).dependencies);
    expect(deps).toEqual(['next','react','react-dom']);
  });
  it('has no fictional author, example images or expired promos',()=>{
    const content=readSourceTree(join(root,'src'));
    expect(content).not.toMatch(/Jane Doe|example\.com|July 1(st)?, 2025/);
    expect(content).not.toMatch(/5900 Balcones|Austin/);
  });
  it('does not claim free estimates, a workmanship warranty or EPA lead-safe/RRP certification', () => {
    const content=readSourceTree(join(root,'src'));
    expect(content).not.toMatch(/free (in-person )?estimate|estimates are free|no-obligation|workmanship warranty|6-month|\bRRP\b|lead-safe|presupuestos? gratis|garant[ií]a de mano/i);
  });
  it('keeps each service meaningful and the business phone consistent',()=>{
    expect(business.phone).toBe('+14696467286');
    expect(services.map(s=>s.slug)).toContain('drywall-repair');
  });
});
