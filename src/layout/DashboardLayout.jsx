import { Container } from "@/components";
import { Navbar } from "@/sections";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <Container>
      <Navbar />
      <Outlet />
    </Container>
  );
};

export default DashboardLayout;
