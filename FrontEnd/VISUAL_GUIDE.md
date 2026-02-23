# 🎨 Visual Guide & Implementation Example

## Application Screenshots (Text Description)

### Main View - Desktop Layout

```
╔════════════════════════════════════════════════════════════════════╗
║              नेपाली कागजात टेम्पलेट सम्पादक                      ║
║        Nepali Document Template Editor - Edit, Preview & Download ║
╚════════════════════════════════════════════════════════════════════╝

Select Template / टेम्पलेट चयन गर्नुहोस्
┌─────────────────────────────────────────────────────────────────────┐
│ ▼ नागरिकता सिफारिस पत्र (Citizenship Recommendation Letter)      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────┬──────────────────────┬───────────────────────┐
│  Edit Template      │  Placeholders        │   Live Preview        │
│  टेम्पलेट सम्पादन  │  ठेगानाहरु          │   प्रिभ्यु            │
├─────────────────────┼──────────────────────┼───────────────────────┤
│                     │                      │                       │
│ नागरिकता सिफारिस  │ नाम *:               │ नागरिकता सिफारिस    │
│ पत्र                │ [________]           │ पत्र                  │
│                     │                      │                       │
│ लेखेको मिति: ...    │ बुबाको नाम *:       │ लेखेको मिति: ...     │
│ प्रमाणपत्र नम्बर:  │ [________]           │ प्रमाणपत्र नम्बर: ... │
│                     │                      │                       │
│ महोदय/महोदया,      │ आमाको नाम *:        │ महोदय/महोदया,       │
│                     │ [________]           │                       │
│ यो पत्र {{नाम}} को │                      │ यो पत्र राज कुमार    │
│ नागरिकता...        │ जन्म मिति *:         │ को नागरिकता...      │
│                     │ [________]           │                       │
│ (scrollable)        │ (scrollable)         │ (scrollable)          │
│                     │                      │                       │
└─────────────────────┴──────────────────────┴───────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│              [Reset / रिसेट गर्नुहोस्]  [Download PDF / डाउनलोड]  │
└─────────────────────────────────────────────────────────────────────┘

ℹ️ How to Use / कसरी प्रयोग गर्ने
├─ Select a template or create your own with {{placeholders}}
├─ Fill in the placeholder values in the middle panel
├─ See the live preview update in real-time on the right
├─ Click "Download PDF" to save your completed document
└─ Nepali text is fully supported (Unicode)
```

### Mobile View - Responsive Layout

```
╔═══════════════════════════════╗
║ नेपाली कागजात टेम्पलेट      ║
║ (Nepali Doc Template Editor) ║
╚═══════════════════════════════╝

┌─────────────────────────────┐
│ Template Selection          │
│ ▼ नागरिकता सिफारिस...      │
└─────────────────────────────┘

┌─────────────────────────────┐
│ Edit Template               │
│ (stacked vertically)        │
│ ................            │
│ ................            │
└─────────────────────────────┘

┌─────────────────────────────┐
│ Placeholders                │
│ नाम: [______]               │
│ ठेगाना: [______]            │
│ जन्म मिति: [______]         │
└─────────────────────────────┘

┌─────────────────────────────┐
│ Live Preview                │
│ (document preview here)     │
│ ................            │
│ ................            │
└─────────────────────────────┘

[Reset]  [Download PDF ↓]
```

---

## 🔄 User Workflow

### Scenario: Creating a Citizenship Letter

