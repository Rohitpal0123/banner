import { useCallback, useState } from "react";
import InputField from "./component/InputField";
import { FaCheckCircle } from "react-icons/fa"; // Importing a green tick icon from react-icons

function BannerForm() {
  const [inputs, setInputs] = useState({
    description: "",
    link: "",
    visibility: true,
    day: 0,
    hour: 0,
    minute: 0,
    second: 0,
  });

  const [showToast, setShowToast] = useState(false); // State for controlling the toaster visibility

  const handleInputs = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  // Function to format date to 'YYYY-MM-DD HH:mm:ss' in IST
  const formatDateIST = (date) => {
    const istOffset = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in milliseconds
    const istDate = new Date(date.getTime() + istOffset); // Convert to IST

    const year = istDate.getFullYear();
    const month = String(istDate.getMonth() + 1).padStart(2, '0');
    const day = String(istDate.getDate()).padStart(2, '0');
    const hours = String(istDate.getHours()).padStart(2, '0');
    const minutes = String(istDate.getMinutes()).padStart(2, '0');
    const seconds = String(istDate.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  // Handle form submission
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      const now = new Date();
      const endTime = new Date(
        now.getTime() +
          (Number(inputs.day) * 86400 +
            Number(inputs.hour) * 3600 +
            Number(inputs.minute) * 60 +
            Number(inputs.second)) *
            1000
      );

      const formattedEndTime = formatDateIST(endTime);

      const bannerData = {
        description: inputs.description,
        link: inputs.link,
        endTime: formattedEndTime, // Send endTime in IST format
        visibility: inputs.visibility, // Use the visibility value from state
      };

      fetch("https://livebanner.onrender.com/banner/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bannerData),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
          setShowToast(true); // Show the toast notification
          setTimeout(() => setShowToast(false), 3000); // Hide the toast after 3 seconds
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },
    [inputs]
  );

  return (
    <div className="relative max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-6 text-[#DB2777]">Banner Details</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <input
            type="text"
            name="description"
            id="description"
            value={inputs.description}
            onChange={handleInputs}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#DB2777] focus:border-[#DB2777] sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="link" className="block text-sm font-medium text-gray-700">
            Link
          </label>
          <input
            type="text"
            name="link"
            id="link"
            value={inputs.link}
            onChange={handleInputs}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#DB2777] focus:border-[#DB2777] sm:text-sm"
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            name="visibility"
            id="visibility"
            checked={inputs.visibility}
            onChange={handleInputs}
            className="h-4 w-4 text-[#DB2777] border-gray-300 rounded focus:ring-[#DB2777]"
          />
          <label htmlFor="visibility" className="ml-2 block text-sm font-medium text-gray-700">
            Visibility
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="day" className="block text-sm font-medium text-gray-700">
              Day
            </label>
            <input
              type="number"
              name="day"
              id="day"
              value={inputs.day}
              onChange={handleInputs}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#DB2777] focus:border-[#DB2777] sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="hour" className="block text-sm font-medium text-gray-700">
              Hour
            </label>
            <input
              type="number"
              name="hour"
              id="hour"
              value={inputs.hour}
              onChange={handleInputs}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#DB2777] focus:border-[#DB2777] sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="minute" className="block text-sm font-medium text-gray-700">
              Minute
            </label>
            <input
              type="number"
              name="minute"
              id="minute"
              value={inputs.minute}
              onChange={handleInputs}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#DB2777] focus:border-[#DB2777] sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="second" className="block text-sm font-medium text-gray-700">
              Second
            </label>
            <input
              type="number"
              name="second"
              id="second"
              value={inputs.second}
              onChange={handleInputs}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#DB2777] focus:border-[#DB2777] sm:text-sm"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-[#DB2777] text-white p-2 rounded-md hover:bg-[#c02675] focus:ring-2 focus:ring-[#DB2777] focus:ring-offset-2 shadow-md"
        >
          Submit
        </button>
      </form>

      {showToast && (
        <div className="fixed bottom-4 right-4 flex items-center p-4 bg-white border border-gray-300 rounded shadow-md">
          <FaCheckCircle className="text-green-500 mr-2" />
          <span className="text-gray-700 font-bold">Form Submitted Successfully!</span>
        </div>
      )}
    </div>
  );
}

export default BannerForm;
