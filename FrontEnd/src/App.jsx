import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { NavBar, ComplaintForm, TrackApplication, Footer, Login, CitizenshipDetails, AllServices, Home, GovernmentNotices } from "./Components/index"
import SideBar from "./Components/Dashboard/Sidebar/SideBar";
import PostNotice from "./Components/Dashboard/Pages/PostNotice/PostNotice";
import Dashboard from "./Components/Dashboard/Pages/Dashboard/Dashboard";

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <NavBar />}
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/services" element={<AllServices />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/track-Application" element={<TrackApplication />}></Route>
        <Route path="/complaints" element={<ComplaintForm />}></Route>
        <Route path="/government-notice" element={<GovernmentNotices />}></Route>
        <Route path="/profile" element={<>profile</>}></Route>
        <Route path="/form" element={<CitizenshipDetails />}></Route>

        <Route path="/admin" element={<SideBar />}>
          <Route index element={<Dashboard />} />
          <Route path="applications" element={<div className="p-10 text-2xl font-semibold text-gray-700">Applications</div>} />
          <Route path="approve" element={<div className="p-10 text-2xl font-semibold text-gray-700">Approve / Reject</div>} />
          <Route path="post-notice" element={<PostNotice />} />
        </Route>
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
