import React from 'react'
import { NavLink } from 'react-router-dom'
import "../../Styles/Footer.css";



function Footer() {
    return (

        <div className=' bottom-0 w-full '>
            <footer className="footer">
                <div className="footer-container Container">
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
                            <li><NavLink to="/complaints">File a Complaint</NavLink></li>
                            <li><NavLink to="/ContactUs">Contact Us</NavLink></li>
                        </ul>
                    </div>
                    <div className='contact'>
                        <p className="footer-heads">
                            <h2>Contact Us</h2>
                        </p>
                        <ul>
                            <li>
                                <a
                                    href="mailto:info@janasewa.com"
                                    target="_blank"
                                >
                                    Email: info@janasewa.com
                                </a>
                            </li>
                            <li><a href="tel:+911234567890">Phone: +977 12345 67890</a></li>
                        </ul>
                    </div>
                </div>
                <hr className='text-green-50' />
                <div className="footer-copyright">
                    <p className="copyright">© 2024 Jana Sewa. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}

export default Footer