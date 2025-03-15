import "./App.css";
import video1 from "./assets/img/video1.mp4";
import image2 from "./assets/img/image22.png";
import image3 from "./assets/img/image444.png";
import image4 from "./assets/img/image444.png";
import bgImage from "./assets/img/bg-image1.png";
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
  const [r, g, b] = rgbColor.replace(/rgb\(|\)/g, '').split(',').map(Number);
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
  // Define the available tabs with title and associated media
  const tabs = [
    { title: "Invitation", media: video1 },
    { title: "Schedule", media: image2 },
    { title: "Information", media: image3 },
    { title: "RSVP", media: image4 }
  ];

  // Set initial state; we use 0-index for currentIndex
  const [activeTab, setActiveTab] = useState(tabs[0].title);
  const [contentMedia, setContentMedia] = useState(tabs[0].media);
  const [currentIndex, setCurrentIndex] = useState(0);
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

  // Handle tab changes from both click and swipe events
  const handleTabChange = (newIndex) => {
    const newDirection = newIndex > currentIndex;
    setAnimationDirection(newDirection);
    setCurrentIndex(newIndex);
    setActiveTab(tabs[newIndex].title);
    setContentMedia(tabs[newIndex].media);
  };

  return (
    <main
      className="h-[90vh] lg:h-screen flex justify-center items-center bg-cover bg-center p-4"
      style={isDesktop ? { backgroundImage: `url(${bgImage})` } : {}}
    >
      <section className="w-full max-w-lg bg-white bg-opacity-90 rounded-xl shadow-xl overflow-hidden">
        <div className="flex flex-col">
          <TabBar
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            themeColor={themeColor}
            currentIndex={currentIndex}
          />
          <ContentContainer
            activeTab={activeTab}
            contentMedia={contentMedia}
            animationDirection={animationDirection}
            currentIndex={currentIndex}
            themeColor={themeColor}
            tabs={tabs}
            onTabChange={handleTabChange}
          />
        </div>
      </section>
    </main>
  );
}

// -------------------- Tab Bar Components --------------------
const TabBar = ({ tabs, activeTab, onTabChange, themeColor, currentIndex }) => (
  <div className="flex bg-white bg-opacity-70">
    {tabs.map((tab, index) => (
      <TabButton
        key={tab.title}
        title={tab.title}
        isActive={activeTab === tab.title}
        onClick={() => onTabChange(index)}
        themeColor={themeColor}
      />
    ))}
  </div>
);

const TabButton = ({ title, isActive, onClick, themeColor }) => {
  const adjustOpacity = (rgbColor, opacity) => {
    if (!rgbColor) return "rgba(0,0,0,0.1)";
    return rgbColor.replace('rgb(', 'rgba(').replace(')', `, ${opacity})`);
  };
  const buttonStyle = {
    backgroundColor: isActive ? themeColor : `${adjustOpacity(themeColor, 0.2)}`,
    color: isActive ? getContrastColor(themeColor) : `${getContrastColor(themeColor)}b3`,
    borderColor: isActive ? `${adjustOpacity(themeColor, 0.5)}` : `${adjustOpacity(themeColor, 0.2)}`
  };



  return (
    <button
      onClick={onClick}
      className="flex-1 h-10 text-sm md:text-base transition-all duration-300 rounded-t-lg border-2 border-b-0 cursor-pointer"
      style={buttonStyle}
    >
      {title}
    </button>
  );
};

// -------------------- Content & Animation Components --------------------
const ContentContainer = ({
  activeTab,
  contentMedia,
  animationDirection,
  currentIndex,
  themeColor,
  tabs,
  onTabChange
}) => {
  // Swipe threshold in pixels; adjust as needed.
  const swipeThreshold = 100;

  return (
    <div className="relative overflow-hidden h-[70vh] lg:h-[90vh]">
      <AnimatePresence mode="popLayout" initial={false} custom={animationDirection}>
        <motion.div
          key={currentIndex}
          custom={animationDirection}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(e, info) => {
            if (info.offset.x < -swipeThreshold && currentIndex < tabs.length - 1) {
              onTabChange(currentIndex + 1);
            } else if (info.offset.x > swipeThreshold && currentIndex > 0) {
              onTabChange(currentIndex - 1);
            }
          }}
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
};

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
// -------------------- Information Page Component --------------------


