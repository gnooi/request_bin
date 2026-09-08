export function copyToClipboard(text) {
  // Modern API — only works over HTTPS or localhost
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  }

  // Fallback — works over plain HTTP too
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-9999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    document.execCommand('copy');
  } catch (err) {
    console.error('Copy failed', err);
  }

  document.body.removeChild(textArea);
  return Promise.resolve();
}
