/**
 * Formats product descriptions with proper line breaks
 * Converts periods followed by spaces into line breaks for better readability
 */
export function formatDescription(description: string): string {
  if (!description) return '';
  
  // Clean up the description first
  const cleaned = description.trim();
  
  // Handle different formatting patterns
  // Split by periods followed by spaces, but preserve existing line breaks
  const sentences = cleaned
    .split(/\.\s+/)
    .filter(sentence => sentence.trim().length > 0)
    .map(sentence => sentence.trim());
  
  // Join sentences with double line breaks for better spacing
  return sentences.join('.\n\n');
}

/**
 * Formats description for HTML display with proper paragraph breaks
 */
export function formatDescriptionHTML(description: string): string {
  if (!description) return '';
  
  // Split by periods followed by spaces
  const sentences = description
    .split(/\.\s+/)
    .filter(sentence => sentence.trim().length > 0)
    .map(sentence => sentence.trim());
  
  // Wrap each sentence in a paragraph tag
  return sentences
    .map(sentence => `<p>${sentence}.</p>`)
    .join('');
}

/**
 * Alternative formatting that preserves original structure but adds breaks
 */
export function formatDescriptionWithBreaks(description: string): string {
  if (!description) return '';
  
  // Replace periods followed by spaces with period + double line break
  return description.replace(/\.\s+/g, '.\n\n');
}
