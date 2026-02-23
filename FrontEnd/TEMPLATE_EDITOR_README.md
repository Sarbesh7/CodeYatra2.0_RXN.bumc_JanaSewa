# नेपाली कागजात टेम्पलेट सम्पादक

# Nepali Document Template Editor

A fully functional React web application for editing Nepali document templates with live preview and PDF download functionality.

## 🎯 Features

✅ **Text Editor** - Edit Nepali templates with dynamic placeholders (e.g., `{{नाम}}`, `{{ठेगाना}}`)
✅ **Live Preview** - Real-time preview of formatted Nepali document
✅ **PDF Download** - Save edited documents as PDF with replaced placeholders
✅ **Pre-built Templates** - 4 sample Nepali document templates included:

- नागरिकता सिफारिस पत्र (Citizenship Recommendation Letter)
- औपचारिक पत्र (Formal Letter)
- छुट्टीको आवेदन (Leave Application)
- निर्माण अनुमति आवेदन (Building Permit Application)
  ✅ **Unicode Support** - Full Nepali (Devanagari) text support
  ✅ **Responsive Design** - Works on desktop and tablet
  ✅ **Professional UI** - Clean, intuitive interface with Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: React 19 + Tailwind CSS
- **PDF Generation**: jsPDF
- **State Management**: React Hooks (useState, useEffect)
- **Build Tool**: Vite
- **Font Support**: Noto Sans Devanagari for proper Nepali rendering

## 📦 Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Setup Steps

1. **Navigate to the FrontEnd directory:**

   ```bash
   cd CodeYatra-2.0/FrontEnd
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   ```

4. **Access the application:**
   - Open your browser and navigate to `http://localhost:5173`
   - Click on the navigation menu to find "Template Editor" or go directly to `/template-editor`

## 🚀 Usage

### Step 1: Select a Template

- Choose from pre-built templates or create custom ones
- Available templates:
  - नागरिकता सिफारिस पत्र
  - औपचारिक पत्र
  - छुट्टीको आवेदन
  - निर्माण अनुमति आवेदन

### Step 2: Edit Template (Optional)

- Modify the template text in the left panel
- Add placeholders using `{{placeholder_name}}` format
- Example: `{{नाम}}`, `{{ठेगाना}}`, `{{जन्म मिति}}`

### Step 3: Fill Placeholders

- In the middle panel, enter values for each placeholder
- Example placeholders:
  - `{{नाम}}` → Your Name
  - `{{ठेगाना}}` → Your Address
  - `{{जन्म मिति}}` → Your Birth Date

### Step 4: Preview

- The right panel shows live preview of the document
- Updates in real-time as you type

### Step 5: Download PDF

- Click "Download PDF" button
- Document saves with all placeholders replaced
- File name: `document_[timestamp].pdf`

## 📁 Project Structure

```
FrontEnd/
├── src/
│   ├── Components/
│   │   └── Templates/
│   │       └── Template.jsx          # Main Template Editor Component
│   ├── utils/
│   │   ├── placeholderUtils.js       # Placeholder extraction/replacement
│   │   ├── pdfGenerator.js           # PDF generation utilities
│   │   └── templates.js              # Sample templates
│   ├── App.jsx                        # Main app with routing
│   └── main.jsx                       # React entry point
├── package.json
└── vite.config.js
```

## 🔧 Component Details

### Template.jsx

- Main component managing the template editor
- Features:
  - Template selection dropdown
  - Live editor panel
  - Placeholder input fields
  - Real-time preview
  - PDF download functionality

### placeholderUtils.js

- `extractPlaceholders()` - Extracts all `{{...}}` from template
- `replacePlaceholders()` - Replaces placeholders with user values
- `formatNepalText()` - Formats Nepali text

### pdfGenerator.js

- `generatePDF()` - Converts text content to PDF
- `generatePDFFromHTML()` - Converts HTML content to PDF

### templates.js

- Pre-defined Nepali document templates
- `SAMPLE_TEMPLATES` - Object containing templates
- `getTemplate()` - Retrieve specific template
- `getAllTemplates()` - Get all available templates

## 📝 Creating Custom Templates

To add a new template:

1. Open `src/utils/templates.js`
2. Add a new entry to `SAMPLE_TEMPLATES` object:

```javascript
export const SAMPLE_TEMPLATES = {
  // ... existing templates
  my_custom_template: {
    name: "My Custom Template (मेरो कस्टम टेम्पलेट)",
    content: `Your template content here
    
    Template Data:
    नाम: {{नाम}}
    ठेगाना: {{ठेगाना}}
    
    Additional content...`,
  },
};
```

3. The template will automatically appear in the dropdown

## 🎨 Placeholder Format

Use double curly braces for placeholders:

- `{{placeholder_name}}` - Basic placeholder
- `{{कस्टम_नाम}}` - Nepali placeholder name
- No spaces inside braces recommended

## 📄 Supported Document Types

The application supports any Nepali document that can be formatted as plain text:

- Official Letters
- Application Forms
- Recommendation Letters
- Permits & Licenses
- Certificates
- Administrative Documents

## 🐛 Troubleshooting

### Nepali text not displaying correctly?

- Ensure your browser supports Unicode
- Check that system has Noto Sans Devanagari font installed
- Try refreshing the page

### PDF not downloading?

- Check browser's download settings
- Ensure JavaScript is enabled
- Try a different browser

### Placeholders not appearing in inputs?

- Add placeholders in `{{...}}` format to template
- Check for typos in placeholder names
- Refresh the page

## 🚀 Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

## 📦 Dependencies

```json
{
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "tailwindcss": "^4.2.0",
  "jspdf": "^2.5.1",
  "html2pdf.js": "^0.10.1",
  "react-icons": "^5.5.0"
}
```

## 🌐 Browser Support

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📜 License

This project is part of the CodeYatra initiative.

## 💡 Tips

1. **Keyboard Shortcuts** - Use Tab to move between input fields
2. **Copy Template** - Select and copy preview text for use elsewhere
3. **Multiple Documents** - Download multiple documents by changing placeholder values
4. **Template Versioning** - Save different template versions manually

## 🤝 Contributing

To enhance the template editor:

1. Add new templates to `src/utils/templates.js`
2. Improve PDF formatting in `src/utils/pdfGenerator.js`
3. Add new features to `src/Components/Templates/Template.jsx`

## ❓ FAQ

**Q: Can I use Nepali characters in placeholder names?**
A: Yes! Use Nepali characters like `{{नाम}}`, `{{ठेगाना}}`, etc.

**Q: How many placeholders can I use?**
A: Unlimited! The application dynamically extracts and processes all placeholders.

**Q: Can I edit templates after creation?**
A: Yes! Modify templates directly in the editor panel. Changes appear in real-time preview.

**Q: Is there a character limit?**
A: No hard limit, but very long documents may take time to render.

**Q: Can I use HTML formatting?**
A: Currently, the app supports plain text. HTML is rendered as plain text in PDFs.

---

**Created for CodeYatra Initiative**
For support, contact the development team.
