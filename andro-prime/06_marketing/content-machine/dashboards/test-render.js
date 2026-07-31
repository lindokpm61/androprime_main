/* Render tests for content-machine-artifact.html.
 *
 * Runs the artifact's own script in a shimmed DOM and asserts on the markup it
 * produces. Shapes below are the real shapes returned by the live queries,
 * observed 2026-07-31; values are illustrative.
 *
 * The two regressions this file exists to prevent, both real:
 *   1. N renditions collapsing into one grid cell, so a week of posts and a
 *      single post render identically (six X posts were invisible this way).
 *   2. An article being unfindable because the grid showed only its title and
 *      the title had diverged from the slug everything else keys on.
 *
 * Run: node test-render.js
 */
const fs = require('fs'), path = require('path');
const html = fs.readFileSync(path.join(__dirname, 'content-machine-artifact.html'), 'utf8');
const js = html.match(/<script>([\s\S]*?)<\/script>/)[1];
const shim = js.replace('start();',
  'window.__T={renderPlan:renderPlan,renderBoard:renderBoard,renderCompose:renderCompose,' +
  'setSel:function(s){sel=s;},getSel:function(){return sel;}};');

const store = {};
function mk(id) {
  return store[id] || (store[id] = {
    id, _h: '', textContent: '', className: '',
    parentNode: { className: '' },
    classList: { add() {}, remove() {} },
    set innerHTML(v) { this._h = v; }, get innerHTML() { return this._h; },
    setAttribute(k, v) { this['_' + k] = v; }, getAttribute(k) { return this['_' + k]; },
    querySelector: () => null, querySelectorAll: () => [],
    addEventListener() {}, scrollIntoView() {}
  });
}
const win = { claude: undefined };
const doc = { getElementById: mk, querySelectorAll: () => [], addEventListener() {}, hidden: false };
new Function('window', 'document', 'navigator', shim)(win, doc, {});
const T = win.__T;

let pass = 0, fail = 0;
function ok(name, cond, detail) {
  if (cond) { pass++; console.log('  ok   ' + name); }
  else { fail++; console.log('  FAIL ' + name + (detail ? '  → ' + detail : '')); }
}
function section(s) { console.log('\n' + s); }

/* ---------- coverage grid ------------------------------------------------- */
const channels = [
  { platform:'linkedin', format:'text-post', label:'LinkedIn post', lane:'lane-1', in_plan:true,  connected:true,  publisher:'unipile',         account:'keithantony' },
  { platform:'facebook', format:'link-post', label:'Facebook post', lane:'lane-1', in_plan:true,  connected:true,  publisher:'metricool',       account:'913631891838376' },
  { platform:'substack', format:'newsletter',label:'Substack issue',lane:'lane-1', in_plan:true,  connected:true,  publisher:'substack-script', account:'keithandroprime' },
  { platform:'instagram',format:'reel',      label:'Instagram Reel',lane:'lane-2', in_plan:true,  connected:true,  publisher:'metricool',       account:'keith.antony.ai' },
  { platform:'x',        format:'text-post', label:'X post',        lane:'lane-1', in_plan:true,  connected:true,  publisher:'metricool',       account:'KeithAndroPrime' },
  { platform:'threads',  format:'text-post', label:'Threads post',  lane:'lane-1', in_plan:false, connected:true,  publisher:'metricool',       account:'keith.antony' }
];
const slots = (spec) => channels.filter(c => c.in_plan).map((c, i) => ({
  platform: c.platform, format: c.format, label: c.label, lane: c.lane,
  status: spec[i] ? spec[i][0] : null, n: spec[i] ? spec[i][1] : 0, url: null
}));

const plan = { channels, articles: [
  // The retitling case: slug and title genuinely disagree in the live data.
  { slug:'myth-of-normal-range', title:'Normal Testosterone Levels by Age: what "within range" actually means',
    category:'Testosterone', published:'2026-06-19',
    slots: slots([null, null, null, null, ['scheduled', 7]]) },          // 7 X posts, one cell
  { slug:'how-to-read-blood-test-results', title:'How to Read Your Blood Test Results',
    category:'Literacy', published:'2026-07-15',
    slots: slots([['scheduled', 1], null, ['published', 1], null, null]) }
]};

T.renderPlan(plan);
const mx = store['matrixBody'].innerHTML;