// -------------------- Information Page Component --------------------
const InformationPage = ({ themeColor }) => (
  <div
    className="p-6 bg-cover bg-center h-full overflow-y-auto scrollbar-hide"
    style={{ backgroundImage: `url(${image4})` }}
  >
    <div className="bg-white bg-opacity-90 rounded-md shadow-lg p-6">
      <h1
        className="text-xl md:text-3xl font-bold text-center mb-6"
        style={{ color: themeColor, textShadow: "0px 1px 2px rgba(0,0,0,0.1)" }}
      >
        Event Information
      </h1>

      <EventCard
        title="Ceremony"
        date="May 01, 2025, 11:15 AM – 12:00 PM"
        location="Madayi Cooperative Rural Bank Auditorium, Ezhome, Pazhayangadi"
        mapUrl="https://www.google.com/maps/search/Madayi+Cooperative+Rural+Bank+Auditorium"
        themeColor={themeColor}
      />

      <EventCard
        title="Reception"
        date="May 02, 2025, 5:00 PM – 9:00 PM"
        location="Marmara Beach House, Payyambalam"
        mapUrl="https://www.google.com/maps/search/Marmara+Beach+House"
        themeColor={themeColor}
      />

      <section className="mt-8">
        <h2
          className="text-base md:text-2xl font-bold text-center mb-6"
          style={{ color: themeColor, textShadow: "0px 1px 2px rgba(0,0,0,0.1)" }}
        >
          Travel &amp; Stay
        </h2>
        <TravelGuide themeColor={themeColor} />
      </section>
    </div>
  </div>
);

