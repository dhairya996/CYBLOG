import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { Oval } from "react-loader-spinner";
import Report from "./ViewReport";
import HeroSection from './HeroSection.js'
import Footer from './Footer.js'

export default function Scan() {
  const [cookies] = useCookies();
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [htmlReport, sethtmlReport] = useState(null);
  const [jsonReport, setjsonReport] = useState(null);
  const [formData, setFormData] = useState({
    username: cookies.UserId,
    url: "",
  });
  const [multipleWebsites, setMultipleWebsites] = useState([]);
  const [selectedWebsite, setSelectedWebsite] = useState(null);
  const [cachedReports, setCachedReports] = useState({});

  const [showForm, setShowForm] = useState(true);

  const handleBackClick = () => {
    window.location.reload(); // Reload the page
    setShowForm(true);
  };

  const [htmlContent, setHtmlContent] = useState(""); // Assuming you have a way to set the HTML content

  const generateTextContent = () => {
    try {
      const parsedJsonReport = JSON.parse(jsonReport);

      if (
        parsedJsonReport &&
        parsedJsonReport.site &&
        Array.isArray(parsedJsonReport.site)
      ) {
        const formattedEvidenceArray = parsedJsonReport.site.flatMap((site) =>
          site.alerts.flatMap((alert) =>
            alert.instances.map((instance) => ({
              // siteName: site["@name"],
              siteName: instance.uri,
              alertName: alert.alert,
              evidence: instance.evidence && instance.evidence.trim(),
            }))
          )
        );

        // Filter out entries with undefined or empty evidence
        const filteredEvidenceArray = formattedEvidenceArray.filter(
          (entry) => entry.evidence
        );

        // Create a formatted presentation
        const presentation = filteredEvidenceArray
          .map(
            (entry) =>
              `${entry.siteName} - ${entry.alertName}:\n${entry.evidence}`
          )
          .join("\n\n"); // Add a double newline between different pieces of evidence

        return presentation || "No evidence available.";
      } else {
        // Handle the case when jsonReport, jsonReport.site, or jsonReport.site is not an array
        return "No evidence available.";
      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return "Error parsing JSON.";
    }
  };

  // Call the function and log the result
  console.log(generateTextContent());

  // Call the function and log the result
  console.log(generateTextContent());

  // Function to handle the click event of the "Download as Text" button
  const downloadAsText = () => {
    const content = generateTextContent();
    console.log(content);
    const blob = new Blob([content], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "download.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  const generatePDF = async () => {
    const response = await fetch("http://localhost:8000/generate-pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reportData }),
    });

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "download.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

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
          const data = await res.json();
          console.log(data);
          // console.log(data.html_report);
          console.log(data.json_report);
          sethtmlReport(data.html_report);
          setjsonReport(data.json_report);
          console.log(jsonReport);
          setReportData(data.html_report);
          // console.log(reportData);
          // Cache the report data
          setCachedReports((prev) => ({
            ...prev,
            [url]: data,
          }));
        }
      }

      setShowForm(false);
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

            const data = await res.json();
            // console.log(data.html_report);
            console.log(data.json_report);
            sethtmlReport(data.html_report);
            setjsonReport(data.jsonReport);
            setReportData(data.html_report);

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
    <>
    <HeroSection />
    <div className="onboarding bg-[#E1E9F4] bg-opacity-70">
    <h2 className="text-3xl md:text-4xl font-semibold text-[#2f2e41] text-center pt-8 pb-5">
      Scan Website
    </h2>
      {showForm ? (
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
            className="text-white bg-[#0287BF] px-4 py-2 md:px-6 md:py-3 m-2 rounded-full font-semibold w-fit text-lg md:text-xl cursor-pointer block mx-auto"
            disabled={loading} // Disable the button when loading is true
          >
            {loading ? (
              <Oval color="#FFFFFF" height={20} width={20} />
            ) : (
              "Submit"
            )}
          </button>
        </form>
      ) : (
        <button
          className="text-[#0287BF] px-4 py-2 absolute top-5 left-5"
          onClick={handleBackClick}
        >
          Back
        </button>
      )}

      {!showForm && multipleWebsites.length > 0 && (
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
        !showForm && (
          <div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "20vh",
              }}
            >
              {/* Your React component that displays the HTML content */}
              <button
                style={{
                  padding: "10px 20px",
                  fontSize: "16px",
                  backgroundColor: "#007bff",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
                onClick={generatePDF}
              >
                Download as PDF
              </button>
              <div className="mt-5">
                <button
                  style={{
                    padding: "10px 20px",
                    fontSize: "16px",
                    backgroundColor: "#28a745",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                  onClick={downloadAsText}
                >
                  Download as Text
                </button>
              </div>
              <div className="mt-5">
                <button
                  style={{
                    padding: "10px 20px",
                    fontSize: "16px",
                    backgroundColor: "#dc3545",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    window.open(
                      "https://realtime-fronted.vercel.app/",
                      "_blank"
                    )
                  }
                >
                  Edit in Real-Time Editor
                </button>
              </div>
            </div>
            <div
              className="mt-5"
              style={{
                marginTop: "10px",
                marginBottom: "30px",
                marginLeft: "30px",
                marginRight: "30px",
              }}
              dangerouslySetInnerHTML={{ __html: reportData }}
            />
          </div>
        )
      )}
    </div>
    <Footer />
    </>
  );
}
