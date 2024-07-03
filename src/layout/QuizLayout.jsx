import { Container } from "@/components";
import { Outlet } from "react-router-dom";

const QuizLayout = () => {
  return (
    <Container className="bg-[#932C6B]">
      <Outlet />
    </Container>
  );
};

export default QuizLayout;
