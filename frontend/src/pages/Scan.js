import React, { useState } from "react";
import { useCookies } from "react-cookie";
// import { useNavigate } from "react-router-dom";
import { Oval } from "react-loader-spinner";
// import { api } from "../api";
import Report from "./ViewReport"

export default function Scan(){
    const [cookies, setCookie, removeCookie] = useCookies();
    const [loading, setLoading] = useState(false);
    const [reportData, setReportData] = useState(null); 
    // const navigate = useNavigate();


    const [formData, setFormData] = useState({
        username: cookies.UserId,
        url: "",
      });


        const handleSubmit = async (e) => {
        e.preventDefault();
 
        // console.log(formData)
       
        try {
          setLoading(true);
    
          const res=await fetch('http://localhost:8000/scan', {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              url : formData.url
            })
          });
          const data = await res.json();
          console.log("this is the received data")
          console.log(data);
          setReportData(data);

          setLoading(false);

        } catch (e) {
          console.log(e.response.message);
        }
      };
      const handleChange = (e) => {
        const value = e.target.value;
        const name = e.target.name;
        setFormData((prev) => {
          return { ...prev, [name]: value };
        });
      };

      // console.log(formData);
      if (loading) {
        return (
          <div className="flex justify-center items-center h-[100vh]">
            <Oval color="#0287BF" height={80} width={80} />
          </div>
        );
      }


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
                Url
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
    
            <button className="text-white bg-[#0287BF] px-4 py-2 md:px-6 md:py-3 m-2 rounded-full font-semibold w-fit text-lg md:text-xl cursor-pointer">
              Submit
            </button>
          </form>
          
          {
          reportData && <Report reportData={reportData} />
          } {/* Render the Report component */}
        </div>
      );
    
}