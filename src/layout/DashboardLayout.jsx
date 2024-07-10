import { Container } from "@/components";
import ColorblindPicker from "@/components/colorblind";
import { Navbar } from "@/sections";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <Container>
      <Navbar />
      <Outlet />
      <ColorblindPicker />
    </Container>
  );
};

export default DashboardLayout;
