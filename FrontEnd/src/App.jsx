import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  NavBar,
  ComplaintForm,
  TrackApplication,
  Footer,
  Login,
  CitizenshipDetails,
  AllServices,
  Home,
  GovernmentNotices,
} from "./Components/index";

import Personaldetails from "./Components/Profile/Personal-Details/personaldetails";

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/services" element={<AllServices />}></Route>
        <Route path="/track-Application" element={<TrackApplication />}></Route>
        <Route path="/complaints" element={<ComplaintForm />}></Route>
        <Route
          path="/government-notice"
          element={<GovernmentNotices />}
        ></Route>

        <Route path="Books">
          <Route index element={<>Books</>} />
          <Route path="Buy" element={<>Buy Books</>} />
          <Route path="Sell" element={<>Sell Books</>} />
        </Route>

        <Route path="profile">
          <Route index element={<>Profile</>} />
          <Route path="PersonalDetails" element={<Personaldetails/>} />
        </Route>
        <Route path="/form" element={<CitizenshipDetails />}></Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
