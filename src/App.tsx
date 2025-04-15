import { Routes, Route } from "react-router-dom";
import TestMui from "./components/Card/TestMui"
import RouterAdmin from "./routes/admin"
import RouterClient from "./routes/client"

function App() {
  
  return <>
      <RouterAdmin/>
      <RouterClient/>

      <Routes>
      <Route path="/test" element={<TestMui />} />
      </Routes>
  </>

}

export default App

