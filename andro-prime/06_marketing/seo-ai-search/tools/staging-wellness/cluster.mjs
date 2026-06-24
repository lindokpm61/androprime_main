import fs from 'fs';
const dir='./staging-wellness';
const stop=new Set(['of','for','a','and','in','the','i','am','is','to','my','do','you','your','it','on','with','what','why','how','can','are','be','that','this','at','from']);
const sig=q=>[...new Set(q.toLowerCase().replace(/[^a-z0-9 ]/g,' ').split(/\s+/).filter(w=>w&&!stop.has(w)).map(w=>w.replace(/s$/,'')))].sort().join(' ');
// branded / off-topic noise filters
const noise=/swiftqueue|nhs|swift queue|tdl|nuffield|spire|randox|medichecks|thriva|numan|forth|lloyds|superdrug|boots|near me|appointment|gp surgery|phlebotom|how long|how much does|results mean|fasting|wait/i;
const files=fs.readdirSync(dir).filter(f=>f.endsWith('.csv')&&!f.includes('consolidat')&&!f.includes('cluster'));
const byPillar={};
for(const f of files){
  const pillar=f.replace(/-(suggest|related)\.csv$/,'');
  byPillar[pillar]=byPillar[pillar]||new Map();
  for(const ln of fs.readFileSync(`${dir}/${f}`,'utf8').split(/\r?\n/).slice(1)){
    if(!ln.trim())continue;
    const p=ln.split(',');const q=p[0]?.trim();const vol=parseInt(p[1])||0;const kd=p[2]?.trim();const intent=p[5]?.trim()||'';
    if(!q||vol<200)continue; if(noise.test(q))continue;
    const s=sig(q);const m=byPillar[pillar];
    if(!m.has(s)||vol>m.get(s).vol) m.set(s,{q,vol,kd,intent});
  }
}
for(const [pillar,m] of Object.entries(byPillar)){
  const rows=[...m.values()].sort((a,b)=>b.vol-a.vol).slice(0,14);
  console.log(`\n##### ${pillar.toUpperCase()} #####`);
  for(const r of rows) console.log(`${String(r.vol).padStart(7)}  kd${(r.kd||'-').padStart(3)}  ${r.intent.padEnd(13)}  ${r.q}`);
}