```
STEP 1: OPEN APPLICATION
└─→ Navigate to http://localhost:5173/template-editor
    └─→ Page loads with default template
    └─→ 4 templates available in dropdown

STEP 2: SELECT TEMPLATE (Optional)
└─→ Template already selected: "नागरिकता सिफारिस पत्र"
└─→ Editor shows citizenship template text
└─→ System extracts placeholders:
    ├─ {{लेखेको मिति}}
    ├─ {{प्रमाणपत्र नम्बर}}
    ├─ {{नाम}}
    ├─ {{बुबाको नाम}}
    ├─ {{आमाको नाम}}
    ├─ {{जन्म मिति}}
    ├─ {{लिङ्ग}}
    ├─ {{ठेगाना}}
    ├─ {{आवेदकको विवरण}}
    ├─ {{सिफारिस गर्ने व्यक्तिको नाम}}
    ├─ {{दर्जा}}
    └─ {{हस्ताक्षरको मिति}}

STEP 3: FILL PLACEHOLDERS
User enters values:
└─ लेखेको मिति: 2026-02-23
└─ प्रमाणपत्र नम्बर: NP-2024-001
└─ नाम: राज कुमार शर्मा
└─ बुबाको नाम: गोपालनाथ शर्मा
└─ आमाको नाम: सीता शर्मा
└─ जन्म मिति: २०७५-०५-०१
└─ लिङ्ग: पुरुष
└─ ठेगाना: काठमाडौं, नेपाल
└─ ... (and more)

STEP 4: LIVE PREVIEW UPDATES
As user types, preview shows:
┌─────────────────────────────┐
│ नागरिकता सिफारिस पत्र        │
│                             │
│ लेखेको मिति: 2026-02-23      │
│ प्रमाणपत्र नम्बर: NP-2024-001 │
│                             │
│ महोदय/महोदया,              │
│ यो पत्र राज कुमार शर्मा को  │
│ नागरिकता सम्बन्धी आवेदनको │
│ सिफारिस गर्न लेखिएको हो।  │
│                             │
│ आवेदकको विवरण:             │
│ नाम: राज कुमार शर्मा        │
│ बुबाको नाम: गोपालनाथ शर्मा   │
│ आमाको नाम: सीता शर्मा       │
│ जन्म मिति: २०७५-०५-०१      │
│ लिङ्ग: पुरुष                 │
│ ठेगाना: काठमाडौं, नेपाल     │
│ ... (rest of document)      │
└─────────────────────────────┘

STEP 5: DOWNLOAD PDF
User clicks "Download PDF"
└─→ Browser processes document
└─→ PDF generated using jsPDF
└─→ All placeholders replaced with actual values
└─→ File saved to Downloads folder
└─→ Filename: document_1708695600000.pdf
└─→ User confirmation shown

STEP 6: USE THE PDF
└─→ Open with any PDF reader
└─→ Print or send email
└─→ Archive for records
└─→ Share with authorities
```

---

## 💻 Code Integration Examples

### Example 1: Using in Your Navigation

```jsx
// In your NavBar component
import { Link } from "react-router-dom";

export function NavBar() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/services">Services</Link>
      <Link to="/template-editor">📄 Template Editor</Link>
      <Link to="/admin">Admin</Link>
    </nav>
  );
}
```

### Example 2: Adding a New Custom Template

```javascript
// File: src/utils/templates.js

export const SAMPLE_TEMPLATES = {
  // ... existing templates ...

  // Add this new template
  marriage_certificate: {
    name: "विवाह प्रमाणपत्र (Marriage Certificate)",
    content: `विवाह प्रमाणपत्र

प्रमाणपत्र नम्बर: {{प्रमाणपत्र नम्बर}}
जारी मिति: {{जारी मिति}}

दम्पतीको विवरण:

दोस्रो अर्धाङ्गिनी/अर्धाङ्गी - १
नाम: {{पति/पत्नीको नाम}}
बुबाको नाम: {{पति/पत्नीको बुबाको नाम}}
आमाको नाम: {{पति/पत्नीको आमाको नाम}}
जन्म मिति: {{पति/पत्नीको जन्म मिति}}
ठेगाना: {{पति/पत्नीको ठेगाना}}

