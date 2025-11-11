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
        setBookingId(result.trackingId || trackingId || '');

        const MySwal = withReactContent(Swal);
        await MySwal.fire({
          title: 'Booking Successful',
          html: `<p class="text-left">Tracking ID: <strong>${trackingId}</strong><br/>Estimated Cost: <strong>₦${estimatedCost}</strong></p>`,
          icon: 'success',
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700',
          },
        });

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
        setSuccessMessage(`Booking successful! Tracking ID: ${trackingId}`);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50 to-orange-50 py-12 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-full bg-[#1e3a8a] flex items-center justify-center shadow-lg">
              <Truck className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Book a Shipment
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Seamlessly book your shipment with EagleNet Nigeria Logistics
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-teal-50 border-l-4 border-teal-500 rounded-lg p-4 mb-8 flex items-start gap-3 animate-fade-in">
            <CheckCircle className="w-6 h-6 text-teal-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-teal-700 font-semibold">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Form Error */}
        {errors.form && (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mb-8 flex items-start gap-3 animate-fade-in">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 font-semibold">{errors.form}</p>
          </div>
        )}

        {/* Main Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Section 1: Sender Information */}
            <div>
              <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-[#1e3a8a]">
                <User className="w-6 h-6 text-[#1e3a8a]" />
                <h2 className="text-2xl font-bold text-gray-900">Sender Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="customerName">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="customerName"
                    name="customerName"
                    placeholder="Your full name"
                    value={formData.customerName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200 ${
                      errors.customerName ? "border-red-500 focus:ring-red-500" : "border-gray-200"
                    } bg-gray-50 text-gray-900 placeholder-gray-400`}
                    aria-required="true"
                    aria-invalid={!!errors.customerName}
                    aria-describedby={errors.customerName ? "customerName-error" : undefined}
                  />
                  {errors.customerName && (
                    <p id="customerName-error" className="text-red-600 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.customerName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="email">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200 ${
                      errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-200"
                    } bg-gray-50 text-gray-900 placeholder-gray-400`}
                    aria-required="true"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                  {errors.email && (
                    <p id="email-error" className="text-red-600 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.email}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="phone">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="+234 801 234 5678"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200 ${
                      errors.phone ? "border-red-500 focus:ring-red-500" : "border-gray-200"
                    } bg-gray-50 text-gray-900 placeholder-gray-400`}
                    aria-required="true"
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? "phone-error" : undefined}
                  />
                  {errors.phone && (
                    <p id="phone-error" className="text-red-600 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 2: Pickup Details */}
            <div>
              <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-[#1e3a8a]">
                <MapPin className="w-6 h-6 text-[#1e3a8a]" />
                <h2 className="text-2xl font-bold text-gray-900">Pickup Details</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="pickupAddress">
                    Pickup Address *
                  </label>
                  <textarea
                    id="pickupAddress"
                    name="pickupAddress"
                    placeholder="Enter full pickup address"
                    value={formData.pickupAddress}
                    onChange={handleChange}
                    rows="3"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200 ${
                      errors.pickupAddress ? "border-red-500 focus:ring-red-500" : "border-gray-200"
                    } bg-gray-50 text-gray-900 placeholder-gray-400`}
                    aria-required="true"
                    aria-invalid={!!errors.pickupAddress}
                    aria-describedby={errors.pickupAddress ? "pickupAddress-error" : undefined}
                  />
                  {errors.pickupAddress && (
                    <p id="pickupAddress-error" className="text-red-600 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.pickupAddress}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="pickupCity">
                    Pickup City *
                  </label>
                  <select
                    id="pickupCity"
                    name="pickupCity"
                    value={formData.pickupCity}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200 ${
                      errors.pickupCity ? "border-red-500 focus:ring-red-500" : "border-gray-200"
                    } bg-gray-50 text-gray-900`}
                    aria-required="true"
                    aria-invalid={!!errors.pickupCity}
                    aria-describedby={errors.pickupCity ? "pickupCity-error" : undefined}
                  >
                    <option value="">Select pickup city</option>
                    {nigerianCities.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                  {errors.pickupCity && (
                    <p id="pickupCity-error" className="text-red-600 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.pickupCity}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 3: Delivery Details */}
            <div>
              <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-[#1e3a8a]">
                <Truck className="w-6 h-6 text-[#1e3a8a]" />
                <h2 className="text-2xl font-bold text-gray-900">Delivery Details</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="destination">
                    Delivery Address *
                  </label>
                  <textarea
                    id="destination"
                    name="destination"
                    placeholder="Enter full delivery address"
                    value={formData.destination}
                    onChange={handleChange}
                    rows="3"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200 ${
                      errors.destination ? "border-red-500 focus:ring-red-500" : "border-gray-200"
                    } bg-gray-50 text-gray-900 placeholder-gray-400`}
                    aria-required="true"
                    aria-invalid={!!errors.destination}
                    aria-describedby={errors.destination ? "destination-error" : undefined}
                  />
                  {errors.destination && (
                    <p id="destination-error" className="text-red-600 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.destination}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="destinationCity">
                    Destination City *
                  </label>
                  <select
                    id="destinationCity"
                    name="destinationCity"
                    value={formData.destinationCity}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200 ${
                      errors.destinationCity ? "border-red-500 focus:ring-red-500" : "border-gray-200"
                    } bg-gray-50 text-gray-900`}
                    aria-required="true"
                    aria-invalid={!!errors.destinationCity}
                    aria-describedby={errors.destinationCity ? "destinationCity-error" : undefined}
                  >
                    <option value="">Select destination city</option>
                    {nigerianCities.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                  {errors.destinationCity && (
                    <p id="destinationCity-error" className="text-red-600 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.destinationCity}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 4: Package Details */}
            <div>
              <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-[#1e3a8a]">
                <Package className="w-6 h-6 text-[#1e3a8a]" />
                <h2 className="text-2xl font-bold text-gray-900">Package Details</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="packageType">
                    Package Type *
                  </label>
                  <select
                    id="packageType"
                    name="packageType"
                    value={formData.packageType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200 border-gray-200 bg-gray-50 text-gray-900"
                    aria-required="true"
                  >
                    {packageTypes.map((type) => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="packageWeight">
                    Package Weight (kg) *
                  </label>
                  <input
                    type="number"
                    id="packageWeight"
                    name="packageWeight"
                    placeholder="0.00"
                    min="0.1"
                    step="0.1"
                    value={formData.packageWeight}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200 ${
                      errors.packageWeight ? "border-red-500 focus:ring-red-500" : "border-gray-200"
                    } bg-gray-50 text-gray-900 placeholder-gray-400`}
                    aria-required="true"
                    aria-invalid={!!errors.packageWeight}
                    aria-describedby={errors.packageWeight ? "packageWeight-error" : undefined}
                  />
                  {errors.packageWeight && (
                    <p id="packageWeight-error" className="text-red-600 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.packageWeight}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="packageDetails">
                  Package Description *
                  </label>
                <textarea
                  id="packageDetails"
                  name="packageDetails"
                  placeholder="Describe what you're shipping..."
                  value={formData.packageDetails}
                  onChange={handleChange}
                  rows="4"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200 ${
                    errors.packageDetails ? "border-red-500 focus:ring-red-500" : "border-gray-200"
                  } bg-gray-50 text-gray-900 placeholder-gray-400`}
                  aria-required="true"
                  aria-invalid={!!errors.packageDetails}
                  aria-describedby={errors.packageDetails ? "packageDetails-error" : undefined}
                />
                {errors.packageDetails && (
                  <p id="packageDetails-error" className="text-red-600 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.packageDetails}
                  </p>
                )}
              </div>
            </div>

            {/* Section 5: Scheduling */}
            <div>
              <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-[#1e3a8a]">
                <Calendar className="w-6 h-6 text-[#1e3a8a]" />
                <h2 className="text-2xl font-bold text-gray-900">Scheduling</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="date">
                    Preferred Pickup Date *
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200 ${
                      errors.date ? "border-red-500 focus:ring-red-500" : "border-gray-200"
                    } bg-gray-50 text-gray-900`}
                    aria-required="true"
                    aria-invalid={!!errors.date}
                    aria-describedby={errors.date ? "date-error" : undefined}
                  />
                  {errors.date && (
                    <p id="date-error" className="text-red-600 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.date}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="preferredTime">
                    Preferred Pickup Time
                  </label>
                  <select
                    id="preferredTime"
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200 border-gray-200 bg-gray-50 text-gray-900"
                  >
                    <option value="">Anytime</option>
                    <option value="morning">Morning (7:00 AM - 12:00 PM)</option>
                    <option value="afternoon">Afternoon (12:00 PM - 5:00 PM)</option>
                    <option value="evening">Evening (5:00 PM - 8:00 PM)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 6: Additional Information */}
            <div>
              <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-[#1e3a8a]">
                <FileText className="w-6 h-6 text-[#1e3a8a]" />
                <h2 className="text-2xl font-bold text-gray-900">Additional Information</h2>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="specialRequirements">
                  Special Requirements (Optional)
                </label>
                <textarea
                  id="specialRequirements"
                  name="specialRequirements"
                  placeholder="Any special handling instructions?"
                  value={formData.specialRequirements}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200 border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Pricing Info */}
            {formData.packageWeight && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-semibold">Estimated Shipping Cost:</span>
                  <span className="text-2xl font-bold text-orange-600">
                    ₦{(parseFloat(formData.packageWeight) * 150).toFixed(2)}
                  </span>
                </div>
                <p className="text-gray-600 text-xs mt-2">
                  *Pricing is ₦150 per kg. Final cost may vary based on distance and additional services.
                </p>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#1e3a8a] hover:bg-[#1e40af] text-white font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
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
                type="button"
                onClick={handleReset}
                disabled={loading}
                className="px-6 py-3 border border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 shadow-sm"
              >
                Clear Form
              </button>
            </div>
          </form>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Need Help?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-4 bg-teal-50 rounded-lg">
              <p className="text-teal-600 font-semibold mb-2">📞 Call Us</p>
              <p className="text-gray-700">+234 (0) 700 123 4567</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-purple-600 font-semibold mb-2">📧 Email Us</p>
              <p className="text-gray-700">support@eaglenet.com</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <p className="text-orange-600 font-semibold mb-2">💬 Chat Support</p>
              <p className="text-gray-700">Available 8 AM - 8 PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}