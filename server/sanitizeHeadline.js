/** Clean RSS/API headline text for display */

function decodeNumericEntities(s) {
  return String(s)
    .replace(/&#x([0-9a-fA-F]+);/gi, (_, hex) => {
      const code = parseInt(hex, 16);
      return Number.isFinite(code) && code > 0 && code < 0x10ffff
        ? String.fromCodePoint(code)
        : '';
    })
    .replace(/&#(\d+);/g, (_, dec) => {
      const code = parseInt(dec, 10);
      return Number.isFinite(code) && code > 0 && code < 0x10ffff
        ? String.fromCodePoint(code)
        : '';
    });
}

function decodeXmlEntities(s) {
  if (!s) return '';
  return decodeNumericEntities(
    String(s)
      .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, '$1')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ')
  );
}

function sanitizeHeadlineText(text) {
  if (!text) return '';
  let s = decodeXmlEntities(text);
  s = s.replace(/<[^>]*>/g, '');
  s = s.normalize('NFKC');
  s = s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g, '');
  s = s.replace(/[\u200B-\u200D\uFEFF\u00AD]/g, '');
  s = s.replace(/\uFFFD/g, '');
  s = s.replace(/[\uD800-\uDFFF]/g, '');
  s = s.replace(/\s+/g, ' ').trim();
  return s;
}

module.exports = { sanitizeHeadlineText, decodeXmlEntities };
