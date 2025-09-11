/**
 * Formats product descriptions with proper line breaks
 * Handles both HTML and plain text descriptions
 */
export function formatDescription(description: string): string {
  if (!description) return '';
  
  // Clean up the description first
  const cleaned = description.trim();
  
  // Check if the description contains HTML tags
  const hasHtmlTags = /<[^>]*>/g.test(cleaned);
  
  if (hasHtmlTags) {
    // Handle HTML-formatted descriptions
    // Remove HTML tags and extract text content
    const textContent = cleaned
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ') // Replace &nbsp; with regular spaces
      .replace(/&amp;/g, '&') // Replace &amp; with &
      .replace(/&lt;/g, '<') // Replace &lt; with <
      .replace(/&gt;/g, '>') // Replace &gt; with >
      .replace(/&quot;/g, '"') // Replace &quot; with "
      .trim();
    
    // Split by periods followed by spaces
    const sentences = textContent
      .split(/\.\s+/)
      .filter(sentence => sentence.trim().length > 0)
      .map(sentence => sentence.trim());
    
    // Join sentences with double line breaks
    return sentences.join('.\n\n');
  } else {
    // Handle plain text descriptions
    const sentences = cleaned
      .split(/\.\s+/)
      .filter(sentence => sentence.trim().length > 0)
      .map(sentence => sentence.trim());
    
    return sentences.join('.\n\n');
  }
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
