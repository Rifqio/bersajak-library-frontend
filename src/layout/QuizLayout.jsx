import { Button, Container } from "@/components";
import { Outlet } from "react-router-dom";

const QuizLayout = () => {
  return (
    <Container className="bg-quiz-background">
      <Outlet />
    </Container>
  );
};

export default QuizLayout;
