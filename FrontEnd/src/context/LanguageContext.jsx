import { createContext, useContext, useState } from 'react';

const LanguageContext = createContext(null);

export const translations = {
  en: {
    brand: "JanaSewa",
    home: "Home",
    services: "Services",
    trackApplication: "Track Application",
    complaints: "Complaints",
    governmentNotices: "Government Notices",
    adminDashboard: "Admin Dashboard",
    personalDetails: "Personal Details",
    contactUs: "Contact Us",
    switchLanguage: "नेपालीमा बदल्नुहोस्",

    heroTitle: "All Government Services in One Place",
    heroSubtitle: "Know where to go, what documents to bring, and apply online.",
    exploreServices: "Explore Services",
    findServices: "Find Services",
    findServicesDesc: "Search and browse all government services easily.",
    applyOnline: "Apply Online",
    applyOnlineDesc: "Submit your applications from anywhere, anytime.",
    trackStatus: "Track Status",
    trackStatusDesc: "Get real-time updates on your application status.",
    popularServices: "Popular Services",
    viewDetails: "View Details",
    viewAllServices: "View All Services",

    citizenship: "Citizenship",
    citizenshipDesc: "Apply for new citizenship certificate or renewal.",
    license: "License (Yatayat)",
    licenseDesc: "Apply for driving license or renewal.",
    passport: "Passport",
    passportDesc: "Apply for a new passport or renew your existing one.",
    taxRevenue: "Tax & Revenue",
    taxRevenueDesc: "File taxes, pay revenue, and get tax clearance.",
    propertyLand: "Property & Land",
    propertyLandDesc: "Land registration, ownership transfer, and records.",
    wardServices: "Ward Services",
    wardServicesDesc: "Local ward-level services and recommendations.",
    municipalityServices: "Municipality Services",
    municipalityServicesDesc: "Municipal-level services and permits.",
    scholarships: "Scholarships Programs",
    scholarshipsDesc: "Government scholarships and support programs.",
    allServices: "All Services",
    allServicesSubtitle: "Browse available government services and find what you need.",
    applyNow: "Apply Now",
    fee: "Fee",
    estimatedDays: "Est. days",
    loginToApply: "Please login to apply for services",

    trackYourApplication: "Track Your Application",
    applicationSerialNumber: "Application Serial Number",
    track: "Track",
    serialPlaceholder: "e.g. JS-12345678",

    fileComplaint: "File a Complaint",
    reportIssues: "Report issues with government services",
    selectOffice: "Select Office",
    chooseOffice: "Choose office",
    subject: "Subject",
    subjectPlaceholder: "Brief subject of your complaint",
    complaintDescription: "Complaint Description",
    descriptionPlaceholder: "Describe your complaint in detail...",
    uploadEvidence: "Upload Evidence (Optional)",
    attachSupport: "Attach any supporting documents or images",
    submitComplaint: "Submit Complaint",
    submitting: "Submitting...",
    complaintSubmitted: "Complaint Submitted!",
    complaintSuccess: "Your complaint has been registered. We will review it and get back to you soon.",
    backToHome: "Back to Home",
    loginToComplain: "Please login to submit a complaint",
    fillAllFields: "Please fill in all required fields",

    governmentNoticesTitle: "Government Notices",
    scholarship: "Scholarship",
    agriculture: "Agriculture",
    announcement: "Announcement",
    scheme: "Scheme",
    health: "Health",
    training: "Training",
    identity: "Identity",

    footerBrand: "Jana Sewa",
    footerTagline: "Empowering Citizens, Enhancing Governance",
    quickLinks: "Quick Links",
    fileAComplaint: "File a Complaint",
    email: "Email",
    phone: "Phone",
    copyright: "© 2024 Jana Sewa. All rights reserved.",

    districtAdminOffice: "District Administration Office",
    landRevenueOffice: "Land Revenue Office",
    municipalityOffice: "Municipality Office",
    transportOffice: "Transport Management Office",
    passportOffice: "Passport Office",
    taxOffice: "Tax Office",
    wardOffice: "Ward Office",
  },
  np: {
    brand: "जनसेवा",
    home: "गृहपृष्ठ",
    services: "सेवाहरू",
    trackApplication: "आवेदन ट्र्याक",
    complaints: "गुनासोहरू",
    governmentNotices: "सरकारी सूचनाहरू",
    adminDashboard: "एडमिन ड्यासबोर्ड",
    personalDetails: "व्यक्तिगत विवरण",
    contactUs: "सम्पर्क गर्नुहोस्",
    switchLanguage: "Switch to English",

    heroTitle: "सबै सरकारी सेवाहरू एकै ठाउँमा",
    heroSubtitle: "कहाँ जाने, के कागजात ल्याउने, र अनलाइन आवेदन दिने जान्नुहोस्।",
    exploreServices: "सेवाहरू हेर्नुहोस्",
    findServices: "सेवाहरू खोज्नुहोस्",
    findServicesDesc: "सबै सरकारी सेवाहरू सजिलै खोज्नुहोस्।",
    applyOnline: "अनलाइन आवेदन",
    applyOnlineDesc: "जुनसुकै ठाउँबाट, जुनसुकै समयमा आवेदन दिनुहोस्।",
    trackStatus: "स्थिति ट्र्याक",
    trackStatusDesc: "तपाईंको आवेदनको स्थिति रियल-टाइममा पाउनुहोस्।",
    popularServices: "लोकप्रिय सेवाहरू",
    viewDetails: "विवरण हेर्नुहोस्",
    viewAllServices: "सबै सेवाहरू हेर्नुहोस्",

    citizenship: "नागरिकता",
    citizenshipDesc: "नयाँ नागरिकता प्रमाणपत्र वा नवीकरणको लागि आवेदन दिनुहोस्।",
    license: "लाइसेन्स (यातायात)",
    licenseDesc: "सवारी चालक अनुमतिपत्र वा नवीकरणको लागि आवेदन दिनुहोस्।",
    passport: "राहदानी",
    passportDesc: "नयाँ राहदानी वा नवीकरणको लागि आवेदन दिनुहोस्।",
    taxRevenue: "कर र राजस्व",
    taxRevenueDesc: "कर दाखिला, राजस्व भुक्तानी, र कर चुक्ता प्रमाणपत्र।",
    propertyLand: "सम्पत्ति र जग्गा",
    propertyLandDesc: "जग्गा दर्ता, स्वामित्व हस्तान्तरण, र अभिलेख।",
    wardServices: "वडा सेवाहरू",
    wardServicesDesc: "स्थानीय वडा-स्तरीय सेवाहरू र सिफारिसहरू।",
    municipalityServices: "नगरपालिका सेवाहरू",
    municipalityServicesDesc: "नगरपालिका-स्तरीय सेवाहरू र अनुमतिपत्रहरू।",
    scholarships: "छात्रवृत्ति कार्यक्रमहरू",
    scholarshipsDesc: "सरकारी छात्रवृत्ति र सहायता कार्यक्रमहरू।",
    allServices: "सबै सेवाहरू",
    allServicesSubtitle: "उपलब्ध सरकारी सेवाहरू हेर्नुहोस् र आफूलाई चाहिने कुरा खोज्नुहोस्।",
    applyNow: "अहिले आवेदन दिनुहोस्",
    fee: "शुल्क",
    estimatedDays: "अनुमानित दिन",
    loginToApply: "सेवाको लागि आवेदन दिन कृपया लगइन गर्नुहोस्",

    trackYourApplication: "तपाईंको आवेदन ट्र्याक गर्नुहोस्",
    applicationSerialNumber: "आवेदनको क्रम संख्या",
    track: "ट्र्याक",
    serialPlaceholder: "उदा. JS-12345678",

    fileComplaint: "गुनासो दर्ता गर्नुहोस्",
    reportIssues: "सरकारी सेवाहरूसँग समस्याहरू रिपोर्ट गर्नुहोस्",
    selectOffice: "कार्यालय छान्नुहोस्",
    chooseOffice: "कार्यालय छान्नुहोस्",
    subject: "विषय",
    subjectPlaceholder: "तपाईंको गुनासोको संक्षिप्त विषय",
    complaintDescription: "गुनासो विवरण",
    descriptionPlaceholder: "तपाईंको गुनासो विस्तारमा वर्णन गर्नुहोस्...",
    uploadEvidence: "प्रमाण अपलोड गर्नुहोस् (वैकल्पिक)",
    attachSupport: "कुनै पनि समर्थन कागजात वा फोटो संलग्न गर्नुहोस्",
    submitComplaint: "गुनासो पेश गर्नुहोस्",
    submitting: "पेश गर्दै...",
    complaintSubmitted: "गुनासो पेश भयो!",
    complaintSuccess: "तपाईंको गुनासो दर्ता भएको छ। हामी समीक्षा गरेर चाँडै सम्पर्क गर्नेछौं।",
    backToHome: "गृहपृष्ठमा फर्कनुहोस्",
    loginToComplain: "गुनासो पेश गर्न कृपया लगइन गर्नुहोस्",
    fillAllFields: "कृपया सबै आवश्यक फिल्डहरू भर्नुहोस्",

    governmentNoticesTitle: "सरकारी सूचनाहरू",
    scholarship: "छात्रवृत्ति",
    agriculture: "कृषि",
    announcement: "घोषणा",
    scheme: "योजना",
    health: "स्वास्थ्य",
    training: "तालिम",
    identity: "परिचय",

    footerBrand: "जनसेवा",
    footerTagline: "नागरिक सशक्तीकरण, शासन सुधार",
    quickLinks: "द्रुत लिंकहरू",
    fileAComplaint: "गुनासो दर्ता गर्नुहोस्",
    email: "इमेल",
    phone: "फोन",
    copyright: "© २०२४ जनसेवा। सर्वाधिकार सुरक्षित।",

    districtAdminOffice: "जिल्ला प्रशासन कार्यालय",
    landRevenueOffice: "मालपोत कार्यालय",
    municipalityOffice: "नगरपालिका कार्यालय",
    transportOffice: "यातायात व्यवस्थापन कार्यालय",
    passportOffice: "राहदानी कार्यालय",
    taxOffice: "कर कार्यालय",
    wardOffice: "वडा कार्यालय",
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('app_language') || 'en';
  });

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'np' : 'en';
    setLanguage(newLang);
    localStorage.setItem('app_language', newLang);
  };

  const t = translations[language];

  const value = {
    language,
    setLanguage,
    toggleLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
