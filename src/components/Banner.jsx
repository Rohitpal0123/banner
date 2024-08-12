import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import io from "socket.io-client";

const Banner = () => {
  const [bannerData, setBannerData] = useState({});
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, secs: 0 });

  const calculateTimeLeft = (endTime) => {
    const endDate = new Date(endTime);
    const now = new Date();
    const difference = endDate - now;

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, secs });
    } else {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, secs: 0 });
    }
  };

  useEffect(() => {
    // Fetch banner data from the backend on initial load
    const fetchBannerData = async () => {
      try {
        const response = await fetch("https://livebanner.onrender.com"); // Adjust the URL as per your backend route
        const data = await response.json();
        setBannerData(data);
        calculateTimeLeft(data.endTime);
      } catch (error) {
        console.error("Error fetching banner data:", error);
      }
    };

    fetchBannerData();

    const socket = io("https://livebanner.onrender.com", {
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("connect_error", (err) => {
      console.error("Connection Error:", err.message);
    });

    socket.on("bannerUpdate", (data) => {
      console.log("Received bannerUpdate:", data);
      setBannerData(data);
      calculateTimeLeft(data.endTime);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    return () => {
      socket.disconnect();
      console.log("Socket disconnected");
    };
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (bannerData.endTime) {
        calculateTimeLeft(bannerData.endTime);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [bannerData.endTime]);

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <header className="flex items-center justify-between p-4 bg-black">
        <a className="flex items-center gap-2" href="/">
          {/* TUF Logo */}
          <svg width="125" height="26" viewBox="0 0 135 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 5.89409H15.3693L9.5331 36H21.8368L27.2126 5.89409H42.2511L43.4131 0H1.17165L0 5.89409Z" fill="#D41F30"></path>
            <path d="M47.2951 0L42.512 26.9438L49.9857 36H82.8746L89.1533 0H77.1198L71.8129 30.008H56.8626L54.4711 27.0927L59.1053 0H47.2951Z" fill="#D41F30"></path>
            <path d="M86.9282 36H98.7784L100.699 23.9651H130.691L131.882 17.9993H101.825L103.214 8.93625L106.724 5.82379H122.018L120.826 11.9812H132.81L134.929 0H102.156L91.6286 9.00241L86.9282 36Z" fill="#D41F30"></path>
          </svg>
        </a>
        <Link to="/banner-controls">
          <button className="bg-[#DB2777] hover:bg-[#c02675] text-white font-semibold py-2 px-4 rounded">
            Banner Controls
          </button>
        </Link>
      </header>

      <main className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto p-8">
        <div className="text-left md:w-1/2">
          <h2 className="text-[#DB2777] font-bold text-lg">YOUR PATH TO MASTERY</h2>
          <h1 className="text-4xl md:text-6xl font-bold my-4">
            Elevate Your Learning Journey with TUF+ Course
          </h1>
          
          {bannerData.visibility && (
            <>
              <p className="text-lg text-gray-500 mb-6">
                {bannerData.description}
              </p>
              
              <div className="text-white text-lg mb-6 grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-4xl font-bold text-[#DB2777]">{timeLeft.days}</div>
                  <div className="text-gray-300">DAYS</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-[#DB2777]">{timeLeft.hours}</div>
                  <div className="text-gray-300">HOURS</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-[#DB2777]">{timeLeft.minutes}</div>
                  <div className="text-gray-300">MINS</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-[#DB2777]">{timeLeft.secs}</div>
                  <div className="text-gray-300">SECS</div>
                </div>
              </div>

              <button className="text-[#DB2777] border-2 border-[#DB2777] hover:bg-[#DB2777] hover:text-white font-semibold py-2 px-6 rounded-full">
                <a 
                  href={"https://" + bannerData.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Explore Offer &darr;
                </a>
              </button>
            </>
          )}
        </div>

        <div className="md:w-1/2 mt-8 md:mt-0">
          <iframe
            className="w-full h-64 md:h-80"
            src="https://www.youtube.com/embed/4Xh9DLUQCWs?si=QX7xHf8SDe822f_0"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
      </main>
    </div>
  );
};

export default Banner;
