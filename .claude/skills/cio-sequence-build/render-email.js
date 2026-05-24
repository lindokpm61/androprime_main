#!/usr/bin/env node
/**
 * Andro Prime email-copy → house-style HTML renderer.
 *
 * Converts a sequence copy file (`email-templates/sequences/seq-NN-*.md`) into
 * the verified 600px house template — the same skeleton produced by hand for
 * seq-01/03/04/05/06. Deterministic part of the cio-sequence-build workflow:
 * it removes the hand-typing and the template drift, NOT the human review.
 *
 * Usage (run from repo root):
 *   node .claude/skills/cio-sequence-build/render-email.js <copy.md> [options]
 *
 * Options:
 *   --email N        Render only "## Email N ..." (default: all emails)
 *   --context "..."  Footer "You're receiving this because…" line override
 *   --out-dir PATH   Output dir (default: email-templates/html rel. to repo)
 *   --prefix STR     Filename prefix (default: derived from copy filename)
 *   --dry            Print what would be written; create nothing
 *
 * What it does deterministically:
 *   - Splits on `## Email N`, reads **Subject:** / **Preview:** lines.
 *   - Body = text after the first `---` until the next `## ` heading.
 *   - Liquid lines ({% … %}) pass through raw so branch structure is kept.
 *   - **bold** → <strong>, [t](u)/bare URLs → <a>, 1./-/* → <ol>/<ul>.
 *   - A bold-only line → bold Inter lead-in. A `**Label:** URL` line → black
 *     button. A `**Kit n…/Daily Stack/…**` block + its CTA → bordered card.
 *   - `Keith` / `— Keith` + `Andro Prime` tail → signature block.
 *   - A trailing `_italic_` note after a `---` → muted disclaimer block.
 *
 * What still needs a human eye (printed as REVIEW notes): card vs inline-CTA
 * layout, {% else %} fallbacks for unset attributes, and per-email preheader.
 * This never talks to Customer.io and never sets sending_state.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const DEFAULT_OUT = 'andro-prime/09_website-app/frontend/email-templates/html';

// Footer context line by sequence prefix. Override with --context.
const FOOTER_CONTEXT = {
  'seq-01': "You're receiving this because you joined the Andro Prime waitlist.",
  'seq-02': "You're receiving this because you purchased an Andro Prime kit.",
  'seq-03a': "You're receiving this because you purchased an Andro Prime kit.",
  'seq-03b': "You're receiving this because you purchased an Andro Prime kit.",
  'seq-03c': "You're receiving this because you purchased an Andro Prime kit.",
  'seq-03d': "You're receiving this because you purchased an Andro Prime kit.",
  'seq-04': "You're receiving this because you have an Andro Prime supplement subscription.",
  'seq-05': "You're receiving this because you have an Andro Prime supplement subscription.",
  'seq-06': "You're receiving this because you completed the Andro Prime test selector.",
};
const FOOTER_DEFAULT = "You're receiving this because you signed up with Andro Prime.";

const GEORGIA = "font-family:Georgia,'Times New Roman',serif; font-size:16px; line-height:1.7; color:#000000;";
const INTER_LEAD = "font-family:'Inter',Arial,Helvetica,sans-serif; font-size:14px; font-weight:700; color:#000000;";
const BTN = "display:inline-block; padding:12px 24px; font-family:'Inter',Arial,Helvetica,sans-serif; font-size:13px; font-weight:900; letter-spacing:0.1em; text-transform:uppercase; color:#ffffff; text-decoration:none;";

function die(m) { console.error(`ERROR: ${m}`); process.exit(1); }

// ---- args ----
const argv = process.argv.slice(2);
const copyPath = argv[0];
if (!copyPath || copyPath.startsWith('--')) die('usage: render-email.js <copy.md> [--email N] [--context "…"] [--out-dir PATH] [--prefix STR] [--dry]');
const opt = (name, def) => { const i = argv.indexOf(name); return i >= 0 && argv[i + 1] ? argv[i + 1] : def; };
const onlyEmail = opt('--email', null);
const ctxOverride = opt('--context', null);
const outDir = opt('--out-dir', DEFAULT_OUT);
const dry = argv.includes('--dry');
if (!fs.existsSync(copyPath)) die(`cannot find copy file ${copyPath}`);

const base = path.basename(copyPath).replace(/\.md$/, '');           // seq-06-quiz-nurture
const prefix = opt('--prefix', (base.match(/^(seq-\d+[a-d]?)/) || [, base])[1]); // seq-06
const footer = ctxOverride || FOOTER_CONTEXT[prefix] || FOOTER_DEFAULT;

const md = fs.readFileSync(copyPath, 'utf8').replace(/\r\n/g, '\n');

// ---- inline markdown → html (Liquid left intact) ----
function inline(s) {
  s = s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+)\)/g,
    (_, t, u) => `<a href="${u}" style="color:#000000;">${t}</a>`);
  // bare URL / mailto not already in an anchor
  s = s.replace(/(^|[\s(])((?:https?:\/\/|mailto:)[^\s<)]+)(?![^<]*<\/a>)/g,
    (_, p, u) => `${p}<a href="${u}" style="color:#000000;">${u}</a>`);
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/£/g, '&pound;').replace(/—/g, '&mdash;').replace(/–/g, '&ndash;');
  return s.trim();
}
const isLiquid = l => /^\{%.*%\}$/.test(l.trim());
const para = (html, mb = 20) => `              <p style="margin:0 0 ${mb}px; ${GEORGIA}">\n                ${html}\n              </p>`;
const leadIn = html => `              <p style="margin:0 0 6px; ${INTER_LEAD}">\n                ${html}\n              </p>`;
function button(label, url) {
  return [
    '              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 28px;">',
    '                <tr>', '                  <td style="background-color:#000000;">',
    `                    <a href="${url}" style="${BTN}">${inline(label)}</a>`,
    '                  </td>', '                </tr>', '              </table>'].join('\n');
}

// ---- body block renderer ----
function renderBody(body) {
  const lines = body.split('\n');
  const out = [];
  const review = [];
  let i = 0, buf = [];
  const flush = (mb) => { if (buf.length) { out.push(para(buf.join(' '), mb)); buf = []; } };

  while (i < lines.length) {
    let raw = lines[i];
    const line = raw.trim();

    if (line === '') { flush(); i++; continue; }

    // Liquid structural line — keep verbatim, outside <p>
    if (isLiquid(line)) { flush(); out.push(`              ${line}`); i++; continue; }

    // signature tail: "Keith" / "— Keith" then "Andro Prime"
    if (/^(—\s*)?Keith$/.test(line) && /^Andro Prime$/.test((lines[i + 1] || '').trim())) {
      flush();
      out.push(`              <p style="margin:0 0 4px; ${GEORGIA}">\n                ${inline(line)}\n              </p>`);
      out.push(`              <p style="margin:0; font-family:'Inter',Arial,Helvetica,sans-serif; font-size:13px; font-weight:700; letter-spacing:0.05em; text-transform:uppercase; color:#000000;">\n                Andro Prime\n              </p>`);
      i += 2; continue;
    }

    // trailing italic disclaimer: _text_
    if (/^_.+_$/.test(line)) {
      flush();
      out.push(`              <p style="margin:0; padding-top:20px; border-top:1px solid #e5e7eb; font-family:Georgia,'Times New Roman',serif; font-size:14px; font-style:italic; line-height:1.6; color:#6b7280;">\n                ${inline(line.replace(/^_|_$/g, ''))}\n              </p>`);
      i++; continue;
    }

    // standalone CTA line: **Label:** URL
    let m = line.match(/^\*\*([^*]+?)\:?\*\*[:\s]*((?:https?:\/\/|mailto:)\S+)$/);
    if (m) { flush(); out.push(button(m[1], m[2])); review.push(`button "${m[1].trim()}" → ${m[2]}`); i++; continue; }

    // product card: **Kit n… / Daily Stack / Complete / Collagen / Joint …**
    m = line.match(/^\*\*(.+?)\*\*$/);
    if (m && /^(Kit\s*\d|Daily Stack|Complete|Collagen|Joint)/i.test(m[1])) {
      flush();
      let title = m[1], price = '';
      const pm = title.match(/^(.*?)\s*[-–—:]\s*(£\s?[\d.,]+.*)$/);
      if (pm) { title = pm[1].trim(); price = pm[2].trim(); }
      i++;
      const cardLines = [];
      while (i < lines.length) {
        const l = (lines[i] || '').trim();
        if (l === '' ) { i++; continue; }
        if (isLiquid(l) || /^## /.test(l) || /^\*\*(.+?)\*\*$/.test(l) && /^(Kit\s*\d|Daily Stack|Complete|Collagen|Joint)/i.test(l.replace(/\*\*/g,''))) break;
        const cta = l.match(/^\*\*([^*]+?)\:?\*\*[:\s]*((?:https?:\/\/|mailto:)\S+)$/);
        if (cta) { cardLines.push({ btn: [cta[1], cta[2]] }); i++; break; }
        cardLines.push({ p: l }); i++;
      }
      const inner = [];
      inner.push(`                    <p style="margin:0 0 ${price ? '4' : '16'}px; font-family:'Inter',Arial,Helvetica,sans-serif; font-size:13px; font-weight:900; letter-spacing:0.1em; text-transform:uppercase; color:#000000;">${inline(title)}</p>`);
      if (price) inner.push(`                    <p style="margin:0 0 16px; font-family:'Inter',Arial,Helvetica,sans-serif; font-size:13px; font-weight:700; color:#000000;">${inline(price)}</p>`);
      for (const c of cardLines) {
        if (c.p) inner.push(`                    <p style="margin:0 0 16px; ${GEORGIA}">${inline(c.p)}</p>`);
        if (c.btn) inner.push([
          '                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">',
          '                      <tr>', '                        <td style="background-color:#000000;">',
          `                          <a href="${c.btn[1]}" style="${BTN}">${inline(c.btn[0])}</a>`,
          '                        </td>', '                      </tr>', '                    </table>'].join('\n'));
      }
      out.push([
        '              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 28px; border:2px solid #000000;">',
        '                <tr>', '                  <td style="padding:24px 28px;">',
        inner.join('\n'),
        '                  </td>', '                </tr>', '              </table>'].join('\n'));
      review.push(`card "${title}"${price ? ' (' + price + ')' : ''} — confirm layout`);
      continue;
    }

    // bold-only line → Inter lead-in (e.g. numbered section headers)
    m = line.match(/^\*\*(.+?)\*\*$/);
    if (m) { flush(); out.push(leadIn(inline(line))); i++; continue; }

    // list block
    if (/^(\d+\.|[-*])\s+/.test(line)) {
      flush();
      const ordered = /^\d+\./.test(line);
      const items = [];
      while (i < lines.length && /^(\d+\.|[-*])\s+/.test((lines[i] || '').trim())) {
        items.push(inline((lines[i].trim().replace(/^(\d+\.|[-*])\s+/, ''))));
        i++;
      }
      const tag = ordered ? 'ol' : 'ul';
      out.push(`              <${tag} style="margin:0 0 20px; padding-left:22px; ${GEORGIA}">\n` +
        items.map((t, n) => `                <li style="margin-bottom:${n === items.length - 1 ? '0' : '10'}px;">${t}</li>`).join('\n') +
        `\n              </${tag}>`);
      continue;
    }

    buf.push(inline(line));
    i++;
  }
  flush();
  return { html: out.join('\n'), review };
}

