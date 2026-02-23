/**
 * Utility functions for handling placeholders in Nepali templates
 */

/**
 * Extract all placeholders from a template string
 * Placeholders are in the format {{placeholder_name}}
 * @param {string} template - The template string with placeholders
 * @returns {Array} - Array of placeholder names
 */
export const extractPlaceholders = (template) => {
  if (!template) return [];
  const regex = /\{\{([^}]+)\}\}/g;
  const placeholders = [];
  let match;
  
  while ((match = regex.exec(template)) !== null) {
    if (!placeholders.includes(match[1])) {
      placeholders.push(match[1]);
    }
  }
  
  return placeholders;
};

/**
 * Replace placeholders in a template with actual values
 * @param {string} template - The template string
 * @param {Object} values - Object with placeholder names as keys and replacement values
 * @returns {string} - Template with replaced placeholders
 */
export const replacePlaceholders = (template, values) => {
  if (!template) return '';
  
  let result = template;
  Object.keys(values).forEach((key) => {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    result = result.replace(regex, values[key] || '');
  });
  
  return result;
};

/**
 * Format Nepali text with basic document formatting
 * @param {string} text - The text to format
 * @returns {string} - HTML formatted text
 */
export const formatNepalText = (text) => {
  if (!text) return '';
  
  // Replace line breaks with proper formatting
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('\n');
};
