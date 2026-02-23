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
  ApplyForm,
  AdminDashboard,
  AdminApplications,
  AdminServices,
  ContactUs,
  TemplateEditor
} from "./Components/index";

import Personaldetails from "./Components/Profile/Personal-Details/Personaldetails";
import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <BrowserRouter>
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<AllServices />} />
            <Route path="/login" element={<Login />} />
            <Route path="/track-Application" element={<TrackApplication />} />
            <Route path="/complaints" element={<ComplaintForm />} />
            <Route path="/government-notice" element={<GovernmentNotices />} />
            <Route path="/apply/:serviceId" element={<ApplyForm />} />
            <Route path="/form" element={<CitizenshipDetails />} />
            <Route path="/template-editor" element={<TemplateEditor />} />
            <Route path="/template" element={<TemplateEditor />} />
            <Route path="profile">
              <Route index element={<>Profile</>} />
              <Route path="PersonalDetails" element={<Personaldetails />} />
            </Route>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/applications" element={<AdminApplications />} />
            <Route path="/admin/services" element={<AdminServices />} />

            <Route path="/ContactUs" element={<ContactUs />} />

            <Route path="*" element={<div className="not-found">Page Not Found</div>} />

          </Routes>
          <Footer />
        </BrowserRouter>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