दोस्रो अर्धाङ्गिनी/अर्धाङ्गी - २
नाम: {{दोस्रोको नाम}}
बुबाको नाम: {{दोस्रोको बुबाको नाम}}
आमाको नाम: {{दोस्रोको आमाको नाम}}
जन्म मिति: {{दोस्रोको जन्म मिति}}
ठेगाना: {{दोस्रोको ठेगाना}}

विवाहको विवरण:
विवाह मिति: {{विवाह मिति}}
विवाह स्थान: {{विवाह स्थान}}
विवाहका साक्षी: {{साक्षीको नाम}}

यस प्रमाणपत्र द्वारा उपरोक्त दम्पतीको विवाह {{विवाह मिति}} मा 
{{विवाह स्थान}} मा सम्पन्न भएको प्रमाणित गरिन्छ।

जारीकर्ता: {{जारीकर्ताको नाम}}
पद: {{पद}}
हस्ताक्षर: ___________________
मिति: {{हस्ताक्षरको मिति}}`,
  },
};
```

Now the new template automatically appears in the dropdown!

### Example 3: Programmatic Usage

```jsx
// Using the utilities in another component
import {
  extractPlaceholders,
  replacePlaceholders,
} from "../utils/placeholderUtils";
import { generatePDF } from "../utils/pdfGenerator";

export function MyCustomComponent() {
  const template = `
    नाम: {{नाम}}
    काम: {{काम}}
    संस्थान: {{संस्थान}}
  `;

  // Extract placeholders
  const placeholders = extractPlaceholders(template);
  console.log(placeholders); // ['नाम', 'काम', 'संस्थान']

  // Replace with values
  const values = {
    नाम: "राज",
    काम: "सफ्टवेयर इञ्जिनियर",
    संस्थान: "CodeYatra",
  };

  const filled = replacePlaceholders(template, values);
  console.log(filled); // Template with actual values

  // Generate PDF
  const success = generatePDF(filled, "my_document.pdf");
  console.log(success); // true
}
```

---

## 📊 State Management Diagram

```
┌─────────────────────────────────────────────────────────┐
│           Component State (Template.jsx)                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  selectedTemplate: 'citizenship'                       │
│    └─→ Which template is selected                      │
│                                                         │
│  templateContent: "नागरिकता सिफारिस..."                │
│    └─→ Full template text with {{}}                    │
│                                                         │
│  placeholders: ['नाम', 'ठेगाना', ...]                  │
│    └─→ Extracted from template                         │
│                                                         │
│  placeholderValues: {                                  │
│    'नाम': 'राज',                                        │
│    'ठेगाना': 'काठमाडौं',                                │
│    ...                                                  │
│  }                                                      │
│    └─→ User entered values                             │
│                                                         │
│  previewContent: "नागरिकता सिफारिस पत्र..."           │
│    └─→ Template with values filled (no {{}} remaining) │
│                                                         │
└─────────────────────────────────────────────────────────┘

              ↓ Data Flow ↓

User Input (Edit form values)
        ↓
Update placeholderValues []
        ↓
useEffect triggers (templateContent or placeholderValues changed)
        ↓
replacePlaceholders() function
        ↓
Update previewContent []
        ↓
Re-render Preview Panel
```

---

## 🔄 Data Flow Diagram

```
[Template Selection]
        │
        ├─→ getTemplate(selectedTemplate)
        │       └─→ Returns template object
        │
        ├─→ setTemplateContent()
        │       └─→ Update editor text
        │
        ├─→ extractPlaceholders()
        │       └─→ Get all {{}} from template
        │
        └─→ setPlaceholders()
                └─→ Show inputs for each

[User Fills Values]
        │
        └─→ setPlaceholderValues()
                │
                └─→ updatePreview() (useEffect)
                        │
                        ├─→ replacePlaceholders()
                        │       └─→ Fill {{}} with values
                        │
                        └─→ setPreviewContent()
                                └─→ Display in preview

[Download PDF]
        │
        ├─→ generatePDF()
        │       │
        │       ├─→ new jsPDF()
        │       ├─→ setFont()
        │       ├─→ Loop through lines
        │       ├─→ Add text to PDF
        │       └─→ pdf.save(filename)
        │
        └─→ Browser downloads file
```

