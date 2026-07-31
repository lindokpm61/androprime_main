const fs=require('fs'), path=require('path');
const html=fs.readFileSync(path.join(__dirname,'content-machine-artifact.html'),'utf8');
const js=html.match(/<script>([\s\S]*?)<\/script>/)[1];
const shim=js.replace('start();','window.__T={renderPlan:renderPlan,renderBoard:renderBoard,renderGenerator:renderGenerator,setSel:function(s){sel=s;},getSel:function(){return sel;}};');

const store={};
function mk(id){ return store[id] || (store[id]={id,_h:'',textContent:'',classList:{add(){},remove(){}},
  set innerHTML(v){this._h=v;}, get innerHTML(){return this._h;},
  querySelector:()=>({className:'',textContent:''}), querySelectorAll:()=>[],
  addEventListener(){}, scrollIntoView(){}}); }
const win={claude:undefined, navigator:{}};
const doc={getElementById:mk, querySelectorAll:()=>[], addEventListener(){}, hidden:false};
new Function('window','document','navigator',shim)(win,doc,{});
const T=win.__T;

// real shape from the live query
const plan={channels:[
 {platform:'linkedin',format:'text-post',label:'LinkedIn post',lane:'lane-1',in_plan:true,connected:true,publisher:'unipile',account:'keithantony',notes:'Keith personal profile.'},
 {platform:'facebook',format:'link-post',label:'Facebook post',lane:'lane-1',in_plan:true,connected:true,publisher:'metricool',account:'913631891838376',notes:''},
 {platform:'substack',format:'newsletter',label:'Substack issue',lane:'lane-1',in_plan:true,connected:true,publisher:'substack-script',account:'keithandroprime',notes:''},
 {platform:'instagram',format:'reel',label:'Instagram Reel',lane:'lane-2',in_plan:true,connected:true,publisher:'metricool',account:'keith.antony.ai',notes:''},
 {platform:'tiktok',format:'short',label:'TikTok short',lane:'lane-2',in_plan:true,connected:true,publisher:'metricool',account:'keith_antony',notes:''},
 {platform:'youtube',format:'short',label:'YouTube Short',lane:'lane-2',in_plan:true,connected:true,publisher:'metricool',account:'UC...',notes:''},
 {platform:'youtube',format:'long-form',label:'YouTube long-form',lane:'lane-2',in_plan:true,connected:true,publisher:'metricool',account:'UC...',notes:''},
 {platform:'x',format:'text-post',label:'X post',lane:'lane-1',in_plan:false,connected:true,publisher:'metricool',account:'KeithAndroPrime',notes:'No lane yet.'}],
 articles:[]};
const slotsFor=(fai)=>plan.channels.filter(c=>c.in_plan).map((c,i)=>({platform:c.platform,format:c.format,label:c.label,lane:c.lane,
  status: (fai&&i===0)?'published':(fai&&i===2)?'published':null, url:(fai&&i===0)?'https://linkedin.com/x':null}));
plan.articles=[
 {slug:'free-androgen-index',title:'Free Androgen Index',category:'Testosterone',published:'2026-07-20',slots:slotsFor(true)},
 {slug:'crp-blood-test',title:'CRP Blood Test: What the Number Means',category:'Inflammation & Recovery',published:'2026-06-19',slots:slotsFor(false)},
];

T.renderPlan(plan);
const mx=store['matrixBody'].innerHTML;
console.log('matrix rows rendered   :', (mx.match(/<tr>/g)||[]).length-1);
console.log('slot buttons rendered  :', (mx.match(/class="slot/g)||[]).length, '(expect 14)');
console.log('live cells             :', (mx.match(/slot live/g)||[]).length, '(expect 2)');
console.log('gap cells              :', (mx.match(/slot gap/g)||[]).length, '(expect 12)');
console.log('coverage KPI           :', store['kCov'].textContent, '|', store['kCovNote'].textContent);
console.log('articles KPI           :', store['kArt'].textContent);
const ch=store['channelsBody'].innerHTML;
console.log('channel "no lane" flag :', /tag crit">no lane/.test(ch) ? 'shown for X' : 'MISSING');

// generator: a shorts slot on an uncovered article
T.setSel({article:plan.articles[1], slot:plan.articles[1].slots[3], modeIndex:0});
T.renderGenerator();
const g=store['genBody'].innerHTML;
const prompt=(g.match(/<pre class="prompt" id="promptText">([\s\S]*?)<\/pre>/)||[])[1]||'';
console.log('\n--- generated prompt (instagram/reel, crp-blood-test) ---');
console.log(prompt.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>'));
console.log('--- mode buttons:', (g.match(/class="modeBtn/g)||[]).length, '(expect 2: script + hooks)');
