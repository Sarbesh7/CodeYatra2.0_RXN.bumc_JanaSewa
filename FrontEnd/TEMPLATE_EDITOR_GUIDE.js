/**
 * Quick Start Guide for Template Editor
 * 
 * This file provides examples of how to use the Template Editor component
 * and integrate it into your React application.
 */

// ============================================
// 1. BASIC USAGE IN YOUR APP
// ============================================

// In your main App.jsx, import the TemplateEditor:
// import TemplateEditor from './Components/Templates/Template';

// Add a route to access it:
// <Route path="/template-editor" element={<TemplateEditor />} />

// ============================================
// 2. PLACEHOLDER EXTRACTION EXAMPLE
// ============================================

import { extractPlaceholders, replacePlaceholders } from './utils/placeholderUtils';

// Example template with placeholders
const template = `
  नाम: {{नाम}}
  ठेगाना: {{ठेगाना}}
  जन्म मिति: {{जन्म मिति}}
`;

// Extract all placeholders
const placeholders = extractPlaceholders(template);
console.log(placeholders); 
// Output: ['नाम', 'ठेगाना', 'जन्म मिति']

// ============================================
// 3. PLACEHOLDER REPLACEMENT EXAMPLE
// ============================================

const values = {
  नाम: 'राज कुमार',
  ठेगाना: 'काठमाडौं, नेपाल',
  'जन्म मिति': '२०७५-०१-०१',
};

const replacedContent = replacePlaceholders(template, values);
console.log(replacedContent);
// Output:
// नाम: राज कुमार
// ठेगाना: काठमाडौं, नेपाल
// जन्म मिति: २०७५-०१-०१

// ============================================
// 4. TEMPLATE SELECTION EXAMPLE
// ============================================

import { getTemplate, getAllTemplates } from './utils/templates';

// Get all available templates
const allTemplates = getAllTemplates();
console.log(allTemplates);
// Output: Array of template objects with keys and names

// Get a specific template
const citizenshipTemplate = getTemplate('citizenship');
console.log(citizenshipTemplate.name); 
// Output: नागरिकता सिफारिस पत्र (Citizenship Recommendation Letter)

// ============================================
// 5. PDF GENERATION EXAMPLE
// ============================================

import { generatePDF, generatePDFFromHTML } from './utils/pdfGenerator';

// Generate PDF from text content
const content = replacedContent;
const success = generatePDF(content, 'my_document.pdf');

if (success) {
  console.log('PDF generated successfully!');
} else {
  console.log('Error generating PDF');
}

// ============================================
// 6. COMPLETE WORKFLOW EXAMPLE (REACT COMPONENT)
// ============================================

import React, { useState, useEffect } from 'react';

export function TemplateWorkflowExample() {
  const [templateContent, setTemplateContent] = useState('');
  const [placeholders, setPlaceholders] = useState([]);
  const [values, setValues] = useState({});
  const [preview, setPreview] = useState('');

  // 1. Initialize with a template
  useEffect(() => {
    const template = getTemplate('citizenship');
    if (template) {
      setTemplateContent(template.content);
      const extracted = extractPlaceholders(template.content);
      setPlaceholders(extracted);
    }
  }, []);

  // 2. Update preview when values change
  useEffect(() => {
    const updated = replacePlaceholders(templateContent, values);
    setPreview(updated);
  }, [values, templateContent]);

  // 3. Handle value input
  const handleValueChange = (placeholder, value) => {
    setValues(prev => ({
      ...prev,
      [placeholder]: value
    }));
  };

  // 4. Download PDF
  const handleDownload = () => {
    generatePDF(preview, 'citizenship_document.pdf');
  };

  return (
    <div>
      {/* Your JSX here */}
    </div>
  );
}

// ============================================
// 7. ADDING CUSTOM TEMPLATES
// ============================================

// To add a custom template, edit src/utils/templates.js:

const customTemplate = {
  my_certificate: {
    name: 'My Certificate Template (मेरो प्रमाणपत्र)',
    content: `
      प्रमाणपत्र

      यो प्रमाणपत्र {{व्यक्तिको नाम}} को लागि जारी गरिएको हो।

      उद्देश्य: {{प्रमाणपत्रको उद्देश्य}}
      जारी मिति: {{जारी मिति}}
      वैधता: {{वैधता अवधि}}

      हस्ताक्षर:
      {{हस्ताक्षरकर्ताको नाम}}
      {{हस्ताक्षरकर्ताको पद}}
    `
  }
};

// ============================================
// 8. NEPALI TEXT EXAMPLES
// ============================================

// Nepali placeholder examples you can use:
const nepaliPlaceholders = {
  नाम: 'Full Name',
  थर: 'Last Name',
  ठेगाना: 'Address',
  जन्म_मिति: 'Date of Birth',
  'फोन नम्बर': 'Phone Number',
  'ईमेल': 'Email',
  'बुबाको नाम': "Father's Name",
  'आमाको नाम': "Mother's Name",
  'विवाहित_स्थिति': 'Marital Status',
  'शिक्षा': 'Education',
};

// ============================================
// 9. STYLING & CUSTOMIZATION
// ============================================

// The component uses Tailwind CSS. To customize:

// 1. Edit colors in Template.jsx (e.g., bg-blue-50 to bg-green-50)
// 2. Modify font styles in index.html
// 3. Adjust layout by changing grid columns (lg:col-span-*)

// ============================================
// 10. COMMON USE CASES
// ============================================

/*
1. GOVERNMENT FORMS
   - नागरिकता सिफारिस पत्र
   - पास्पोर्ट आवेदन
   - पहिचान पत्र आवेदन

2. OFFICIAL LETTERS
   - औपचारिक पत्र
   - सिफारिस पत्र
   - निवेदन पत्र

3. EMPLOYMENT DOCUMENTS
   - छुट्टीको आवेदन
   - पद त्यागपत्र
   - स्थानान्तरणको आवेदन

4. PROPERTY & CONSTRUCTION
   - निर्माण अनुमति
   - सम्पत्तिको विवरण
   - जग्गा किन्न बिक्रय पत्र

5. EDUCATIONAL DOCUMENTS
   - प्रमाणपत्र
   - डिप्लोमा
   - हाजिरीको प्रमाणपत्र
*/

// ============================================
// 11. KEYBOARD SHORTCUTS
// ============================================

// Tab - Move between input fields
// Ctrl/Cmd + S - Save to browser storage (if implemented)
// Ctrl/Cmd + D - Download PDF

// ============================================
// 12. BROWSER COMPATIBILITY
// ============================================

// Tested and working on:
// - Chrome/Chromium 90+
// - Firefox 88+
// - Safari 14+
// - Edge 90+

// ============================================
// 13. PERFORMANCE TIPS
// ============================================

// 1. For large templates (>5000 characters):
//    - Break into multiple templates
//    - Use pagination

// 2. For many placeholders (>50):
//    - Group related placeholders
//    - Use placeholder categories

// 3. For PDF generation:
//    - Keep content under 100KB
//    - Use text-only format for best performance

// ============================================
// 14. TROUBLESHOOTING
// ============================================

/*
Issue: Placeholders not appearing in inputs
Solution: Ensure placeholder names are in {{...}} format

Issue: Nepali text showing as ???? 
Solution: Check font support, refresh page, clear cache

Issue: PDF not downloading
Solution: Check browser permissions, disable popup blockers

Issue: Live preview not updating
Solution: Check console for errors, try refreshing component

Issue: Performance is slow
Solution: Reduce template size, optimize placeholder count
*/
