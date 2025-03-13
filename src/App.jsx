import "./App.css";
import video1 from "./assets/img/video1.mp4";
import image2 from "./assets/img/image22.png";
import image3 from "./assets/img/image44.png";
import image4 from "./assets/img/image44.png";
// Use one consistent background image filename
import bgImage from "./assets/img/bg-image.png";
import useMediaQuery from "./components/hooks/useMediaQuery";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ColorThief from "colorthief";
import {
  Person,
  Phone,
  Send,
  Event,
  DateRange,
  LocationOn,
  Map,
  DirectionsBus,
  Hotel
} from "@mui/icons-material";

// Utility function to determine proper contrast color based on brightness
const getContrastColor = (rgbColor) => {
  if (!rgbColor) return "#ffffff";
  const [r, g, b] = rgbColor.replace(/rgb\(|\)/g, "").split(",").map(Number);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? "#333333" : "#ffffff";
};

// Reusable component to pair an icon with text
const IconText = ({ icon: Icon, text, size = "20px" }) => (
  <span className="flex items-center">
    {Icon && <Icon style={{ marginRight: 8, height: size, width: size }} />}
    {text}
  </span>
);

function App() {
  const [activeTab, setActiveTab] = useState("Invitation");
  const [contentMedia, setContentMedia] = useState(video1);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [animationDirection, setAnimationDirection] = useState(true);
  const [themeColor, setThemeColor] = useState("#fedada");
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Extract a dominant color from image2 for dynamic theming.
  useEffect(() => {
    const extractThemeColor = async () => {
      try {
        const colorThief = new ColorThief();
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = image2;
        img.onload = () => {
          const palette = colorThief.getPalette(img, 2);
          setThemeColor(`rgb(${palette[0].join(",")})`);
        };
      } catch (error) {
        console.error("Color extraction failed:", error);
      }
    };
    extractThemeColor();
  }, []);

  const handleTabChange = (tabName, media, position) => {
    const newDirection = position > currentIndex;
    setCurrentIndex(position);
    setAnimationDirection(newDirection);
    setActiveTab(tabName);
    setContentMedia(media);
  };

  return (
    <main
      className="fixed lg:static w-full h-[90vh] lg:h-screen flex justify-center items-center bg-cover"
      style={isDesktop ? { backgroundImage: `url(${bgImage})` } : {}}
    >
      <section className="w-11/12 lg:w-4/12 xl:w-4/12 flex items-center">
        <div className="flex flex-col justify-center items-center w-full">
          <TabBar activeTab={activeTab} handleTabChange={handleTabChange} themeColor={themeColor} />
          <ContentContainer
            activeTab={activeTab}
            contentMedia={contentMedia}
            animationDirection={animationDirection}
            currentIndex={currentIndex}
            themeColor={themeColor}
          />
        </div>
      </section>
    </main>
  );
}

// -------------------- Tab Bar Components --------------------
const TabBar = ({ activeTab, handleTabChange, themeColor }) => {
  const tabs = [
    { title: "Invitation", media: video1 },
    { title: "Schedule", media: image2 },
    { title: "Information", media: image3 },
    { title: "RSVP", media: image4 }
  ];

  return (
    <div className="flex bg-white bg-opacity-70 rounded-lg w-full">
      {tabs.map((tab, index) => (
        <TabButton
          key={tab.title}
          title={tab.title}
          isActive={activeTab === tab.title}
          onClick={() => handleTabChange(tab.title, tab.media, index + 1)}
          themeColor={themeColor}
        />
      ))}
    </div>
  );
};

const TabButton = ({ title, isActive, onClick, themeColor }) => {
  const buttonStyle = {
    backgroundColor: isActive ? themeColor : `${getContrastColor(themeColor)}20`,
    color: isActive ? getContrastColor(themeColor) : `${getContrastColor(themeColor)}b3`,
    borderColor: isActive ? `${themeColor}80` : `${themeColor}33`
  };

  return (
    <button
      onClick={onClick}
      className="h-[2rem] w-full text-sm md:text-base transition-all duration-300 rounded-t-lg border-2 border-b-0 cursor-pointer"
      style={buttonStyle}
    >
      {title}
    </button>
  );
};

