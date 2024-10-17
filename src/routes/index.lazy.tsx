import { createLazyFileRoute } from "@tanstack/react-router";
import axios from "axios";
import { useState } from "react";
import Clendly from "../components/FaceRecogantioni/Clendly";

export const Route = createLazyFileRoute("/")({
  component: () => {
    return <HomeIndex />;
  },
});

const HomeIndex = () => {
  const [csvData, setCsvData] = useState("");

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const pdfData = await file.arrayBuffer();
    const response = await axios.post("http://localhost:3001/convert", {
      pdfData,
    });

    // console.log("response", response);
    setCsvData(response.data);
  };

  return (
    <div className="p-2">
      <div className="App">
        <input type="file" accept=".pdf" onChange={handleFileUpload} />
        <pre>{csvData}</pre>
      </div>
      {/* <ClerkComponent/> */}
      <h3>Welcome Home!</h3>
      {/* <WebcamDemo /> */}

      <Clendly />
    </div>
  );
};
