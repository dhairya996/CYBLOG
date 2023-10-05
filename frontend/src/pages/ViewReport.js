import React from "react";

const Report = ({ reportData }) => {
  {console.log(reportData)}

  return (
  
    <div className="mt-8 p-4 border border-[#0287BF] rounded-lg">
      <h3 className="text-xl font-bold text-[#0287BF] mb-4">Report</h3>
      {

        reportData.Alerts.map((alert, index) => (
        <div key={index} className="mb-4">
          <h4 className="text-lg font-semibold mb-2">{alert.title}</h4>
          <p>{alert.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Report;
