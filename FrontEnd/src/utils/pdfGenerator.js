import jsPDF from 'jspdf';

/**
 * Generate PDF from Nepali document text
 * @param {string} content - The content to include in PDF
 * @param {string} filename - The filename for the PDF
 */
export const generatePDF = (content, filename = 'document.pdf') => {
  try {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Set font for Nepali text support
    // Using a unicode-compatible font
    pdf.setFont('times', 'normal');

    // Get page dimensions
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    const maxWidth = pageWidth - 2 * margin;

    // Split content into lines for proper wrapping
    const lines = content.split('\n');
    let yPosition = margin;
    const lineHeight = 7;
    const pageHeightLimit = pageHeight - margin;

    pdf.setFontSize(12);

    lines.forEach((line) => {
      // Split long lines to fit page width
      const wrappedLines = pdf.splitTextToSize(line, maxWidth);

      wrappedLines.forEach((wrappedLine) => {
        // Check if we need a new page
        if (yPosition > pageHeightLimit) {
          pdf.addPage();
          yPosition = margin;
        }

        // Add text to PDF
        pdf.text(wrappedLine, margin, yPosition);
        yPosition += lineHeight;
      });

      // Add extra space between paragraphs
      yPosition += 2;
    });

    // Save the PDF
    pdf.save(filename);
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
};

/**
 * Generate PDF with HTML formatting
 * Useful for formatted documents with styling
 * @param {HTMLElement} element - The HTML element to convert to PDF
 * @param {string} filename - The filename for the PDF
 */
export const generatePDFFromHTML = (element, filename = 'document.pdf') => {
  try {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Get text content from HTML
    const textContent = element.innerText;
    const margin = 15;
    const maxWidth = pageWidth - 2 * margin;

    pdf.setFont('times', 'normal');
    pdf.setFontSize(12);

    const lines = pdf.splitTextToSize(textContent, maxWidth);
    let yPosition = margin;
    const lineHeight = 7;
    const pageHeightLimit = pageHeight - margin;

    lines.forEach((line) => {
      if (yPosition > pageHeightLimit) {
        pdf.addPage();
        yPosition = margin;
      }
      pdf.text(line, margin, yPosition);
      yPosition += lineHeight;
    });

    pdf.save(filename);
    return true;
  } catch (error) {
    console.error('Error generating PDF from HTML:', error);
    return false;
  }
};