---

## ⚙️ Placeholder Extraction Algorithm

```
Input: "नाम: {{नाम}}, ठेगाना: {{ठेगाना}}"

Regex: /\{\{([^}]+)\}\}/g

Process:
1. Find {{नाम}} → Extract: नाम
2. Find {{ठेगाना}} → Extract: ठेगाना
3. Remove duplicates
4. Return array

Output: ['नाम', 'ठेगाना']
```

---

## 🎨 Styling Structure

```
Root Container
└─ bg-gradient-to-br from-blue-50 to-indigo-100
   └─ min-h-screen (full height)
   └─ p-6 (padding)

Header Section
└─ text-4xl font-bold text-gray-800
└─ text-lg text-gray-600

Template Selector
└─ w-full (full width)
└─ border-2 border-gray-300
└─ focus:border-blue-500

Main Grid Layout
└─ grid-cols-1 lg:grid-cols-3 (responsive)
   ├─ Left Panel (lg:col-span-1)
   │  └─ 3-column layout on desktop
   │  └─ Full width on mobile
   │
   ├─ Middle Panel (lg:col-span-1)
   │  └─ 3-column layout on desktop
   │  └─ Full width on mobile
   │
   └─ Right Panel (lg:col-span-1)
      └─ 3-column layout on desktop
      └─ Full width on mobile

Each Panel
└─ bg-white rounded-lg shadow-lg p-6

Editor Textarea
└─ h-96 (height)
└─ border-2 border-gray-300
└─ focus:border-blue-500
└─ font-mono (monospace font)

Input Fields
└─ w-full px-3 py-2
└─ border border-gray-300
└─ focus:ring-2 focus:ring-blue-500
└─ rounded-md

Buttons
└─ Reset: bg-gray-500 hover:bg-gray-600
└─ Download: bg-green-500 hover:bg-green-600
```

---

## 📦 Component Hierarchy

```
<App>
  <BrowserRouter>
    <Routes>
      <Route path="/template-editor" element={<TemplateEditor />} />
    </Routes>
  </BrowserRouter>
</App>

<TemplateEditor>
  ├─ render: Template selector dropdown
  ├─ render: Editor textarea
  ├─ render: PlaceholderInput (multiple)
  │  └─ <PlaceholderInput />
  │     └─ Input field with label
  ├─ render: Preview div
  ├─ render: Action buttons
  └─ Logic:
     ├─ useEffect: Initialize template
     ├─ useEffect: Update preview
     ├─ useEffect: Extract placeholders
     └─ Handlers:
        ├─ handleTemplateContentChange()
        ├─ handlePlaceholderChange()
        ├─ handleDownloadPDF()
        └─ handleReset()
```

---

## 🚀 Deployment Checklist

```
Before Production:
✅ All 4 templates tested
✅ Live preview working
✅ PDF download working
✅ Nepali text displays correctly
✅ Mobile responsive verified
✅ Browser compatibility tested
✅ Error handling verified
✅ Performance optimized
✅ Dependencies installed
✅ Documentation complete
```

---

## 🎓 Learning Points

**Developers can learn from this project:**

1. **React Patterns**
   - Component composition
   - State management with hooks
   - Effect hooks for side effects
   - Re-rendering optimization

2. **String Manipulation**
   - Regular expressions
   - Template replacing
   - Text parsing

3. **PDF Generation**
   - jsPDF library usage
   - Text wrapping
   - Page management
   - Font handling

4. **UI/UX**
   - Tailwind CSS
   - Responsive design
   - Component layout
   - Real-time feedback

5. **Unicode Handling**
   - Nepali/Devanagari support
   - Font loading
   - Character encoding

---

This visual guide shows you exactly what your application looks like and how all the pieces fit together!

**Everything is ready to go. Start using it now!** 🚀