// -------------------- Event Card Component --------------------
const EventCard = ({ title, date, location, mapUrl, themeColor }) => (
  <section
    className="mb-6 p-4 rounded-lg transition-all duration-300 hover:shadow-md"
    style={{ backgroundColor: `${themeColor}15`, borderLeft: `4px solid ${themeColor}` }}
  >
    <h2 className="text-base md:text-2xl font-semibold mb-3">
      <IconText icon={Event} text={title} size="24px" />
    </h2>

    <div className="ml-2 space-y-3">
      <p className="flex items-start">
        <DateRange style={{ marginRight: 8, color: themeColor }} />
        <span>{date}</span>
      </p>

      <p className="flex items-start">
        <LocationOn style={{ marginRight: 8, color: themeColor }} />
        <span>{location}</span>
      </p>

      <a
        href={mapUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center mt-2 p-2 rounded-md transition-all hover:bg-opacity-80"
        style={{
          backgroundColor: `${themeColor}30`,
          color: themeColor,
          border: `1px solid ${themeColor}50`
        }}
      >
        <Map style={{ marginRight: 8 }} />
        View on Google Maps
      </a>
    </div>
  </section>
);

// -------------------- Travel & Stay Components --------------------
const TravelGuide = ({ themeColor }) => (
  <div className="space-y-6">
    <TransportationInfo themeColor={themeColor} />
    <AccommodationInfo themeColor={themeColor} />
  </div>
);

const TransportationInfo = ({ themeColor }) => {
  // Enhanced transportation data with hyperlinks and icons
  const enhancedTransportData = [
    {
      name: "Kannur International Airport (CNN)",
      distance: "15km, 25min",
      mapUrl: "https://www.google.com/maps/search/Kannur+International+Airport",
      destination: "Wedding Venue/Reception Venue"
    },
    {
      name: "Kozhikode International Airport (CCJ)",
      distance: "85km, 2hr",
      mapUrl: "https://www.google.com/maps/search/Kozhikode+International+Airport",
      destination: "Wedding Venue/Reception Venue"
    },
    {
      name: "Payyanur Railway Station (PAY)",
      distance: "8km, 15min",
      mapUrl: "https://www.google.com/maps/search/Payyanur+Railway+Station",
      destination: "Wedding Venue"
    },
    {
      name: "Kannur Railway Station",
      distance: "6km, 12min",
      mapUrl: "https://www.google.com/maps/search/Kannur+Railway+Station",
      destination: "Reception Venue"
    }
  ];

  return (
    <div
      className="p-4 rounded-lg"
      style={{ backgroundColor: `${themeColor}10`, borderLeft: `4px solid ${themeColor}` }}
    >
      <h3
        className="text-sm md:text-xl font-bold mb-4"
        style={{ color: themeColor }}
      >
        <IconText icon={DirectionsBus} text="Transportation" size="22px" />
      </h3>

      <div className="space-y-3">
        {enhancedTransportData.map((item, index) => (
          <div
            key={index}
            className="flex flex-col p-2 rounded-md hover:bg-white hover:bg-opacity-50 transition-all"
          >
            <div className="flex items-center justify-between">
              <a
                href={item.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:underline"
                style={{ color: themeColor }}
              >
                {item.name}
              </a>
              <span className="text-sm font-semibold bg-gray-100 px-2 py-1 rounded-full">
                {item.distance}
              </span>
            </div>
            <span className="text-sm text-gray-600 ml-2 mt-1">To: {item.destination}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const AccommodationInfo = ({ themeColor }) => {
  // Enhanced accommodation data with hyperlinks and additional info
  const enhancedAccommodationData = [
    {
      name: "Marmara Beach House",
      mapUrl: "https://www.google.com/maps/search/Marmara+Beach+House+Kannur",
      type: "Beachfront Resort"
    },
    {
      name: "Krishna Beach Resort",
      mapUrl: "https://www.google.com/maps/search/Krishna+Beach+Resort+Kannur",
      type: "Luxury Resort"
    },
    {
      name: "Kannur Beach House",
      mapUrl: "https://www.google.com/maps/search/Kannur+Beach+House",
      type: "Boutique Stay"
    },
    {
      name: "Malabar Oceanfront Resort",
      mapUrl: "https://www.google.com/maps/search/Malabar+Oceanfront+Resort+Kannur",
      type: "Premium Resort"
    }
  ];

  return (
    <div
      className="p-4 rounded-lg"
      style={{ backgroundColor: `${themeColor}10`, borderLeft: `4px solid ${themeColor}` }}
    >
      <h3
        className="text-sm md:text-xl font-bold mb-4"
        style={{ color: themeColor }}
      >
        <IconText icon={Hotel} text="Accommodations" size="22px" />
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {enhancedAccommodationData.map((item, index) => (
          <a
            key={index}
            href={item.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-md hover:shadow-md transition-all flex flex-col"
            style={{
              backgroundColor: `${themeColor}20`,
              borderBottom: `2px solid ${themeColor}`
            }}
          >
            <span className="font-medium" style={{ color: themeColor }}>
              {item.name}
            </span>
            <span className="text-sm text-gray-600">{item.type}</span>
          </a>
        ))}
      </div>
    </div>
  );
};


// -------------------- RSVP Form Component (Glass Style) --------------------
const RSVPForm = ({ themeColor = "#fedada" }) => {
  const [formData, setFormData] = useState({ name: "", number: "" });
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Replace with your deployed Google Apps Script URL
  const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

  const handleRSVPSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError("Please enter your name");
      return;
    }
    setIsSubmitting(true);
    setFormError("");
    try {
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        cache: "no-cache",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
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
    <div
      className="absolute inset-0 flex justify-center items-center p-4 overflow-auto bg-cover bg-center"
      style={{ backgroundImage: `url(${image4})` }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-transparent bg-opacity-20 backdrop-blur-md rounded-xl p-6 shadow-xl"
      >
        {submitted ? (
          <SuccessMessage
            name={formData.name}
            themeColor={themeColor}
            resetForm={() => setSubmitted(false)}
          />
        ) : (
          <form onSubmit={handleRSVPSubmit}>
            <h2 className="text-2xl font-bold text-center mb-4" style={{ color: themeColor, fontFamily: 'Dancing Script, cursive' }}>
              We are so happy to have you
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
            <div className="flex justify-end gap-x-2 pt-2">
              <a href="https://wa.me/+919605100616" className="cursor-pointer">
                <WhatsappIcon size={"24px"} fill={themeColor}/>
              </a>
              <a href="https://www.instagram.com/touchevento" className="cursor-pointer">
                <InstagramIcon size={"24px"} fill={themeColor}/>
              </a>
              
            </div>
            
          </form>
        )}
      </motion.div>
    </div>
  );
};

const FormInput = ({ name, value, onChange, placeholder, themeColor, type = "text", icon }) => {
  const adjustOpacity = (rgbColor, opacity) => {
    if (!rgbColor) return "rgba(0,0,0,0.1)";
    return rgbColor.replace('rgb(', 'rgba(').replace(')', `, ${opacity})`);
  };
  return (
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
        className="w-full px-10 py-3 rounded-lg border-1 focus:outline-none focus:ring-1 bg-transparent"
        style={{
          borderColor: adjustOpacity(themeColor),
          focusRingColor: themeColor,
          color: adjustOpacity(themeColor),
          placeholderColor: adjustOpacity(themeColor)
        }}
      />
    </div>
  )
}


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
    {isSubmitting ? "Submitting..." : (<><Send fontSize="small" />Submit RSVP</>)}
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

const WhatsappIcon = ({size, fill})=>{
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" height={size} width={size} fill={fill}><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg>
  )
}

const InstagramIcon = ({size, fill})=>{
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" height={size} width={size} fill={fill}><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/></svg>
  )
}

export default App;
