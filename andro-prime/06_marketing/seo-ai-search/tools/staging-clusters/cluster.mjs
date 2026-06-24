import fs from 'fs';
const dir='./staging-clusters';
const stop=new Set(['of','for','a','and','in','the','i','am','is','to','my','do','you','your','it','on','with','what','why','how','can','are','be','that','this','at','from','does','if']);
const sig=q=>[...new Set(q.toLowerCase().replace(/[^a-z0-9 ]/g,' ').split(/\s+/).filter(w=>w&&!stop.has(w)).map(w=>w.replace(/s$/,'')))].sort().join(' ');
const noise=/reddit|quotes|funny|meme|lyrics|song|movie|anime|game|nhs login|tiktok/i;
const groups={brainfog:['brainfog-suggest.csv','brainfog-related.csv'],testnat:['testnat-suggest.csv','testnat-related.csv']};
for(const [name,files] of Object.entries(groups)){
  const m=new Map();
  for(const f of files){
    if(!fs.existsSync(`${dir}/${f}`))continue;
    for(const ln of fs.readFileSync(`${dir}/${f}`,'utf8').split(/\r?\n/).slice(1)){
      if(!ln.trim())continue;
      const p=ln.split(',');const q=p[0]?.trim();const vol=parseInt(p[1])||0;const kd=p[2]?.trim();const intent=p[5]?.trim()||'';
      if(!q||vol<100||noise.test(q))continue;
      const s=sig(q);
      if(!m.has(s)||vol>m.get(s).vol) m.set(s,{q,vol,kd,intent});
    }
  }
  const rows=[...m.values()].sort((a,b)=>b.vol-a.vol).slice(0,22);
  console.log(`\n##### ${name.toUpperCase()} (${m.size} distinct) #####`);
  for(const r of rows) console.log(`${String(r.vol).padStart(6)}  kd${(r.kd||'-').padStart(3)}  ${r.intent.padEnd(13)}  ${r.q}`);
}
