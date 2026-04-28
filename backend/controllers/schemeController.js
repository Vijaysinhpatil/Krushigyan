const schemesData = [
  {
    id: "pm-kisan",
    name: "PM-Kisan Samman Nidhi",
    category: "Financial Support",
    eligibility: "Small and marginal farmers",
    benefit: "₹6,000 per year",
    applyLink: "https://pmkisan.gov.in/",
    isFeatured: true,
    translations: {
      en: "Under this scheme, all landholding farmers' families are provided the financial benefit of Rs.6000 per annum per family payable in three equal installments of Rs.2000 each.",
      hi: "इस योजना के तहत, सभी भूमिधारक किसान परिवारों को प्रति वर्ष 6000 रुपये का वित्तीय लाभ 2000 रुपये की तीन समान किस्तों में देय है।",
      mr: "या योजनेअंतर्गत, सर्व जमीनधारक शेतकरी कुटुंबांना दरवर्षी 6000 रुपयांचा आर्थिक लाभ 2000 रुपयांच्या तीन समान हप्त्यांमध्ये दिला जातो.",
      kn: "ಈ ಯೋಜನೆಯಡಿ, ಎಲ್ಲಾ ಭೂಹಿಡುವಳಿದಾರ ರೈತರ ಕುಟುಂಬಗಳಿಗೆ ವರ್ಷಕ್ಕೆ ರೂ.6000 ಆರ್ಥಿಕ ಲಾಭವನ್ನು ತಲಾ ರೂ.2000 ರ ಮೂರು ಸಮಾನ ಕಂತುಗಳಲ್ಲಿ ಪಾವತಿಸಲಾಗುತ್ತದೆ."
    }
  },
  {
    id: "pm-fby",
    name: "Pradhan Mantri Fasal Bima Yojana",
    category: "Insurance",
    eligibility: "All farmers growing notified crops",
    benefit: "Crop insurance against natural calamities",
    applyLink: "https://pmfby.gov.in/",
    isFeatured: false,
    translations: {
      en: "Provides comprehensive insurance cover against failure of the crop thus helping in stabilising the income of the farmers.",
      hi: "फसल की विफलता के खिलाफ व्यापक बीमा कवर प्रदान करता है जिससे किसानों की आय को स्थिर करने में मदद मिलती है।",
      mr: "पिकाच्या अपयशाविरूद्ध सर्वसमावेशक विमा संरक्षण प्रदान करते ज्यामुळे शेतकऱ्यांचे उत्पन्न स्थिर होण्यास मदत होते.",
      kn: "ಬೆಳೆ ವೈಫಲ್ಯದ ವಿರುದ್ಧ ಸಮಗ್ರ ವಿಮಾ ರಕ್ಷಣೆಯನ್ನು ಒದಗಿಸುತ್ತದೆ, ಇದರಿಂದಾಗಿ ರೈತರ ಆದಾಯವನ್ನು ಸ್ಥಿರಗೊಳಿಸಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ."
    }
  },
  {
    id: "pkvy",
    name: "Paramparagat Krishi Vikas Yojana",
    category: "Fertilizer",
    eligibility: "Farmers interested in organic farming",
    benefit: "₹50,000 per hectare for 3 years",
    applyLink: "https://pgsindia-ncof.gov.in/pkvy/index.aspx",
    isFeatured: false,
    translations: {
      en: "Promotes organic farming through a cluster approach and Participatory Guarantee System of certification.",
      hi: "समूह दृष्टिकोण और प्रमाणन की भागीदारी गारंटी प्रणाली के माध्यम से जैविक खेती को बढ़ावा देता है।",
      mr: "समूह दृष्टीकोन आणि प्रमाणीकरणाच्या सहभागी हमी प्रणालीद्वारे सेंद्रिय शेतीला प्रोत्साहन देते.",
      kn: "ಕ್ಲಸ್ಟರ್ ವಿಧಾನ ಮತ್ತು ಪ್ರಮಾಣೀಕರಣದ ಭಾಗವಹಿಸುವಿಕೆ ಗ್ಯಾರಂಟಿ ವ್ಯವಸ್ಥೆಯ ಮೂಲಕ ಸಾವಯವ ಕೃಷಿಯನ್ನು ಉತ್ತೇಜಿಸುತ್ತದೆ."
    }
  },
  {
    id: "pm-ksy",
    name: "Pradhan Mantri Krishi Sinchayee Yojana",
    category: "Irrigation",
    eligibility: "Farmers with arable land",
    benefit: "Subsidy for micro-irrigation systems",
    applyLink: "https://pmksy.gov.in/",
    isFeatured: false,
    translations: {
      en: "Aims to achieve convergence of investments in irrigation at the field level and improve water use efficiency on the farm.",
      hi: "खेत स्तर पर सिंचाई में निवेश के अभिसरण को प्राप्त करने और खेत पर पानी के उपयोग की दक्षता में सुधार करने का लक्ष्य है।",
      mr: "शेत पातळीवर सिंचनातील गुंतवणुकीचे अभिसरण साध्य करणे आणि शेतातील पाण्याच्या वापराची कार्यक्षमता सुधारणे हे या योजनेचे उद्दिष्ट आहे.",
      kn: "ಕ್ಷೇತ್ರ ಮಟ್ಟದಲ್ಲಿ ನೀರಾವರಿಯಲ್ಲಿ ಹೂಡಿಕೆಗಳ ಒಮ್ಮುಖವನ್ನು ಸಾಧಿಸುವ ಮತ್ತು ಜಮೀನಿನಲ್ಲಿ ನೀರಿನ ಬಳಕೆಯ ದಕ್ಷತೆಯನ್ನು ಸುಧಾರಿಸುವ ಗುರಿಯನ್ನು ಹೊಂದಿದೆ."
    }
  },
  {
    id: "nlm",
    name: "National Livestock Mission",
    category: "Livestock",
    eligibility: "Farmers engaged in animal husbandry",
    benefit: "Financial assistance for livestock rearing",
    applyLink: "https://nlm.udyamimitra.in/",
    isFeatured: false,
    translations: {
      en: "Ensures quantitative and qualitative improvement in livestock production systems and capacity building of all stakeholders.",
      hi: "पशुधन उत्पादन प्रणालियों में मात्रात्मक और गुणात्मक सुधार और सभी हितधारकों क्षमता निर्माण सुनिश्चित करता है।",
      mr: "पशुधन उत्पादन प्रणालीत परिमाणात्मक आणि गुणात्मक सुधारणा आणि सर्व भागधारकांची क्षमता वाढवणे सुनिश्चित करते.",
      kn: "ಜಾನುವಾರು ಉತ್ಪಾದನಾ ವ್ಯವಸ್ಥೆಗಳಲ್ಲಿ ಪರಿಮಾಣಾತ್ಮಕ ಮತ್ತು ಗುಣಾತ್ಮಕ ಸುಧಾರಣೆಯನ್ನು ಮತ್ತು ಎಲ್ಲಾ ಪಾಲುದಾರರ ಸಾಮರ್ಥ್ಯ ವೃದ್ಧಿಯನ್ನು ಖಚಿತಪಡಿಸುತ್ತದೆ."
    }
  }
];

export const getSchemes = async (req, res) => {
  try {
    res.status(200).json({ success: true, data: schemesData });
  } catch (error) {
    console.error('Fetch Schemes Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch schemes.' });
  }
};