// -------------------- Content & Animation Components --------------------
const ContentContainer = ({ activeTab, contentMedia, animationDirection, currentIndex, themeColor }) => (
  <div className="w-full relative overflow-y-auto rounded-lg h-[70vh] lg:h-[90vh]">
    <AnimatePresence mode="popLayout" initial={false} custom={animationDirection}>
      <motion.div
        key={currentIndex}
        custom={animationDirection}
        initial={{ x: animationDirection ? "100%" : "-100%", opacity: 0.7 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: animationDirection ? "-100%" : "100%", opacity: 0.7 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="absolute w-full h-full flex justify-center items-center"
      >
        {activeTab === "Invitation" && <VideoPlayer contentMedia={contentMedia} />}
        {activeTab === "Schedule" && <ContentImage contentMedia={contentMedia} />}
        {activeTab === "Information" && <InformationPage themeColor={themeColor} />}
        {activeTab === "RSVP" && <RSVPForm themeColor={themeColor} />}
      </motion.div>
    </AnimatePresence>
  </div>
);

const VideoPlayer = ({ contentMedia }) => (
  <video
    autoPlay
    muted
    playsInline
    onEnded={(e) => e.target.pause()}
    className="w-full h-full object-cover rounded-lg shadow-lg border"
  >
    <source src={contentMedia} type="video/mp4" />
  </video>
);

const ContentImage = ({ contentMedia }) => (
  <motion.img
    src={contentMedia}
    alt="Content"
    className="w-full h-full object-cover rounded-lg shadow-lg border"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  />
);

// -------------------- Information Page Component --------------------
const InformationPage = ({ themeColor }) => (
  <div className="p-6 bg-white bg-opacity-90 rounded-md shadow-lg max-h-[90%] w-full md:w-11/12 overflow-y-auto">
    <h1 className="text-3xl font-bold text-center mb-4" style={{ color: themeColor }}>
      Event Information
    </h1>
    <section className="mb-6">
      <h2 className="text-2xl font-semibold mb-2">
        <IconText icon={Event} text="Ceremony" size="24px" />
      </h2>
      <p className="mb-2">
        <IconText icon={DateRange} text="May 01, 2025, 11:15 AM – 12:00 PM" size="20px" />
      </p>
      <p className="mb-2">
        <IconText icon={LocationOn} text="Madayi Cooperative Rural Bank Auditorium, Ezhome, Pazhayangadi" size="20px" />
      </p>
      <a
        href="https://www.google.com/maps/search/Madayi+Cooperative+Rural+Bank+Auditorium"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline hover:text-blue-800"
        style={{ color: getContrastColor(themeColor) }}
      >
        <IconText icon={Map} text="View on Google Maps" size="20px" />
      </a>
    </section>
    <section className="mb-6">
      <h2 className="text-2xl font-semibold mb-2">
        <IconText icon={Event} text="Reception" size="24px" />
      </h2>
      <p className="mb-2">
        <IconText icon={DateRange} text="May 02, 2025, 5:00 PM – 9:00 PM" size="20px" />
      </p>
      <p className="mb-2">
        <IconText icon={LocationOn} text="Marmara Beach House, Payyambalam" size="20px" />
      </p>
      <a
        href="https://www.google.com/maps/search/Marmara+Beach+House"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline hover:text-blue-800"
        style={{ color: getContrastColor(themeColor) }}
      >
        <IconText icon={Map} text="View on Google Maps" size="20px" />
      </a>
    </section>
    <section>
      <h2 className="text-2xl font-bold text-center mb-4">Travel &amp; Stay</h2>
      <TravelGuide themeColor={themeColor} />
    </section>
  </div>
);

const TravelGuide = ({ themeColor }) => (
  <div className="space-y-4">
    <TransportationInfo themeColor={themeColor} />
    <AccommodationInfo themeColor={themeColor} />
  </div>
);

const TransportationInfo = ({ themeColor }) => (
  <div>
    <h3 className="text-xl font-bold mb-2">
      <IconText icon={DirectionsBus} text="Transportation" size="20px" />
    </h3>
    <ul className="list-disc list-inside ml-4 space-y-1">
      {transportationData.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  </div>
);

const AccommodationInfo = ({ themeColor }) => (
  <div>
    <h3 className="text-xl font-bold mt-4 mb-2">
      <IconText icon={Hotel} text="Accommodations" size="20px" />
    </h3>
    <ul className="list-disc list-inside ml-4 space-y-1">
      {accommodationData.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  </div>
);

const transportationData = [
  "Kannur International Airport (CNN) → Wedding Venue/Reception Venue (15km, 25min)",
  "Kozhikode International Airport (CCJ) → Wedding Venue/Reception Venue (85km, 2hr)",
  "Payyanur Railway Station (PAY) → Wedding Venue (8km, 15min)",
  "Kannur Railway Station → Reception Venue (6km, 12min)"
];

const accommodationData = [
  "Marmara Beach House",
  "Krishna Beach Resort",
  "Kannur Beach House",
  "Malabar Oceanfront Resort"
];

// -------------------- RSVP Form Component (Glass Style) --------------------
// The following code is based on your provided snippet.
const RSVPForm = ({ themeColor = "#fedada" }) => {
  const [formData, setFormData] = useState({ name: "", number: "" });
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  // Replace with your deployed Google Apps Script URL
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzr6At2oeUBpJaEql-xq4upTTAaFNVlF8XB4m07EDQC8yKMyzTnePScrY2JPR5Lgtje/exec";

  const handleRSVPSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name.trim()) {
      setFormError("Please enter your name");
      return;
    }
    
    setIsSubmitting(true);
    setFormError("");
    
    try {
      // Send data to Google Sheet via the Apps Script web app
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors", // Important for cross-origin requests to Google Apps Script
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData)
      });
      
      // Since we're using "no-cors" mode, we assume success if no error is thrown
      setSubmitted(true);
      setFormData({ name: "", number: "" });
      
    } catch (error) {
      console.error("RSVP submission error:", error);
      setFormError("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormChange = (newData) => {
    setFormData(newData);
    if (formError) setFormError("");
  };

  return (
    <div className="absolute inset-0 flex justify-center items-center p-4 overflow-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        // Glass style container with a frosted background look
        className="w-full max-w-md bg-white bg-opacity-95 rounded-xl p-6 shadow-xl"
      >
        {submitted ? (
          <SuccessMessage name={formData.name} themeColor={themeColor} resetForm={() => setSubmitted(false)} />
        ) : (
          <form onSubmit={handleRSVPSubmit}>
            <h2 className="text-2xl font-bold text-center mb-4" style={{ color: themeColor }}>
              RSVP
            </h2>
            
            <div className="flex flex-col gap-4">
              <FormInput
                name="name"
                value={formData.name}
                onChange={(e) => handleFormChange({ ...formData, name: e.target.value })}
                placeholder="Enter your name"
                themeColor={themeColor}
                icon={<Person />}
              />
              
              <FormInput
                name="number"
                value={formData.number}
                onChange={(e) => handleFormChange({ ...formData, number: e.target.value })}
                placeholder="Enter your phone number"
                themeColor={themeColor}
                type="tel"
                icon={<Phone />}
              />
              
              {formError && <ErrorMessage message={formError} themeColor={themeColor} />}
              
              <SubmitButton themeColor={themeColor} isSubmitting={isSubmitting} />
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

const FormInput = ({ name, value, onChange, placeholder, themeColor, type = "text", icon }) => (
  <div className="relative">
    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
      {React.cloneElement(icon, { style: { color: themeColor }, fontSize: "small" })}
    </div>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-3 pl-10 rounded-lg border focus:outline-none focus:ring-2 bg-white bg-opacity-90"
      style={{
        borderColor: themeColor,
        color: "#333",
        transition: "all 0.3s ease"
      }}
    />
  </div>
);

const ErrorMessage = ({ message, themeColor }) => (
  <motion.p
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="text-sm text-center p-2 rounded-md"
    style={{ 
      backgroundColor: `${themeColor}20`, 
      color: themeColor,
      border: `1px solid ${themeColor}40`
    }}
  >
    {message}
  </motion.p>
);

const SubmitButton = ({ themeColor, isSubmitting }) => (
  <button
    type="submit"
    disabled={isSubmitting}
    className="w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 hover:shadow-lg disabled:opacity-70"
    style={{
      backgroundColor: themeColor,
      color: getContrastColor(themeColor)
    }}
  >
    {isSubmitting ? (
      "Submitting..."
    ) : (
      <>
        <Send fontSize="small" />
        Submit RSVP
      </>
    )}
  </button>
);

const SuccessMessage = ({ name, themeColor, resetForm }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-4">
    <div
      className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
      style={{ backgroundColor: `${themeColor}30` }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill={themeColor}>
        <path
          fillRule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
          clipRule="evenodd"
        />
      </svg>
    </div>
    <h3 className="text-xl font-bold mb-2" style={{ color: themeColor }}>
      Thank You!
    </h3>
    <p className="text-gray-700 mb-6">
      Your RSVP has been received. We look forward to celebrating with you!
    </p>
    <button
      onClick={resetForm}
      className="px-4 py-2 rounded-lg text-sm transition-all"
      style={{ 
        backgroundColor: `${themeColor}20`,
        color: themeColor,
        border: `1px solid ${themeColor}`
      }}
    >
      Submit Another Response
    </button>
  </motion.div>
);

export default App;
