import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import NavBar from './Components/NavBar/NavBar'
import Home from './Components/home/Home'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./Components/NavBar/NavBar";
import Login from "./Components/Login";

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<>Home</>}></Route>
        <Route path="/services" element={<>services</>}></Route>
        <Route path="/track-Application" element={<>track</>}></Route>
        <Route path="/complaints" element={<>complaints</>}></Route>
        <Route path="/government-notice" element={<>government notice</>}></Route>
        <Route path="/profile" element={<>profile</>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
