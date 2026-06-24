import fs from 'fs';
const dir = './staging-wellness';
const files = fs.readdirSync(dir).filter(f=>f.endsWith('.csv') && f!=='consolidate.csv');
// load existing master to flag coverage
let master = new Set();
try {
  const m = fs.readFileSync('../keywords.csv','utf8').split(/\r?\n/).slice(1);
  for (const l of m){ const q=l.split(',')[0]?.trim().toLowerCase(); if(q) master.add(q); }
} catch(e){}
const rows = new Map(); // query -> {vol,kd,intent,pillars:Set}
for (const f of files){
  const pillar = f.replace(/-(suggest|related)\.csv$/,'');
  const lines = fs.readFileSync(`${dir}/${f}`,'utf8').split(/\r?\n/).slice(1);
  for (const ln of lines){
    if(!ln.trim()) continue;
    const parts = ln.split(',');
    const q = parts[0]?.trim().toLowerCase();
    const vol = parseInt(parts[1]) || 0;
    const kd = parts[2]?.trim();
    const intent = parts[5]?.trim() || '';
    if(!q) continue;
    if(!rows.has(q)) rows.set(q,{q,vol,kd,intent,pillars:new Set()});
    const r = rows.get(q);
    if(vol>r.vol) r.vol=vol;
    r.pillars.add(pillar);
  }
}
const all = [...rows.values()].map(r=>({...r,pillars:[...r.pillars].join('|'),inMaster:master.has(r.q)}));
// dump full sorted
all.sort((a,b)=>b.vol-a.vol);
fs.writeFileSync(`${dir}/consolidated-all.csv`,'query,vol,kd,intent,pillars,in_master\n'+all.map(r=>`${r.q},${r.vol},${r.kd},${r.intent},${r.pillars},${r.inMaster}`).join('\n'));
console.log('TOTAL UNIQUE:',all.length, '| already in master:', all.filter(r=>r.inMaster).length, '| NEW:', all.filter(r=>!r.inMaster).length);
console.log('\n=== TOP 35 NEW (not in master) by volume ===');
console.log('vol\tkd\tintent\tpillars\tquery');
for(const r of all.filter(r=>!r.inMaster).slice(0,35)) console.log(`${r.vol}\t${r.kd}\t${r.intent}\t${r.pillars}\t${r.q}`);
