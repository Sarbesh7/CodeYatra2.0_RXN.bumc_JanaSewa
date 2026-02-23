import React, { useState, useEffect } from "react";
import {
  extractPlaceholders,
  replacePlaceholders,
} from "../../utils/placeholderUtils";
import { generatePDF } from "../../utils/pdfGenerator";
import { getAllTemplates, getTemplate } from "../../utils/templates";
import { FiDownload } from "react-icons/fi";

const PlaceholderInput = ({ placeholder, value, onChange }) => {
  return (
    <div className="mb-3">
      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
        {placeholder}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(placeholder, e.target.value)}
        placeholder={`Enter ${placeholder}`}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none text-gray-900 text-sm transition-all"
        style={{
          borderColor: "#1b5AA7",
          boxShadow: value ? `0 0 0 2px rgba(27, 90, 167, 0.1)` : "none",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#1b5AA7")}
        onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
      />
    </div>
  );
};

export default function TemplateEditor() {
  const [selectedTemplate, setSelectedTemplate] = useState("citizenship");
  const [templateContent, setTemplateContent] = useState("");
  const [placeholderValues, setPlaceholderValues] = useState({});
  const [placeholders, setPlaceholders] = useState([]);
  const [previewContent, setPreviewContent] = useState("");

  // Initialize template when selected template changes
  useEffect(() => {
    const template = getTemplate(selectedTemplate);
    if (template) {
      setTemplateContent(template.content);
      const extractedPlaceholders = extractPlaceholders(template.content);
      setPlaceholders(extractedPlaceholders);
      setPlaceholderValues({});
      // Update preview after state change
      const updated = replacePlaceholders(template.content, {});
      setPreviewContent(updated);
    }
  }, [selectedTemplate]);

  // Update preview whenever template or values change
  useEffect(() => {
    const updated = replacePlaceholders(templateContent, placeholderValues);
    setPreviewContent(updated);
  }, [templateContent, placeholderValues]);

  // Extract placeholders when template content changes manually
  useEffect(() => {
    const extractedPlaceholders = extractPlaceholders(templateContent);
    setPlaceholders(extractedPlaceholders);
  }, [templateContent]);

  const handleTemplateContentChange = (e) => {
    setTemplateContent(e.target.value);
  };

  const handlePlaceholderChange = (placeholder, value) => {
    setPlaceholderValues((prev) => ({
      ...prev,
      [placeholder]: value,
    }));
  };

  const handleDownloadPDF = () => {
    if (!previewContent.trim()) {
      alert(
        "Please fill in the template content and placeholders before downloading.",
      );
      return;
    }
    const filename = `document_${new Date().getTime()}.pdf`;
    const success = generatePDF(previewContent, filename);
    if (success) {
      alert("PDF downloaded successfully!");
    } else {
      alert("Error generating PDF. Please try again.");
    }
  };

  const handleReset = () => {
    setPlaceholderValues({});
    const template = getTemplate(selectedTemplate);
    if (template) {
      setTemplateContent(template.content);
    }
  };

  const templates = getAllTemplates();

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f8f9fc" }}>
      {/* Header */}
      <div
        className="text-white shadow-sm"
        style={{ backgroundColor: "#1b5AA7" }}
      >
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold">नेपाली कागजात टेम्पलेट सम्पादक</h1>
          <p
            className="text-opacity-85 mt-2"
            style={{ color: "rgba(255,255,255,0.85)" }}
          >
            Nepali Document Template Editor
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Template Selection */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-2.5">
            Select Template
          </label>
          <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none text-gray-900 transition-all"
            style={{
              borderColor: "#1b5AA7",
              boxShadow: "0 0 0 0 rgba(27, 90, 167, 0)",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#1b5AA7";
              e.target.style.boxShadow = "0 0 0 3px rgba(27, 90, 167, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#d1d5db";
              e.target.style.boxShadow = "0 0 0 0 rgba(27, 90, 167, 0)";
            }}
          >
            {templates.map((template) => (
              <option key={template.key} value={template.key}>
                {template.name}
              </option>
            ))}
          </select>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
          {/* Left: Editor Panel */}
          <div
            className="bg-white border border-gray-300 rounded-lg p-5"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
          >
            <h2 className="text-base font-semibold text-gray-800 mb-4">
              Template
            </h2>
            <textarea
              value={templateContent}
              onChange={handleTemplateContentChange}
              placeholder="Template content with {{placeholders}}"
              className="w-full h-80 p-4 border border-gray-300 rounded-lg focus:outline-none font-mono text-sm text-gray-900 resize-none transition-all"
              style={{
                borderColor: "#e5e7eb",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#1b5AA7")}
              onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
            />
            <p className="text-xs text-gray-500 mt-2.5 font-medium">
              Use {"{{placeholder_name}}"} format
            </p>
          </div>

          {/* Middle: Placeholder Inputs */}
          <div
            className="bg-white border border-gray-300 rounded-lg p-5"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
          >
            <h2 className="text-base font-semibold text-gray-800 mb-4">
              Data Fields
            </h2>
            <div className="overflow-y-auto max-h-80">
              {placeholders.length > 0 ? (
                placeholders.map((placeholder) => (
                  <PlaceholderInput
                    key={placeholder}
                    placeholder={placeholder}
                    value={placeholderValues[placeholder] || ""}
                    onChange={handlePlaceholderChange}
                  />
                ))
              ) : (
                <p className="text-gray-500 text-sm italic">
                  No fields to fill
                </p>
              )}
            </div>
          </div>

          {/* Right: Live Preview */}
          <div
            className="bg-white border border-gray-300 rounded-lg p-5"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
          >
            <h2 className="text-base font-semibold text-gray-800 mb-4">
              Preview
            </h2>
            <div
              className="w-full h-80 p-4 border border-gray-300 rounded-lg overflow-y-auto whitespace-pre-wrap text-sm text-gray-800 font-sans leading-relaxed"
              style={{
                fontFamily:
                  '"Noto Naskh Arabic", "Noto Sans Devanagari", sans-serif',
                backgroundColor: "#f9fafb",
              }}
            >
              {previewContent || "Preview will appear here..."}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end mb-8">
          <button
            onClick={handleReset}
            className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors duration-200"
          >
            Reset
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-6 py-2.5 text-white font-semibold rounded-lg transition-colors duration-200"
            style={{
              backgroundColor: "#1b5AA7",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#154282")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#1b5AA7")}
          >
            <FiDownload size={18} />
            Download PDF
          </button>
        </div>

        {/* Info Section */}
        <div
          className="rounded-lg p-5"
          style={{
            backgroundColor: "rgba(27, 90, 167, 0.05)",
            borderLeft: "4px solid #1b5AA7",
          }}
        >
          <h3
            className="font-semibold mb-3"
            style={{ color: "#1b5AA7", fontSize: "15px" }}
          >
            How to Use
          </h3>
          <ul
            className="space-y-2 text-sm list-disc list-inside"
            style={{ color: "#1b5AA7" }}
          >
            <li>
              Select a template or create your own with {"{"}
              {"{"}placeholders{"}"}
              {"}"}
            </li>
            <li>Fill in the data fields in the middle panel</li>
            <li>See the live preview update on the right</li>
            <li>Click "Download PDF" to save your document</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
