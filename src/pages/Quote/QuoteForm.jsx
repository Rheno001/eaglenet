import React, { useState } from "react";
import { MapPin, Box, CalendarDays, DollarSign } from "lucide-react";
import statesLgas from "../../data/states.json";
import { useJsApiLoader } from "@react-google-maps/api";

// Google Maps API configuration
const googleMapsConfig = {
  googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY, 
  libraries: ["places"], // Include required libraries (e.g., places for DistanceMatrixService)
};

// Rates (per km, per kg, per item)
const RATES = {
  interstate: { base: 5000, perKm: 2, perKg: 100, perItem: 150 },
};

// Formats number to NGN currency
const formatCurrency = (n) => new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
}).format(n);

export default function Quote() {
  // Load Google Maps API
  const { isLoaded, loadError } = useJsApiLoader(googleMapsConfig); // Hook to load Google Maps API

  const [step, setStep] = useState(1); // Tracks current step (1, 2, or 3)
  const [type, setType] = useState("interstate"); // Default shipment type
  const [form, setForm] = useState({ // Form state for inputs
    originState: "",
    destinationState: "",
    quantity: 1,
    weight: 0,
  });
  const [errors, setErrors] = useState({}); // Stores validation/api errors
  const [result, setResult] = useState(null); // Stores calculation result
  const [loading, setLoading] = useState(false); // Tracks loading state

  // Moves to next step after validation
  const next = () => {
    if (step === 1 && !type) { // Validates shipment type
      setErrors({ type: "Please select Interstate." });
      return;
    }
    setErrors({}); // Clears errors
    setStep((s) => Math.min(3, s + 1)); // Increments step, max 3
  };

  // Moves to previous step
  const back = () => setStep((s) => Math.max(1, s - 1)); // Decrements step, min 1

  // Handles form input changes
  const handleChange = ({ target: { name, value } }) => { // Destructures event.target
    setForm((f) => ({ ...f, [name]: value })); // Updates form state
  };

  // Validates form inputs
  const validateDetails = () => {
    const err = {};
    if (!form.originState.trim()) err.originState = "Origin is required."; // Checks origin
    if (!form.destinationState.trim()) err.destinationState = "Destination is required."; // Checks destination
    if (!form.quantity || Number(form.quantity) <= 0) err.quantity = "Quantity must be > 0"; // Checks quantity
    if (form.weight === "" || Number(form.weight) < 0) err.weight = "Weight must be >= 0"; // Checks weight
    return err;
  };

  // Calculates shipping cost using Google Maps API
  const calculate = async (e) => {
    e?.preventDefault(); // Prevents form submission reload
    const err = validateDetails(); // Validates inputs
    if (Object.keys(err).length) { // If errors, set and exit
      setErrors(err);
      return;
    }

    setErrors({}); // Clears errors
    setLoading(true); // Sets loading state

    if (!isLoaded) { // Checks if Google Maps API is loaded
      setErrors({ api: "Google Maps API not loaded yet." });
      setLoading(false);
      return;
    }

    if (loadError) { // Checks for API load errors
      setErrors({ api: "Failed to load Google Maps API." });
      setLoading(false);
      return;
    }

    try {
      const service = new window.google.maps.DistanceMatrixService(); // Creates DistanceMatrixService instance
      service.getDistanceMatrix(
        {
          origins: [form.originState], // Origin state from form
          destinations: [form.destinationState], // Destination state from form
          travelMode: window.google.maps.TravelMode.DRIVING, // Driving mode
          unitSystem: window.google.maps.UnitSystem.METRIC, // Metric units (km)
        },
        ({ rows }, status) => { // Callback with destructured response
          if (
            status !== "OK" ||
            !rows[0].elements[0] ||
            rows[0].elements[0].status !== "OK"
          ) { // Checks API response status
            setErrors({ api: "Could not calculate distance. Check locations." });
            setLoading(false);
            return;
          }

          const { distance: { value: distanceMeters } } = rows[0].elements[0]; // Destructures distance value
          const distanceKm = distanceMeters / 1000; // Converts meters to kilometers

          const { base, perKm, perKg, perItem } = RATES[type]; // Destructures rate values
          const qty = Math.max(1, Number(form.quantity)); // Ensures quantity >= 1
          const weight = Math.max(0, Number(form.weight)); // Ensures weight >= 0

          const distanceCost = distanceKm * perKm; // Calculates distance cost
          const weightCost = weight * perKg; // Calculates weight cost
          const itemCost = qty * perItem; // Calculates item cost
          const total = Math.round((base + distanceCost + weightCost + itemCost) * 100) / 100; // Total cost, rounded

          const eta = "3–7 business days"; // Static ETA

          setResult({ // Sets result with breakdown
            base,
            distanceKm,
            distanceCost,
            weightCost,
            itemCost,
            total,
            eta,
            qty,
            weight,
          });
          setStep(3); // Moves to result step
          setLoading(false); // Clears loading state
        }
      );
    } catch (err) { // Catches any API errors
      console.error(err);
      setErrors({ api: "Error fetching distance. Try again." });
      setLoading(false);
    }
  };

  // Resets form to initial state
  const resetForm = () => {
    setType("interstate"); // Resets type
    setForm({ // Resets form fields
      originState: "",
      destinationState: "",
      quantity: 1,
      weight: 0,
    });
    setResult(null); // Clears result
    setErrors({}); // Clears errors
    setStep(1); // Resets to step 1
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-20 px-4 lg:px-8 text-gray-900">
      <div className="max-w-4xl mx-auto">
        {/* Stepper */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold mb-2">Get a quick quote</h1> {/* Title */}
          <p className="text-gray-600">Step-by-step quoting with live distance-based pricing</p> {/* Subtitle */}
          <div className="mt-6 h-3 bg-gray-200 rounded-full overflow-hidden"> {/* Progress bar */}
            <div
              className="h-full bg-gray-900"
              style={{ width: `${(step / 3) * 100}%`, transition: "width 300ms ease" }} // Dynamic progress width
            />
          </div>
        </div>

        <div className="bg-white shadow-md rounded-2xl p-6">
          {/* Step 1: Shipment Type */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">1. Select shipment type</h2> {/* Step title */}
              <div className="grid md:grid-cols-2 gap-4"> {/* Radio buttons grid */}
                <label
                  className={`cursor-pointer rounded-lg border p-4 flex items-center space-x-4 ${
                    type === "interstate" ? "border-gray-900 bg-gray-100" : "border-gray-200"
                  }`} // Conditional styling for selected type
                >
                  <input
                    type="radio"
                    name="type"
                    value="interstate"
                    checked={type === "interstate"} // Binds to state
                    onChange={() => setType("interstate")} // Updates type
                  />
                  <div>
                    <div className="font-semibold capitalize">Interstate</div> {/* Label */}
                    <div className="text-sm text-gray-600">Shipments across states in Nigeria</div> {/* Description */}
                  </div>
                </label>
                <label className="cursor-not-allowed rounded-lg border p-4 flex items-center space-x-4 border-gray-200 opacity-50"> {/* Disabled option */}
                  <input type="radio" name="type" value="international" disabled /> {/* Disabled radio */}
                  <div>
                    <div className="font-semibold capitalize">International</div>
                    <div className="text-sm text-gray-600">Coming soon...</div>
                  </div>
                </label>
              </div>
              {errors.type && <div className="text-red-500 text-sm mt-1">{errors.type}</div>} {/* Type error display */}
              <div className="mt-6 flex items-center space-x-3"> {/* Navigation buttons */}
                <button onClick={next} className="bg-gray-900 text-white px-6 py-2 rounded-lg">Continue</button> {/* Next step */}
                <button onClick={resetForm} className="px-4 py-2 cursor-pointer text-gray-600">Reset</button> {/* Reset form */}
              </div>
            </div>
          )}

          {/* Step 2: Shipment Details */}
          {step === 2 && (
            <form onSubmit={calculate}> {/* Form for details */}
              <h2 className="text-xl font-semibold mb-4">2. Shipment details</h2> {/* Step title */}
              <div className="grid md:grid-cols-2 gap-4"> {/* Input fields grid */}
                <div>
                  <label className="text-sm">Origin State</label> {/* Origin label */}
                  <select
                    name="originState"
                    value={form.originState}
                    onChange={handleChange}
                    className="mt-2 w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gray-900 outline-none" // Styling
                  >
                    <option value="">Select state</option> {/* Placeholder */}
                    {statesLgas.map((s, idx) => (
                      <option key={idx} value={s.name}>{s.name}</option> // State options
                    ))}
                  </select>
                  {errors.originState && <div className="text-red-500 text-sm mt-1">{errors.originState}</div>} {/* Origin error */}
                </div>
                <div>
                  <label className="text-sm">Destination State</label> {/* Destination label */}
                  <select
                    name="destinationState"
                    value={form.destinationState}
                    onChange={handleChange}
                    className="mt-2 w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gray-900 outline-none"
                  >
                    <option value="">Select state</option>
                    {statesLgas.map((s, idx) => (
                      <option key={idx} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                  {errors.destinationState && <div className="text-red-500 text-sm mt-1">{errors.destinationState}</div>} {/* Destination error */}
                </div>
                <div>
                  <label className="text-sm">Quantity (pcs)</label> {/* Quantity label */}
                  <input
                    name="quantity"
                    type="number"
                    min="1"
                    value={form.quantity}
                    onChange={handleChange}
                    className="mt-2 w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gray-900 outline-none"
                  />
                  {errors.quantity && <div className="text-red-500 text-sm mt-1">{errors.quantity}</div>} {/* Quantity error */}
                </div>
                <div>
                  <label className="text-sm">Weight (kg)</label> {/* Weight label */}
                  <input
                    name="weight"
                    type="number"
                    min="0"
                    value={form.weight}
                    onChange={handleChange}
                    className="mt-2 w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gray-900 outline-none"
                  />
                  {errors.weight && <div className="text-red-500 text-sm mt-1">{errors.weight}</div>} {/* Weight error */}
                </div>
              </div>
              {errors.api && <div className="text-red-500 mt-2">{errors.api}</div>} {/* API error display */}
              <div className="mt-6 flex items-center space-x-3"> {/* Navigation buttons */}
                <button type="button" onClick={back} className="px-4 py-2 border rounded-lg">Back</button> {/* Previous step */}
                <button
                  type="submit"
                  disabled={loading || !isLoaded} // Disables if loading or API not loaded
                  className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:opacity-95 transition disabled:opacity-50"
                >
                  {loading ? "Calculating..." : "Calculate"} {/* Dynamic button text */}
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Result */}
          {step === 3 && result && (
            <div>
              <h2 className="text-xl font-semibold mb-4">3. Quote summary</h2> {/* Step title */}
              <div className="grid md:grid-cols-2 gap-6"> {/* Summary grid */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3"> {/* Route info */}
                    <MapPin className="h-5 w-5" />
                    <div>
                      <div className="text-sm text-gray-500">Route</div>
                      <div className="font-medium">{form.originState} → {form.destinationState}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3"> {/* Quantity/Weight info */}
                    <Box className="h-5 w-5" />
                    <div>
                      <div className="text-sm text-gray-500">Qty / Weight</div>
                      <div className="font-medium">{result.qty} pcs • {result.weight} kg</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3"> {/* Distance info */}
                    <DollarSign className="h-5 w-5" />
                    <div>
                      <div className="text-sm text-gray-500">Distance</div>
                      <div className="font-medium">{result.distanceKm.toFixed(1)} km</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3"> {/* ETA info */}
                    <CalendarDays className="h-5 w-5" />
                    <div>
                      <div className="text-sm text-gray-500">Estimated delivery</div>
                      <div className="font-medium">{result.eta}</div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border"> {/* Cost breakdown */}
                  <div className="text-sm text-gray-600 mb-3">Cost breakdown</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"> {/* Base cost */}
                      <div>Base (Interstate)</div>
                      <div>{formatCurrency(result.base)}</div>
                    </div>
                    <div className="flex justify-between"> {/* Distance cost */}
                      <div>Distance ({result.distanceKm.toFixed(1)} km)</div>
                      <div>{formatCurrency(result.distanceCost)}</div>
                    </div>
                    <div className="flex justify-between"> {/* Weight cost */}
                      <div>Weight</div>
                      <div>{formatCurrency(result.weightCost)}</div>
                    </div>
                    <div className="flex justify-between"> {/* Quantity cost */}
                      <div>Quantity</div>
                      <div>{formatCurrency(result.itemCost)}</div>
                    </div>
                  </div>
                  <div className="border-t pt-3 mt-3 flex justify-between items-center"> {/* Total cost */}
                    <div className="text-lg font-bold">Estimated total:</div>
                    <div className="text-xl font-extrabold text-gray-900">{formatCurrency(result.total)}</div>
                  </div>
                  <div className="mt-4 flex gap-3"> {/* Action buttons */}
                    <button
                      onClick={() => navigator.clipboard?.writeText(JSON.stringify({ type, form, result }))}
                      className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-100 transition" // Copies quote
                    >
                      Copy Quote
                    </button>
                    <button
                      onClick={resetForm}
                      className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:opacity-95 transition" // Resets form
                    >
                      New Quote
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}