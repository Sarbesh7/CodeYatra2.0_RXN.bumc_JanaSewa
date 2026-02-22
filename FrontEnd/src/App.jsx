import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import NavBar from './Components/NavBar/NavBar'
import Home from './Components/home/Home'

function App()  {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home/>} />
         <Route path="Profile" >
          <Route index element={<>Profile</>} />
          <Route path=":id" element={<>data</>} />

        </Route>
      </Routes>

    </Router>
    
  )
}

export default App
