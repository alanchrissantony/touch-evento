import "./App.css";
import image1 from "./assets/img/image3.png";
import image2 from "./assets/img/image3.png";
import image3 from "./assets/img/image3.png";
import image4 from "./assets/img/image4.png";
import bgImage from "./assets/img/bg-image.png";
import useMediaQuery from "./components/hooks/useMediaQuery";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ColorThief from "colorthief";
import axiosInstance from "./api"

function App() {
  const [active, setActive] = useState("Invitation");
  const [image, setImage] = useState(image1);
  const [current, setCurrent] = useState(1);
  const [direction, setDirection] = useState(true);
  const [themeColor, setThemeColor] = useState("#fedada"); // Default color
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const mainStyle = isDesktop ? { backgroundImage: `url(${bgImage})` } : {};

  useEffect(() => {
    const extractColor = async () => {
      const colorThief = new ColorThief();
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = image1;

      img.onload = () => {
        const palette = colorThief.getPalette(img, 2);
        setThemeColor(`rgb(${palette[0].join(",")}`);
      };
    };

    extractColor();
  }, []);

  const handleActive = (value, image, position) => {
    const newDirection = position > current;
    setCurrent(position);
    setDirection(newDirection);
    setActive(value);
    setImage(() => image);
  };

  const getContrastColor = (rgbColor) => {
    if (!rgbColor) return "#ffffff";
    const [r, g, b] = rgbColor.replace(/rgb\(|\)/g, '').split(',').map(Number);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? "#333333" : "#ffffff";
  };

  const [rsvpForm, setRsvpForm] = useState({
    name: "",
    number: ""
  });
  const [formError, setFormError] = useState("");

  const handleChangeRsvp = (e) => {
    const { name, value } = e.target;
    setRsvpForm(prev => ({
      ...prev,
      [name]: value
    }));
    setFormError("");
  };

  const handleRSVPSubmit = async(e) => {
    e.preventDefault();

    if (!rsvpForm.name.trim()) {
      setFormError("Please fill in all fields");
      return;
    }

    const result = await axiosInstance.post('/', rsvpForm)
    console.log(result);
    
    alert(`Thank you ${rsvpForm.name}! Your RSVP has been received.`);
    setRsvpForm({ name: "", number: "" });
    setFormError("");
  };

  return (
    <main
      className="fixed lg:static w-full h-[90vh] lg:h-screen flex justify-center items-center bg-cover"
      style={mainStyle}
    >
      <section className="w-11/12 lg:w-4/12 xl:w-4/12 flex items-center">
        <div className="flex flex-col justify-center items-center w-full">
          <div className="flex bg-white bg-opacity-70 rounded-lg w-full">
            <Button
              title="Invitation"
              active={active}
              handleActive={handleActive}
              position={1}
              themeColor={themeColor}
              image={image1}
            />
            <Button
              title="Schedule"
              active={active}
              handleActive={handleActive}
              position={2}
              themeColor={themeColor}
              image={image2}
            />
            <Button
              title="Information"
              active={active}
              handleActive={handleActive}
              position={3}
              themeColor={themeColor}
              image={image3}
            />
            <Button
              title="RSVP"
              active={active}
              handleActive={handleActive}
              position={4}
              themeColor={themeColor}
              image={image4}
            />
          </div>
          <div className="w-full relative overflow-hidden rounded-lg h-[70vh] lg:h-[90vh]">
            <AnimatePresence mode="popLayout" initial={false} custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                initial={{
                  x: direction ? "100%" : "-100%",
                  opacity: 0.7
                }}
                animate={{
                  x: 0,
                  opacity: 1
                }}
                exit={{
                  x: direction ? "-100%" : "100%",
                  opacity: 0.7,
                  transition: { duration: 0.3 }
                }}
                transition={{
                  duration: 0.4,
                  ease: "easeInOut"
                }}
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  willChange: 'transform, opacity'
                }}
              >
                <motion.img
                  src={image}
                  alt="Content"
                  className="w-full h-full object-cover rounded-lg shadow-lg border-[1.5px] border-red-50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />

                {active === "RSVP" && (
                  <div className="absolute inset-0 flex justify-center items-center p-4">
                    <form
                      onSubmit={handleRSVPSubmit}
                      className="w-full max-w-md bg-transparent bg-opacity-20 backdrop-blur-md rounded-xl p-6 shadow-xl"
                    >
                      <div className="flex flex-col gap-4">
                        <input
                          type="text"
                          name="name"
                          placeholder="Enter your name"
                          value={rsvpForm.name}
                          onChange={handleChangeRsvp}
                          className="w-full px-4 py-3 rounded-lg border-1 focus:outline-none focus:ring-1 bg-transparent"
                          style={{
                            borderColor: getContrastColor(themeColor),
                            focusRingColor: themeColor,
                            color: getContrastColor(themeColor),
                            placeholderColor: getContrastColor(themeColor)
                          }}
                        />
                        <input
                          type="tel"
                          name="number"
                          placeholder="Enter your phone number"
                          value={rsvpForm.number}
                          onChange={handleChangeRsvp}
                          className="w-full px-4 py-3 rounded-lg border-1 focus:outline-none focus:ring-1 bg-transparent"
                          style={{
                            borderColor: getContrastColor(themeColor),
                            focusRingColor: themeColor,
                            color: getContrastColor(themeColor),
                            placeholderColor: getContrastColor(themeColor)
                          }}
                        />
                        {formError && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-sm text-center"
                            style={{ color: getContrastColor(themeColor) }}
                          >
                            {formError}
                          </motion.p>
                        )}
                        <button
                          type="submit"
                          className="w-full py-3 rounded-lg font-medium transition-opacity hover:opacity-90 cursor-pointer"
                          style={{
                            backgroundColor: themeColor,
                            color: getContrastColor(themeColor)
                          }}
                        >
                          Submit RSVP
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>
    </main>
  );
}


const Button = ({ title, active, handleActive, position, themeColor, image }) => {

  const getContrastColor = (rgbColor) => {
    if (!rgbColor) return "#ffffff";
    const [r, g, b] = rgbColor.replace(/rgb\(|\)/g, '').split(',').map(Number);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? "#333333" : "#ffffff";
  };

  const adjustOpacity = (rgbColor, opacity) => {
    if (!rgbColor) return "rgba(0,0,0,0.1)";
    return rgbColor.replace('rgb(', 'rgba(').replace(')', `, ${opacity})`);
  };

  const textColor = getContrastColor(themeColor);
  const activeBorderColor = adjustOpacity(themeColor, 0.5);
  const inactiveBorderColor = adjustOpacity(themeColor, 0.2);

  return (
    <button
      onClick={() => handleActive(title, image, position)}
      className={`h-[2rem] rounded-lg cursor-pointer border-2 w-full text-sm md:text-base transition-all duration-300 rounded-b-none border-b-0`}
      style={{
        backgroundColor: active === title
          ? themeColor
          : getContrastColor(adjustOpacity(themeColor, 0.2)),
        borderColor: active === title
          ? activeBorderColor
          : inactiveBorderColor,
        color: active === title
          ? textColor
          : adjustOpacity(textColor, 0.7)
      }}
    >
      {title}
    </button>
  );
};


export default App;

