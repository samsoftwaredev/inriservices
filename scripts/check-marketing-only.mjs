// No dependencies: catches accidental reintroduction of app/auth/DB features.
import { readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
const root=new URL('../',import.meta.url);
const target=new URL('../src/',import.meta.url);
const prohibited=/(supabase|@supabase|authprovider|createclient\(|sign[ -]?up|log[ -]?in|dashboard|receiptgenerator|invoicetable|contractgenerator)/i;
let issues=[];
function visit(dir){for(const ent of readdirSync(dir,{withFileTypes:true})){
  const path=join(dir,ent.name); if(ent.isDirectory())visit(path);else if(/\.(ts|tsx|js|jsx|json)$/.test(ent.name)){
    const content=readFileSync(path,'utf8'); if(prohibited.test(content))issues.push(relative(new URL('.',root).pathname,path));
  }
}}
visit(target.pathname);
if(issues.length){console.error('Legacy application features detected:', issues.join(', '));process.exit(1)}
console.log('Marketing-only check passed: no database, auth, signup, dashboard or billing code found in src/.');
