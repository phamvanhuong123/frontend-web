import { Outlet } from "react-router-dom";
import Footer from "../Footer";
import Header from "../Header/";
import { useState } from "react";

function LayoutDefault() {
  const [value, setValue] = useState<string>("");
  return (
    <>
      <Header searchTerm="" setSearchTerm={() => {}} />
      <Outlet context={[value, setValue]} />
      <Footer />
    </>
  );
}
export default LayoutDefault;
