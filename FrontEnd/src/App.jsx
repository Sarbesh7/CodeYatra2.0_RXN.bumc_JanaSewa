import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import NavBar from './Components/NavBar/NavBar'

function App()  {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<></>} />

        {/* books/sell and books/buy */}
        <Route path="Books" >
          <Route index element={<>Books</>} />
          <Route path="Buy" element={<>Buy Books</>} />
          <Route path="Sell" element={<>Sell Books</>} />
        </Route>

         <Route path="Profile" >
          <Route index element={<>Profile</>} />
          <Route path=":id" element={<>data</>} />

        </Route>
      </Routes>

    </Router>
    
  )
}

export default App
