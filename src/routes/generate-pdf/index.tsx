import { BlobProvider, PDFViewer } from "@react-pdf/renderer";
import { createFileRoute } from "@tanstack/react-router";
import StatementPdf from "./-components/PdfWork";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import ReactDOM from "react-dom";

export const Route = createFileRoute("/generate-pdf/")({
  component: () => {
    const generatePdf = async () => {
      console.log("Generating PDFs...");
      try {
        const pdfBlobs = await Promise.all(
          [2, 3, 4].map(() => generatePdfUrl())
        );
        await createAndDownloadZip(pdfBlobs);
        console.log("ZIP downloaded successfully.");
      } catch (error) {
        console.error("Error generating PDFs:", error);
      }
    };

    const generatePdfUrl = (): Promise<Blob> => {
      return new Promise((resolve, reject) => {
        const pdfElement = (
          <BlobProvider document={<StatementPdf />}>
            {({ blob, loading, error }) => {
              if (!loading && !error && blob) {
                resolve(blob);
              } else if (error) {
                reject(error);
              }
              return null;
            }}
          </BlobProvider>
        );
        ReactDOM.render(pdfElement, document.createElement("div"));
      });
    };

    async function createAndDownloadZip(pdfBlobs: Blob[]) {
      const zip = new JSZip();

      for (let i = 0; i < pdfBlobs.length; i++) {
        const blob = pdfBlobs[i];
        const agent_name = "Abhay Kumar";
        zip.file(`${agent_name}-${i}.pdf`, blob);
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, "statements.zip");
    }
    return (
      <div className="">
        <button onClick={generatePdf}>Generate pdf</button>
        <div>
          <PDFViewer width={1200} height={600}>
            <StatementPdf />
          </PDFViewer>
        </div>
      </div>
    );
  },
});
