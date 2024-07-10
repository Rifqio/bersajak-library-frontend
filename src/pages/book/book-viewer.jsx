import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetcher } from "@/lib/fetcher";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useSwr } from "@/lib/swr";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
const BookViewerPage = () => {
  const { id } = useParams();
  const [page, setPage] = useState(1);
  const [pdfData, setPdfData] = useState("");

  const { data, error } = useSwr(`/book/read/${id}?page=${page}`, fetcher);

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
    <div className="flex space-x-4 text-center overflow-x-auto">
      {page > 1 && <button onClick={handlePrevious}>Previous</button>}
      <Document
        className="flex"
        file={`data:application/pdf;base64,${pdfData.data}`}
      >
        <Page pageNumber={1} />
        <Page pageNumber={2} />
      </Document>
      {pdfData.pagination.currentPage <= pdfData.pagination.totalPages && (
        <button onClick={handleNext}>Next</button>
      )}
    </div>
  );
};

export default BookViewerPage;
