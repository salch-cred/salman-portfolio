// Builds the ATS resume PDF from lib/resume.ts: one column, no tables, no images, real text.
import { createWriteStream } from 'node:fs';
import PDFDocument from 'pdfkit';
import { RESUME as R } from '../lib/resume.ts';

const dir = 'node_modules/@fontsource/ibm-plex-sans/files';
const REG = `${dir}/ibm-plex-sans-latin-400-normal.woff`;
const BOLD = `${dir}/ibm-plex-sans-latin-600-normal.woff`;
const INK = '#17161a';
const SOFT = '#4a4944';
const M = 44;

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 30, bottom: 24, left: M, right: M },
  info: {
    Title: 'Mahammad Salman Resume',
    Author: 'Mahammad Salman',
    Subject: 'AI/ML Engineer and Full-Stack Developer',
    Keywords: 'AI/ML Engineer, Machine Learning, Python, TypeScript, Full-Stack Developer, AI Agents, LLM, RAG',
  },
});
doc.pipe(createWriteStream('public/Mahammad-Salman-Resume.pdf'));
doc.registerFont('reg', REG).registerFont('bold', BOLD);

const W = doc.page.width - M * 2;

function heading(t: string) {
  doc.moveDown(0.5);
  doc.font('bold').fontSize(10).fillColor(INK).text(t.toUpperCase(), { characterSpacing: 0.8 });
  const y = doc.y + 1.5;
  doc.moveTo(M, y).lineTo(M + W, y).lineWidth(0.7).strokeColor(INK).stroke();
  doc.y = y + 4;
}

function bullets(list: string[]) {
  doc.font('reg').fontSize(9.4).fillColor(INK);
  doc.list(list, { bulletRadius: 1.3, textIndent: 9, bulletIndent: 1, lineGap: 0.8, paragraphGap: 0.6 });
}

doc.font('bold').fontSize(21).fillColor(INK).text(R.name);
doc.font('reg').fontSize(10.5).text(R.title);
doc.moveDown(0.1);
doc.fontSize(9).fillColor(SOFT).text(R.contact.join('  |  '));

heading('Summary');
doc.font('reg').fontSize(9.4).fillColor(INK).text(R.summary, { lineGap: 0.8 });

heading('Skills');
for (const [k, v] of R.skills) {
  doc.font('bold').fontSize(9.4).fillColor(INK).text(`${k}: `, { continued: true, lineGap: 0.8 });
  doc.font('reg').text(v);
}

heading('Experience');
for (const e of R.experience) {
  doc.font('bold').fontSize(9.8).fillColor(INK).text(`${e.role}, ${e.org}`);
  doc.font('reg').fontSize(9).fillColor(SOFT).text(e.meta);
  doc.moveDown(0.12);
  bullets(e.bullets);
}

heading('Projects');
R.projects.forEach((p, i) => {
  if (i) doc.moveDown(0.22);
  doc.font('bold').fontSize(9.8).fillColor(INK).text(p.name, { continued: true });
  doc.font('reg').fontSize(9).fillColor(SOFT).text(`  |  ${p.tech}`);
  bullets(p.bullets);
});

heading('Education');
for (const e of R.education) {
  doc.font('bold').fontSize(9.6).fillColor(INK).text(e.degree);
  doc.font('reg').fontSize(9).fillColor(SOFT).text([e.school, e.meta].filter(Boolean).join(' | '));
}

doc.end();
console.log('pages', doc.bufferedPageRange().count);
