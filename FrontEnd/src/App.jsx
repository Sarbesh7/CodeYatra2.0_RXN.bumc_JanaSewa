import { BrowserRouter, Routes, Route } from "react-router-dom";
import {NavBar,ComplaintForm, TrackApplication, Footer,Login, CitizenshipDetails, AllServices, Home, GovernmentNotices} from "./Components/index"


function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/services" element={<AllServices/>}></Route> 
        <Route path="/track-Application" element={<TrackApplication/>}></Route>
        <Route path="/complaints" element={<ComplaintForm/>}></Route>
        <Route path="/government-notice" element={<GovernmentNotices/>}></Route>
        <Route path="/profile" element={<>profile</>}></Route>
        <Route path="/form" element={<CitizenshipDetails/>}></Route>
      </Routes>
      <Footer/>
    </BrowserRouter>
  );
}

export default App;
