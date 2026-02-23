import React from 'react';

function ContactUs() {
    return (
        <div className="min-h-[80vh] bg-gray-50 py-8 w-full">
            <div className="max-w-6xl mx-auto px-4 md:px-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Contact Us</h2>
                    <p className="text-gray-600">We're here to help! Reach out with your questions or feedback.</p>
                </div>
                <div className="flex flex-col md:flex-row gap-8 justify-center">
                    <div className="bg-white rounded-lg shadow-md p-6 flex-1 mb-6 md:mb-0">
                        <h3 className="text-xl font-semibold text-blue-700 mb-4">Contact Information</h3>
                        <ul className="space-y-2 text-gray-700">
                            <li><span className="font-medium">Email:</span> info@janasewa.com</li>
                            <li><span className="font-medium">Phone:</span> +977 12345 67890</li>
                        </ul>
                    </div>
                    <form className="bg-white rounded-lg shadow-md p-6 flex-1">
                        <h3 className="text-xl font-semibold text-blue-700 mb-4">Send Us a Message</h3>
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-gray-700 mb-2">Name</label>
                            <input type="text" id="name" name="name" required placeholder="Your Name" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
                            <input type="email" id="email" name="email" required placeholder="Your Email" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200" />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="message" className="block text-gray-700 mb-2">Message</label>
                            <textarea id="message" name="message" rows="4" required placeholder="Your Message" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"></textarea>
                        </div>
                        <button type="submit" className="bg-blue-700 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-800 transition">Send</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ContactUs;