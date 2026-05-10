/** Pinned to match installed pdfjs-dist — worker must stay in sync. */
const PDFJS_VERSION = '4.10.38';

const MAX_PAGES = 100;
export const PDF_EXTRACT_MAX_CHARS = 40000;

function pageItemsToText(textContent) {
  let out = '';
  for (const item of textContent.items) {
    if (!item || typeof item.str !== 'string') continue;
    const s = item.str;
    if (s) {
      out += s;
      if (item.hasEOL) out += '\n';
      else if (!/\s$/.test(s)) out += ' ';
    } else if (item.hasEOL) {
      out += '\n';
    }
  }
  return out
    .replace(/[ \t]+\n/g, '\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

async function loadPdfJs() {
  // Dynamic import avoids broken `import *` / default interop in some CRA/webpack setups.
  const pdfjs = await import('pdfjs-dist');
  const ns = pdfjs.default && typeof pdfjs.default === 'object' ? pdfjs.default : pdfjs;
  const getDocument = ns.getDocument ?? pdfjs.getDocument;
  const GlobalWorkerOptions = ns.GlobalWorkerOptions ?? pdfjs.GlobalWorkerOptions;

  if (typeof getDocument !== 'function') {
    const fallback = typeof globalThis !== 'undefined' ? globalThis.pdfjsLib : null;
    if (fallback && typeof fallback.getDocument === 'function') {
      return {
        getDocument: fallback.getDocument.bind(fallback),
        GlobalWorkerOptions: fallback.GlobalWorkerOptions,
      };
    }
    throw new Error('PDF.js failed to load. Try refreshing the page.');
  }

  if (GlobalWorkerOptions && !GlobalWorkerOptions.workerSrc) {
    GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${PDFJS_VERSION}/build/pdf.worker.min.mjs`;
  }

  return { getDocument, GlobalWorkerOptions };
}

/**
 * Extract human-readable text from a PDF ArrayBuffer using Mozilla PDF.js
 * (proper decoding of text objects; not raw stream bytes).
 */
export async function extractTextFromPdfArrayBuffer(arrayBuffer) {
  const { getDocument } = await loadPdfJs();

  const loadingTask = getDocument({
    data: arrayBuffer,
    useSystemFonts: true,
    standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${PDFJS_VERSION}/standard_fonts/`,
  });

  let pdf;
  try {
    pdf = await loadingTask.promise;
  } catch (err) {
    const name = err?.name || '';
    if (name === 'PasswordException') {
      throw new Error('This PDF is password-protected. Remove the password or paste the text manually.');
    }
    if (name === 'InvalidPDFException' || name === 'MissingPDFException') {
      throw new Error('Could not open this PDF — the file may be damaged or not a real PDF.');
    }
    throw err;
  }

  const totalPages = pdf.numPages;
  const pagesToRead = Math.min(totalPages, MAX_PAGES);
  const chunks = [];
  let length = 0;

  for (let p = 1; p <= pagesToRead; p += 1) {
    const page = await pdf.getPage(p);
    const content = await page.getTextContent();
    const pageText = pageItemsToText(content);
    if (pageText) {
      chunks.push(pageText);
      length += pageText.length + 2;
    }
    if (length >= PDF_EXTRACT_MAX_CHARS) break;
  }

  let text = chunks.join('\n\n').replace(/\n{3,}/g, '\n\n').trim();
  if (text.length > PDF_EXTRACT_MAX_CHARS) {
    text = text.slice(0, PDF_EXTRACT_MAX_CHARS);
  }

  return {
    text,
    pagesRead: pagesToRead,
    totalPages,
    truncated: totalPages > pagesToRead || text.length >= PDF_EXTRACT_MAX_CHARS,
  };
}
