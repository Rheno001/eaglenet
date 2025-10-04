import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen bg-gray-50 py-20 px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We’d love to hear from you. Whether you have a question about
            services, tracking, or anything else, our team is ready to help.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white shadow-lg rounded-2xl p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Send us a message
            </h2>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Your Name
                </label>
                <input
                  type="text"
                  className="w-full mt-2 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gray-900 focus:ring-2 focus:ring-gray-900/20 outline-none transition"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Your Email
                </label>
                <input
                  type="email"
                  className="w-full mt-2 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gray-900 focus:ring-2 focus:ring-gray-900/20 outline-none transition"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  rows="5"
                  className="w-full mt-2 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gray-900 focus:ring-2 focus:ring-gray-900/20 outline-none transition resize-none"
                  placeholder="Write your message..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col justify-center space-y-8">
            <div className="flex items-start space-x-4">
              <MapPin className="h-6 w-6 text-gray-900" />
              <div>
                <h3 className="font-semibold text-gray-900">Our Office</h3>
                <p className="text-gray-600">
                  123 Logistics Avenue,
                  <br />
                  Abuja, Nigeria
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Phone className="h-6 w-6 text-gray-900" />
              <div>
                <h3 className="font-semibold text-gray-900">Call Us</h3>
                <p className="text-gray-600">+234 800 123 4567</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Mail className="h-6 w-6 text-gray-900" />
              <div>
                <h3 className="font-semibold text-gray-900">Email Us</h3>
                <p className="text-gray-600">support@eaglenet.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
