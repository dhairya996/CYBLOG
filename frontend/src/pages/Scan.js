import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { Oval } from "react-loader-spinner";
import Report from "./ViewReport";

export default function Scan() {
  const [cookies] = useCookies();
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [formData, setFormData] = useState({
    username: cookies.UserId,
    url: "",
  });
  const [multipleWebsites, setMultipleWebsites] = useState([]);
  const [selectedWebsite, setSelectedWebsite] = useState(null);
  const [cachedReports, setCachedReports] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { url } = formData;

      // Check if the user has provided multiple websites
      if (url.includes(";")) {
        const websites = url.split(";").map((w) => w.trim());
        setMultipleWebsites(websites);
        setSelectedWebsite(websites[0]); // Set the first website as selected
      } else {
        // If it's a single website, check if the report data is already cached
        if (cachedReports[url]) {
          setReportData(cachedReports[url]);
        } else {
          // If not cached, call the API and cache the result
          const res = await fetch("http://localhost:8000/scan", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              url,
            }),
          });
          const data = await res.text();
          setReportData(data);
 // Cache the report data
 setCachedReports((prev) => ({
  ...prev,
  [url]: data,
}));
}
}
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  // Handle changes in the URL input field
  const handleChange = (e) => {
    const { value, name } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Fetch the report data for the selected website when it changes
  useEffect(() => {
    if (selectedWebsite) {
      // Check if the report data is already cached
      if (cachedReports[selectedWebsite]) {
        setReportData(cachedReports[selectedWebsite]);
      } else {
        // If not cached, make an API call and cache the result
        const fetchReportForSelectedWebsite = async () => {
          try {
            setLoading(true);

            const res = await fetch("http://localhost:8000/scan", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                url: selectedWebsite,
              }),
            });
            const data = await res.text();
            setReportData(data);

            // Cache the report data
            setCachedReports((prev) => ({
              ...prev,
              [selectedWebsite]: data,
            }));

            setLoading(false);
          } catch (e) {
            console.error(e);
            setLoading(false);
          }
        };

        fetchReportForSelectedWebsite();
      }
    }
  }, [selectedWebsite, cachedReports]);

  return (
    <div className="onboarding bg-[#E1E9F4] bg-opacity-20">
      <h2 className="text-2xl md:text-3xl font-bold text-[#0287BF] text-center pt-8 pb-5">
        Scan Website
      </h2>
      <form
        className="justify-center w-[50%] ml-[25%] md:w-[36%] md:ml-[32%]"
        onSubmit={handleSubmit}
      >
        <section className="flex flex-col">
          <label htmlFor="title" className="mt-2.5 text-start">
            Url (For multiple websites use the format "url1; url2; url3")
          </label>
          <input
            className="p-2 md:p-3 w-[100%] border-[#2f2e41] border-2 rounded-lg mt-2.5 mb-2.5 text-base"
            id="url"
            type="text"
            name="url"
            placeholder="Enter the website url"
            required={true}
            value={formData.url}
            onChange={handleChange}
          />
        </section>

        <button
          className="text-white bg-[#0287BF] px-4 py-2 md:px-6 md:py-3 m-2 rounded-full font-semibold w-fit text-lg md:text-xl cursor-pointer"
          disabled={loading} // Disable the button when loading is true
        >
          {loading ? <Oval color="#FFFFFF" height={20} width={20} /> : "Submit"}
        </button>
      </form>

      {multipleWebsites.length > 0 && (
        <div className="mt-4">
          <label htmlFor="selectWebsite" className="block text-start">
            Select Website:
          </label>
          <select
            id="selectWebsite"
            name="selectWebsite"
            className="p-2 md:p-3 w-[100%] border-[#2f2e41] border-2 rounded-lg mt-2.5 mb-2.5 text-base"
            value={selectedWebsite}
            onChange={(e) => setSelectedWebsite(e.target.value)}
          >
            {multipleWebsites.map((website, index) => (
              <option key={index} value={website}>
                {website}
              </option>
            ))}
          </select>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-[100vh]">
          <Oval color="#0287BF" height={80} width={80} />
        </div>
      ) : (
        reportData && 
          <div className="mt-5" style={{ marginTop: '30px', marginBottom: '30px', marginLeft: '30px', marginRight: '30px' }} dangerouslySetInnerHTML={{ __html: reportData }} />
      )}
    </div>
  );
}
