import React, { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Package, MapPin, Calendar, User, FileText, Truck, CheckCircle, AlertCircle, X } from "lucide-react";

export default function Booking() {
  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phone: "",
    pickupAddress: "",
    pickupCity: "",
    destination: "",
    destinationCity: "",
    packageWeight: "",
    packageType: "general",
    packageDetails: "",
    date: "",
    preferredTime: "",
    specialRequirements: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [bookingId, setBookingId] = useState("");

  // Generate a short unique tracking ID: EGL-XXXX-YYMMDD
  const generateTrackingId = () => {
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    const d = new Date();
    const y = String(d.getFullYear()).slice(-2);
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `EGL-${rand}-${y}${m}${day}`;
  };

  const packageTypes = [
    { value: "general", label: "General Goods" },
    { value: "fragile", label: "Fragile Items" },
    { value: "perishable", label: "Perishable Items" },
    { value: "documents", label: "Documents" },
    { value: "electronics", label: "Electronics" },
  ];

  const nigerianCities = [
    "Abuja", "Lagos", "Kano", "Ibadan", "Port Harcourt",
    "Benin City", "Kaduna", "Enugu", "Owerri", "Ilorin",
    "Abeokuta", "Osogbo", "Akure", "Gusau", "Bauchi"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = "Customer name is required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (formData.phone.length < 10) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!formData.pickupAddress.trim()) {
      newErrors.pickupAddress = "Pickup address is required";
    }

    if (!formData.pickupCity) {
      newErrors.pickupCity = "Pickup city is required";
    }

    if (!formData.destination.trim()) {
      newErrors.destination = "Delivery address is required";
    }

    if (!formData.destinationCity) {
      newErrors.destinationCity = "Destination city is required";
    }

    if (!formData.packageWeight || formData.packageWeight <= 0) {
      newErrors.packageWeight = "Package weight is required";
    }

    if (!formData.packageDetails.trim()) {
      newErrors.packageDetails = "Package details are required";
    }

    if (!formData.date) {
      newErrors.date = "Pickup date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // generate tracking id and include in payload
      const trackingId = generateTrackingId();
      const payload = { ...formData, trackingId };

      const response = await fetch("http://localhost/backend/Booking.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(payload),
      });
      // Read raw text and log status for debugging server 500 / empty responses
      const text = await response.text();
      console.log('Booking.php HTTP status:', response.status, 'raw response length:', text ? text.length : 0);
      if (!text) {
        console.warn('Booking.php returned empty response body (null).');
        setErrors({ form: `Server returned empty response (status ${response.status}). Check server logs.` });
        setLoading(false);
        return;
      }

      let result;
      try {
        result = JSON.parse(text);
      } catch (parseErr) {
        console.error('Failed to parse JSON response:', parseErr, 'raw:', text);
        setErrors({ form: `Server error: ${text || response.statusText}` });
        setLoading(false);
        return;
      }

      console.log("Parsed response from Booking.php:", result);

      if (response.ok && result && result.status === "success") {
        const estimatedCost = (parseFloat(formData.packageWeight) * 150).toFixed(2);

        // bookingId already sent to backend and generated before sending
        // but keep state for UI
        setBookingId(result.trackingId || trackingId || '');

        // SweetAlert confirmation
        const MySwal = withReactContent(Swal);
        await MySwal.fire({
          title: 'Booking successful',
          html: `<p class="text-left">Tracking ID: <strong>${trackingId}</strong><br/>Estimated Cost: <strong>₦${estimatedCost}</strong></p>`,
          icon: 'success',
          confirmButtonText: 'OK',
        });

        // reset the form after user confirms
        setFormData({
          customerName: "",
          email: "",
          phone: "",
          pickupAddress: "",
          pickupCity: "",
          destination: "",
          destinationCity: "",
          packageWeight: "",
          packageType: "general",
          packageDetails: "",
          date: "",
          preferredTime: "",
          specialRequirements: "",
        });

      } else {
        const msg = result && result.message ? result.message : `Server responded with status ${response.status}`;
        setErrors({ form: msg });
      }
    } catch (error) {
      console.error("Error:", error);
      setErrors({ form: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      customerName: "",
      email: "",
      phone: "",
      pickupAddress: "",
      pickupCity: "",
      destination: "",
      destinationCity: "",
      packageWeight: "",
      packageType: "general",
      packageDetails: "",
      date: "",
      preferredTime: "",
      specialRequirements: "",
    });
    setErrors({});
    setSuccessMessage("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Book a Shipment</h1>
          </div>
          <p className="text-gray-600 text-lg">Quick and easy shipping booking with EagleNet Nigeria Logistics</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4 mb-6 flex items-start gap-3 animate-slide-in">
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-green-700 font-semibold whitespace-pre-line">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Form Error */}
        {errors.form && (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 font-semibold">{errors.form}</p>
          </div>
        )}

        {/* Main Form */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <div className="space-y-8">
            {/* Section 1: Sender Information */}
            <div>
              <div className="flex items-center gap-2 mb-6 pb-3 border-b-2 border-blue-600">
                <User className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">Sender Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    placeholder="Your full name"
                    value={formData.customerName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                      errors.customerName
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.customerName && (
                    <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.customerName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                      errors.email
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+234 801 234 5678"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                      errors.phone
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 2: Pickup Details */}
            <div>
              <div className="flex items-center gap-2 mb-6 pb-3 border-b-2 border-blue-600">
                <MapPin className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">Pickup Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Pickup Address *
                  </label>
                  <textarea
                    name="pickupAddress"
                    placeholder="Enter full pickup address"
                    value={formData.pickupAddress}
                    onChange={handleChange}
                    rows="3"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                      errors.pickupAddress
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.pickupAddress && (
                    <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.pickupAddress}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Pickup City *
                  </label>
                  <select
                    name="pickupCity"
                    value={formData.pickupCity}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                      errors.pickupCity
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300"
                    }`}
                  >
                    <option value="">Select pickup city</option>
                    {nigerianCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                  {errors.pickupCity && (
                    <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.pickupCity}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 3: Delivery Details */}
            <div>
              <div className="flex items-center gap-2 mb-6 pb-3 border-b-2 border-blue-600">
                <Truck className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">Delivery Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Delivery Address *
                  </label>
                  <textarea
                    name="destination"
                    placeholder="Enter full delivery address"
                    value={formData.destination}
                    onChange={handleChange}
                    rows="3"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                      errors.destination
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.destination && (
                    <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.destination}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Destination City *
                  </label>
                  <select
                    name="destinationCity"
                    value={formData.destinationCity}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                      errors.destinationCity
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300"
                    }`}
                  >
                    <option value="">Select destination city</option>
                    {nigerianCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                  {errors.destinationCity && (
                    <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.destinationCity}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 4: Package Details */}
            <div>
              <div className="flex items-center gap-2 mb-6 pb-3 border-b-2 border-blue-600">
                <Package className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">Package Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Package Type *
                  </label>
                  <select
                    name="packageType"
                    value={formData.packageType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  >
                    {packageTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Package Weight (kg) *
                  </label>
                  <input
                    type="number"
                    name="packageWeight"
                    placeholder="0.00"
                    min="0.1"
                    step="0.1"
                    value={formData.packageWeight}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                      errors.packageWeight
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.packageWeight && (
                    <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.packageWeight}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Package Description *
                </label>
                <textarea
                  name="packageDetails"
                  placeholder="Describe what you're shipping..."
                  value={formData.packageDetails}
                  onChange={handleChange}
                  rows="4"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                    errors.packageDetails
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.packageDetails && (
                  <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.packageDetails}
                  </p>
                )}
              </div>
            </div>

            {/* Section 5: Scheduling */}
            <div>
              <div className="flex items-center gap-2 mb-6 pb-3 border-b-2 border-blue-600">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">Scheduling</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Preferred Pickup Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                      errors.date
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.date && (
                    <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.date}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Preferred Pickup Time
                  </label>
                  <select
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  >
                    <option value="">Anytime</option>
                    <option value="morning">Morning (7:00 AM - 12:00 PM)</option>
                    <option value="afternoon">Afternoon (12:00 PM - 5:00 PM)</option>
                    <option value="evening">Evening (5:00 PM - 8:00 PM)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 6: Additional Info */}
            <div>
              <div className="flex items-center gap-2 mb-6 pb-3 border-b-2 border-blue-600">
                <FileText className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">Additional Information</h2>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Special Requirements (Optional)
                </label>
                <textarea
                  name="specialRequirements"
                  placeholder="Any special handling instructions?"
                  value={formData.specialRequirements}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
            </div>

            {/* Pricing Info */}
            {formData.packageWeight && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-semibold">Estimated Shipping Cost:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    ₦{(parseFloat(formData.packageWeight) * 150).toFixed(2)}
                  </span>
                </div>
                <p className="text-gray-600 text-xs mt-2">*Pricing is ₦150 per kg. Final cost may vary based on distance and additional services.</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Complete Booking
                  </>
                )}
              </button>
              <button
                onClick={handleReset}
                disabled={loading}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
              >
                Clear Form
              </button>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Need Help?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-gray-600 font-semibold mb-2">📞 Call Us</p>
              <p className="text-gray-700">+234 (0) 700 123 4567</p>
            </div>
            <div>
              <p className="text-gray-600 font-semibold mb-2">📧 Email Us</p>
              <p className="text-gray-700">support@eaglenet.com</p>
            </div>
            <div>
              <p className="text-gray-600 font-semibold mb-2">💬 Chat Support</p>
              <p className="text-gray-700">Available 8 AM - 8 PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}