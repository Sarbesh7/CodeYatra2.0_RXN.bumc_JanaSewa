import React from 'react'
import { NavLink } from 'react-router-dom'
import "../../Styles/Footer.css";



function Footer() {
  return (
    <div>

        <footer className="footer">
            <div className="footer-container">
                <div className='info'>
                    <p className="footer-heads">
                        
                     <h2>Jana Sewa</h2>
                     </p>
                        <p>Empowering Citizens, Enhancing Governance</p>
                </div>

                <div className='quick-links'>
                     <p className="footer-heads">
                        <h2>Quick Links</h2>
                     </p>
                        <ul>
                            <li><NavLink to="/">Home</NavLink></li>
                            <li><NavLink to="/complaint">File a Complaint</NavLink></li>
                            <li><NavLink to="/contact">Contact Us</NavLink></li>
                        </ul>
                </div>

                <div className='contact'>
                    <p className="footer-heads">
                     <h2>Contact Us</h2>
                        
                     </p>
                        <ul>
                            <li>Email: info@janasewa.gov.in</li>
                            <li>Phone: +91 12345 67890</li>
                            <li>Address: 123 Main Street, City, Country</li>
                        </ul>
                </div>


                 </div>

                <hr />
                <div className="footer-copyright">

                <p className="copyright">© 2024 Jana Sewa. All rights reserved.</p>
                </div>



               
        

        </footer>













    </div>
  )
}

export default Footer