import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import fetcher from "@/lib/fetcher";
import useSWR from "swr";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
const BookViewerPage = () => {
  const { id } = useParams();
  const [page, setPage] = useState(1);
  const [pdfData, setPdfData] = useState("");

  const { data, error } = useSWR(`/book/${id}?page=${page}`, fetcher, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  useEffect(() => {
    if (data) {
      setPdfData(data);
    }
  }, [data]);

  const handleNext = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handlePrevious = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  if (error) return <div>Failed to load PDF file.</div>;
  if (!pdfData) return <div>Loading...</div>;

  return (
    <div className="flex space-x-4 overflow-x-auto">
      <Document
        className="flex"
        file={`data:application/pdf;base64,${pdfData}`}
      >
        <Page pageNumber={1} />
        <Page pageNumber={2} />
      </Document>
      {page > 1 && (
        <button
          onClick={handlePrevious}
          className="mx-2 px-4 py-2 bg-gray-200 hover:bg-gray-300"
        >
          Previous
        </button>
      )}
      <button onClick={handleNext}>Next</button>
    </div>
  );
};

export default BookViewerPage;
