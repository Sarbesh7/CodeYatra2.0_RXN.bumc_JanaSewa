import React from 'react'
import { NavLink } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import "../../Styles/Footer.css";



function Footer() {
    const { t } = useLanguage();
    
    return (

        <div className=' bottom-0 w-full '>
            <footer className="footer">
                <div className="footer-container Container">
                    <div className='info'>
                        <p className="footer-heads">
                            <h2>{t.footerBrand}</h2>
                        </p>
                        <p>{t.footerTagline}</p>
                    </div>
                    <div className='quick-links'>
                        <p className="footer-heads">
                            <h2>{t.quickLinks}</h2>
                        </p>
                        <ul>
                            <li><NavLink to="/">{t.home}</NavLink></li>
                            <li><NavLink to="/complaints">{t.fileAComplaint}</NavLink></li>
                            <li><NavLink to="/ContactUs">{t.contactUs}</NavLink></li>
                        </ul>
                    </div>
                    <div className='contact'>
                        <p className="footer-heads">
                            <h2>{t.contactUs}</h2>
                        </p>
                        <ul>
                            <li>
                                <a
                                    href="mailto:info@janasewa.com"
                                    target="_blank"
                                >
                                    {t.email}: info@janasewa.com
                                </a>
                            </li>
                            <li><a href="tel:+911234567890">{t.phone}: +977 12345 67890</a></li>
                        </ul>
                    </div>
                </div>
                <hr className='text-green-50' />
                <div className="footer-copyright">
                    <p className="copyright">{t.copyright}</p>
                </div>
            </footer>
        </div>
    )
}

export default Footer