// ---- full-page skeleton ----
function page(subject, bodyHtml) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${subject.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=Merriweather:wght@300;400;700&display=swap');
    body { margin: 0; padding: 0; background-color: #f9fafb; }
    * { box-sizing: border-box; }
    a { color: #000000; }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#f9fafb; font-family:Georgia,'Times New Roman',serif;">

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f9fafb;">
    <tr>
      <td align="center" style="padding:32px 16px;">

        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width:600px; width:100%; background-color:#ffffff; border:2px solid #000000;">

          <!-- Header -->
          <tr>
            <td style="padding:28px 40px 24px; border-bottom:2px solid #000000;">
              <p style="margin:0; font-family:'Inter',Arial,Helvetica,sans-serif; font-size:13px; font-weight:900; letter-spacing:0.15em; text-transform:uppercase; color:#000000;">Andro Prime</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">

${bodyHtml}

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px 28px; border-top:2px solid #000000;">
              <p style="margin:0; font-family:'Inter',Arial,Helvetica,sans-serif; font-size:12px; color:#6b7280; line-height:1.6;">
                ${footer}
                <br>
                <a href="{% unsubscribe_url %}" style="color:#6b7280;">Unsubscribe</a> &nbsp;&middot;&nbsp;
                Andro Prime Ltd &nbsp;&middot;&nbsp; United Kingdom
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
`;
}

// ---- split into emails ----
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);
const sections = md.split(/\n(?=## Email \d)/).filter(s => /^## Email \d/.test(s.trim()));
if (!sections.length) die('no "## Email N" sections found in copy file');

let wrote = 0;
for (const sec of sections) {
  const head = sec.match(/^## Email (\d+)\s*[-–—:]?\s*(.*)/m);
  if (!head) continue;
  const n = head[1];
  if (onlyEmail && onlyEmail !== n) continue;
  const titlePart = (head[2] || '').split(':').pop().trim() || `email-${n}`;
  const subj = (sec.match(/^\*\*Subject:\*\*\s*(.+)$/m) || [, ''])[1].trim();
  const prev = (sec.match(/^\*\*(?:Preview|Preview text):\*\*\s*(.+)$/m) || [, ''])[1].trim();
  if (!subj) { console.log(`Email ${n}: no **Subject:** found — skipped`); continue; }

  // body = after the first `---` that follows the Subject/Preview header,
  // up to the Build-Notes / next heading (split already handled next email).
  let bodyRaw = sec;
  const hr = bodyRaw.indexOf('\n---\n', bodyRaw.indexOf('**Subject:**'));
  bodyRaw = hr >= 0 ? bodyRaw.slice(hr + 5) : bodyRaw;
  bodyRaw = bodyRaw.split(/\n## (?:Customer\.io|Build|Liquid)/)[0];
  // drop a lone closing `---` and anything after a Build-Notes table fragment
  bodyRaw = bodyRaw.replace(/\n---\s*$/g, '\n').trim();

  const { html, review } = renderBody(bodyRaw);
  if (/\{%\s*if\b/.test(html) && !/\{%\s*else\s*%\}/.test(html))
    review.push('Liquid branch has no {% else %} — add a fallback for unset attributes');
  const fname = `${prefix}-email-${n}-${slug(titlePart)}.html`;
  const dest = path.join(outDir, fname);
  const out = page(subj, html);

  console.log(`\nEmail ${n} → ${fname}`);
  console.log(`  subject  : ${subj}`);
  console.log(`  preheader: ${prev || '(none — set manually)'}`);
  if (review.length) review.forEach(r => console.log(`  REVIEW   : ${r}`));
  if (dry) { console.log('  (dry run — not written)'); continue; }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, out, 'utf8');
  wrote++;
}
console.log(dry ? '\nDry run complete.' : `\n${wrote} file(s) written to ${outDir}. Review the REVIEW lines, then build the campaign and upload via upload-content.js.`);