section('Coverage grid');
ok('renders one row per article', (mx.match(/<tr><td class="art"/g) || []).length === 2);
ok('renders a cell per planned channel (5 × 2 = 10)', (mx.match(/class="slotbtn/g) || []).length === 10,
   'got ' + (mx.match(/class="slotbtn/g) || []).length);
ok('REGRESSION: 7 collapsed renditions show a ×7 count', /×7/.test(mx),
   'a cell hiding N items must say so');
ok('a single rendition shows no count badge', (mx.match(/<span class="x">/g) || []).length === 1,
   'only the ×7 cell should carry a badge');
ok('REGRESSION: slug is printed under the title', mx.indexOf('myth-of-normal-range') !== -1,
   'the grid must stay searchable by slug when the title has diverged');
ok('published slot renders as live', /slotbtn live/.test(mx));
ok('empty slot renders as make', /slotbtn gap/.test(mx));
ok('coverage KPI computed', String(store['kCov'].textContent) === '30%', 'got ' + store['kCov'].textContent);
ok('articles KPI computed', String(store['kArt'].textContent) === '2', 'got ' + store['kArt'].textContent);

section('Channels');
const ch = store['channelsBody'].innerHTML;
ok('connected-without-a-lane is flagged', /connected without a lane/.test(ch));

/* ---------- board: schedule, attention, live, pipeline -------------------- */
const assets = [
  { slug:'four-things-on-the-sheet', title:'The four things every line on a blood test is telling you',
    status:'approved', preflight:'green', ewa_task:null,
    canonical:'how-to-read-blood-test-results', canonical_status:'published',
    renditions:[{ platform:'linkedin', format:'text-post', status:'scheduled', url:null, published_at:null,
      scheduled_for:'2026-08-06 10:00:00+00', publisher:'metricool', ext:'356521803',
      impressions:null, reactions:null, comments:null }] },
  { slug:'x-w01-4-built-from-one-pool', title:'Built from one pool',
    status:'approved', preflight:'green', ewa_task:null,
    canonical:'myth-of-normal-range', canonical_status:'published',
    renditions:[{ platform:'x', format:'text-post', status:'scheduled', url:null, published_at:null,
      scheduled_for:'2026-08-06 11:15:00+00', publisher:'metricool', ext:'356262295',
      impressions:null, reactions:null, comments:null }] },
  { slug:'looking-for-a-word', title:'Looking for a word',
    status:'approved', preflight:'not-run', ewa_task:null,
    canonical:'andropause-male-menopause', canonical_status:'published',
    renditions:[{ platform:'linkedin', format:'text-post', status:'to-produce', url:null, published_at:null,
      scheduled_for:null, publisher:null, ext:null, impressions:null, reactions:null, comments:null }] },
  { slug:'four-worth-seeing', title:'Four worth seeing',
    status:'scripted', preflight:'green', ewa_task:null,
    canonical:'why-am-i-always-tired', canonical_status:'published',
    renditions:[{ platform:'linkedin', format:'text-post', status:'published',
      url:'https://www.linkedin.com/posts/x', published_at:'2026-07-28 09:00:00+00',
      scheduled_for:null, publisher:'unipile', ext:'7487916942582964226',
      impressions:1200, reactions:14, comments:3 }] },
  { slug:'orphan-asset', title:'Orphan with an unknown status',
    status:'archived', preflight:'green', ewa_task:null,
    canonical:null, canonical_status:null, renditions:[] }
];

T.renderBoard(assets);

section('Going out next');
const nx = store['nextBody'].innerHTML;
ok('lists every scheduled rendition individually', (nx.match(/class="slot-row/g) || []).length === 2,
   'got ' + (nx.match(/class="slot-row/g) || []).length);
ok('excludes published renditions', nx.indexOf('Four worth seeing') === -1);
ok('excludes to-produce renditions', nx.indexOf('Looking for a word') === -1);
ok('groups the two 6 Aug posts into one day', (nx.match(/class="day-h"/g) || []).length === 1,
   'got ' + (nx.match(/class="day-h"/g) || []).length + ' day blocks');
ok('marks a same-day collision', /class="slot-row clash"/.test(nx));
ok('shows the Metricool id', nx.indexOf('356521803') !== -1);
ok('KPI counts scheduled renditions', String(store['kNext'].textContent) === '2', 'got ' + store['kNext'].textContent);

section('What needs you');
const at = store['attnBody'].innerHTML;
ok('flags live-ahead-of-gate', /Live, but the asset never reached approved/.test(at));
ok('flags approved-but-unscheduled', /still unscheduled/.test(at));
ok('flags the same-day collision', /same day/.test(at));
ok('does not invent work when a gate is clear', at.indexOf('four-things-on-the-sheet') === -1);

section('What is live');
const lv = store['liveBody'].innerHTML;
ok('lists only published renditions', (lv.match(/<tr>/g) || []).length === 2, 'header + 1 row');
ok('scheduled posts are absent, not missing', lv.indexOf('356521803') === -1);
ok('measured zero and unknown are distinguishable', /class="num"/.test(lv));
ok('live KPI counted', String(store['kLive'].textContent) === '1', 'got ' + store['kLive'].textContent);

section('Pipeline');
const pb = store['boardBody'].innerHTML;
ok('REGRESSION: an unknown status is reported, never dropped',
   /carry a status outside the known set/.test(pb) && pb.indexOf('orphan-asset') !== -1);
ok('known statuses render as columns', /approved \(3\)/.test(pb), 'three assets are approved');

section('Prompt composer');
T.setSel({ article: plan.articles[0], slot: plan.articles[0].slots[4], modeIndex: 0 });
T.renderCompose();
const cm = store['composeBody'].innerHTML;
ok('builds a command against the slug, not the title', /\/script myth-of-normal-range x/.test(cm));
ok('carries the existing-rendition count into the brief', /7 rendition/.test(cm));
ok('states the derivative-discipline rule', /Derivative discipline/.test(cm));
ok('leaves pre-flight to the owner', /preflight not-run/.test(cm));

console.log('\n' + pass + ' passed, ' + fail + ' failed.');
process.exit(fail ? 1 : 0);
