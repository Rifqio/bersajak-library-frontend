import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetcher } from "@/lib/fetcher";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useSwr } from "@/lib/swr";
import { Transition } from "@headlessui/react";
import { Button, Card, Progress } from "@/components";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { StartQuizDialog } from "@/sections/quiz/start-quiz-dialog";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

const BookViewerPage = () => {
  const { id } = useParams();
  const [page, setPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(0);
  const [pdfData, setPdfData] = useState(null);
  const [onErrorPage, setOnErrorPage] = useState(false);
  const [onStartQuiz, setOnStartQuiz] = useState(false);

  const { data, error, isLoading } = useSwr(
    `/book/read/${id}?page=${page}`,
    fetcher
  );

  const handleNext = () => {
    setPage((prevPage) => {
      const nextPage = prevPage + 1;
      if (nextPage === pageLimit) {
        setOnStartQuiz(true);
      }
      return nextPage;
    });
  };

  const handlePrevious = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  useEffect(() => {
    if (data) {
      setPdfData(data);
      setPageLimit(data?.pagination?.totalPages);
    }
  }, [data, onErrorPage]);

  const renderLoading = () => {
    return (
      <Transition
        show={isLoading}
        enter='transition-opacity duration-300'
        enterFrom='opacity-0'
        enterTo='opacity-100'
        leave='transition-opacity duration-300'
        leaveFrom='opacity-100'
        leaveTo='opacity-0'
      >
        <Progress />
      </Transition>
    );
  };

  const disabled = page === pageLimit;

  if (error) return <div>Failed to load PDF file.</div>;

  const onErrorSecondPage = () => {
    setOnErrorPage(true);
  };

  return (
    <div className='w-full h-fit flex flex-col items-center justify-center'>
      <Document
        onLoadError={onErrorSecondPage}
        loading={renderLoading()}
        className={`${onErrorPage ? "" : "flex"} text-center`}
        file={pdfData ? `data:application/pdf;base64,${pdfData.data}` : null}
      >
        <Page pageNumber={1} />
        {!onErrorPage && (
          <Page
            className={`${onErrorPage ? "hidden" : ""}`}
            onRenderError={onErrorSecondPage}
            error={onErrorPage}
            pageNumber={2}
          />
        )}
      </Document>
      <Card className='w-full flex flex-row justify-evenly h-10 rounded-t-md'>
        <Button disabled={page === 1} onClick={handlePrevious} variant='ghost'>
          <ChevronLeft />
        </Button>
        <Button disabled={disabled} onClick={handleNext} variant='ghost'>
          <ChevronRight />
        </Button>
      </Card>
      <StartQuizDialog open={onStartQuiz} onOpenChange={setOnStartQuiz} />
    </div>
  );
};

export default BookViewerPage;
