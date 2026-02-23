import React from "react";
import { IoMegaphone } from "react-icons/io5";
import { useLanguage } from "../../context/LanguageContext";

// Notices data with both English and Nepali content
const noticesData = [
  {
    titleEn: "National Scholarship Program 2082",
    titleNp: "राष्ट्रिय छात्रवृत्ति कार्यक्रम २०८२",
    descEn: "Applications open for meritorious students from marginalized communities. Apply before Baisakh 15.",
    descNp: "सीमान्तकृत समुदायका मेधावी विद्यार्थीहरूका लागि आवेदन खुला छ। बैशाख १५ अघि आवेदन दिनुहोस्।",
    category: "scholarship",
  },
  {
    titleEn: "Farmer Subsidy for Khet Land",
    titleNp: "खेत जमिनको लागि किसान अनुदान",
    descEn: "Government subsidy of up to Rs 50,000 for small-scale farmers for seeds and fertilizers.",
    descNp: "साना किसानहरूलाई बीउ र मलका लागि रु ५०,००० सम्मको सरकारी अनुदान।",
    category: "agriculture",
  },
  {
    titleEn: "New Online Passport Application System",
    titleNp: "नयाँ अनलाइन राहदानी आवेदन प्रणाली",
    descEn: "Department of Passports has launched a new online system effective from Magh 1.",
    descNp: "राहदानी विभागले माघ १ देखि लागू हुने नयाँ अनलाइन प्रणाली सुरु गरेको छ।",
    category: "announcement",
  },
  {
    titleEn: "Youth Self-Employment Program",
    titleNp: "युवा स्वरोजगार कार्यक्रम",
    descEn: "Interest-free loans up to Rs 5 lakhs for youth entrepreneurs under PM Employment Program.",
    descNp: "प्रधानमन्त्री रोजगार कार्यक्रम अन्तर्गत युवा उद्यमीहरूलाई रु ५ लाखसम्म ब्याजमुक्त ऋण।",
    category: "scheme",
  },
  {
    titleEn: "Property Tax Deadline Extended",
    titleNp: "सम्पत्ति कर म्याद थप",
    descEn: "Municipal property tax deadline extended to Chaitra 30 without penalty.",
    descNp: "नगरपालिका सम्पत्ति करको म्याद चैत्र ३० सम्म जरिवाना बिना थपिएको छ।",
    category: "announcement",
  },
  {
    titleEn: "Free Health Camp in Rural Areas",
    titleNp: "ग्रामीण क्षेत्रमा निःशुल्क स्वास्थ्य शिविर",
    descEn: "Free medical checkups and medicines will be provided in select rural municipalities from Falgun 10-15.",
    descNp: "फागुन १०-१५ मा छनौट गरिएका ग्रामीण नगरपालिकाहरूमा निःशुल्क स्वास्थ्य परीक्षण र औषधि वितरण हुनेछ।",
    category: "health",
  },
  {
    titleEn: "Digital Literacy Training for Women",
    titleNp: "महिलाहरूको लागि डिजिटल साक्षरता तालिम",
    descEn: "Registration open for free digital skills training for women above 18 years. Limited seats available.",
    descNp: "१८ वर्ष माथिका महिलाहरूको लागि निःशुल्क डिजिटल सीप तालिममा दर्ता खुला छ। सीमित सिटहरू उपलब्ध।",
    category: "training",
  },
  {
    titleEn: "National Identity Card Distribution",
    titleNp: "राष्ट्रिय परिचयपत्र वितरण",
    descEn: "Distribution of National ID cards will begin in all wards from Jestha 1. Bring citizenship and old ID for verification.",
    descNp: "जेठ १ देखि सबै वडाहरूमा राष्ट्रिय परिचयपत्र वितरण सुरु हुनेछ। प्रमाणीकरणको लागि नागरिकता र पुरानो परिचयपत्र ल्याउनुहोस्।",
    category: "identity",
  },
];

export default function GovernmentNotices() {
  const { t, language } = useLanguage();
  
  // Helper to get category label based on language
  const getCategoryLabel = (category) => {
    const labels = {
      scholarship: t.scholarship,
      agriculture: t.agriculture,
      announcement: t.announcement,
      scheme: t.scheme,
      health: t.health,
      training: t.training,
      identity: t.identity,
    };
    return labels[category] || category;
  };

  return (
    <div className="min-h-screen bg-gray-50 Container py-10">
      <h1 className="text-2xl font-semibold flex items-center gap-2">
        <span className="text-3xl"><IoMegaphone /></span>
        {t.governmentNoticesTitle}
      </h1>

      <div className="mt-6 space-y-5">
        {noticesData.map((notice, index) => (
          <div key={index} className="bg-white border rounded-xl shadow-sm p-5 flex justify-between items-start">
            <div>
              <p className="text-lg font-semibold">
                {language === 'np' ? notice.titleNp : notice.titleEn}
                <span className="bg-[#1b5AA7] ml-3 text-sm rounded-2xl text-white px-2 py-1">
                  {getCategoryLabel(notice.category)}
                </span>
              </p>
              <p className="text-gray-600 mt-1">
                {language === 'np' ? notice.descNp : notice.descEn}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}