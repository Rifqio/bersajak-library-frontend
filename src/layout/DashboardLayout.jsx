import { Container } from "@/components";
import ColorblindPicker from "@/components/colorblind";
import { ErrorModal } from "@/components/error-modal";
import { Navbar } from "@/sections";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <Container>
      <Navbar />
      <Outlet />
      <ColorblindPicker />
      <ErrorModal />
    </Container>
  );
};

export default DashboardLayout;
