import React, { useState } from "react";
import { MapPin, Box, CalendarDays, DollarSign } from "lucide-react";

// Rates (per km, per kg, per item)
const RATES = {
  intrastate: { base: 2000, perKm: 50, perKg: 100, perItem: 150 },
  interstate: { base: 5000, perKm: 70, perKg: 200, perItem: 250 },
};

function formatCurrency(n) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(n);
}

export default function Quote() {
  const [step, setStep] = useState(1);
  const [type, setType] = useState("");
  const [form, setForm] = useState({
    origin: "",
    destination: "",
    quantity: 1,
    weight: 0,
  });
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const next = () => {
    if (step === 1 && !type) {
      setErrors({ type: "Please select Intrastate or Interstate." });
      return;
    }
    setErrors({});
    setStep((s) => Math.min(3, s + 1));
  };

  const back = () => setStep((s) => Math.max(1, s - 1));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validateDetails = () => {
    const err = {};
    if (!form.origin.trim()) err.origin = "Origin is required.";
    if (!form.destination.trim()) err.destination = "Destination is required.";
    if (!form.quantity || Number(form.quantity) <= 0)
      err.quantity = "Quantity must be > 0";
    if (form.weight === "" || Number(form.weight) < 0)
      err.weight = "Weight must be >= 0";
    return err;
  };

  const calculate = async (e) => {
    e?.preventDefault();
    const err = validateDetails();
    if (Object.keys(err).length) {
      setErrors(err);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      // Google Maps Distance Matrix API
      const apiKey = "YOUR_GOOGLE_MAPS_API_KEY"; // 🔑 replace with env variable
      const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
        form.origin
      )}&destinations=${encodeURIComponent(
        form.destination
      )}&key=${apiKey}`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.rows[0].elements[0].status !== "OK") {
        setErrors({ api: "Could not calculate distance. Check locations." });
        setLoading(false);
        return;
      }

      const distanceMeters = data.rows[0].elements[0].distance.value;
      const distanceKm = distanceMeters / 1000;

      // Apply formula
      const rate = RATES[type];
      const qty = Math.max(1, Number(form.quantity));
      const weight = Math.max(0, Number(form.weight));

      const base = rate.base;
      const distanceCost = distanceKm * rate.perKm;
      const weightCost = weight * rate.perKg;
      const itemCost = qty * rate.perItem;

      const total = Math.round(
        (base + distanceCost + weightCost + itemCost) * 100
      ) / 100;

      const eta =
        type === "intrastate" ? "1–2 business days" : "3–7 business days";

      const breakdown = {
        base,
        distanceKm,
        distanceCost,
        weightCost,
        itemCost,
        total,
        eta,
        qty,
        weight,
      };

      setResult(breakdown);
      setStep(3);
    } catch (err) {
      setErrors({ api: "Error fetching distance. Try again." });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setType("");
    setForm({ origin: "", destination: "", quantity: 1, weight: 0 });
    setResult(null);
    setErrors({});
    setStep(1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-20 px-4 lg:px-8 text-gray-900">
      <div className="max-w-4xl mx-auto">
        {/* Header / Stepper */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold mb-2">
            Get a quick quote
          </h1>
          <p className="text-gray-600">
            Step-by-step quoting with live distance-based pricing
          </p>

          <div className="mt-6 h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gray-900"
              style={{
                width: `${(step / 3) * 100}%`,
                transition: "width 300ms ease",
              }}
            />
          </div>
          <div className="flex items-center justify-between mt-2 text-sm text-gray-500">
            <div>Shipment type</div>
            <div>Details</div>
            <div>Quote</div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-2xl p-6">
          {/* Step 1: Type */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                1. Select shipment type
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {["intrastate", "interstate"].map((opt) => (
                  <label
                    key={opt}
                    className={`cursor-pointer rounded-lg border p-4 flex items-center space-x-4 ${
                      type === opt ? "border-gray-900 bg-gray-100" : "border-gray-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="type"
                      value={opt}
                      checked={type === opt}
                      onChange={() => setType(opt)}
                    />
                    <div>
                      <div className="font-semibold capitalize">{opt}</div>
                      <div className="text-sm text-gray-600">
                        {opt === "intrastate"
                          ? "Local shipments within the same state"
                          : "Shipments across states or long-distance"}
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              {errors.type && (
                <div className="text-red-500 mt-3">{errors.type}</div>
              )}

              <div className="mt-6 flex items-center space-x-3">
                <button
                  onClick={next}
                  className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:opacity-95 transition"
                >
                  Continue
                </button>
                <button
                  onClick={resetForm}
                  className="px-4 py-2 cursor-pointer text-gray-600"
                >
                  Reset
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Details */}
          {step === 2 && (
            <form onSubmit={calculate}>
              <h2 className="text-xl font-semibold mb-4">2. Shipment details</h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm">Origin</label>
                  <input
                    name="origin"
                    value={form.origin}
                    onChange={handleChange}
                    className="mt-2 w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gray-900 outline-none"
                    placeholder="Lagos, Nigeria"
                  />
                  {errors.origin && (
                    <div className="text-red-500 text-sm mt-1">{errors.origin}</div>
                  )}
                </div>

                <div>
                  <label className="text-sm">Destination</label>
                  <input
                    name="destination"
                    value={form.destination}
                    onChange={handleChange}
                    className="mt-2 w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gray-900 outline-none"
                    placeholder="Abuja, Nigeria"
                  />
                  {errors.destination && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.destination}
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-sm">Quantity (pcs)</label>
                  <input
                    name="quantity"
                    type="number"
                    min="1"
                    value={form.quantity}
                    onChange={handleChange}
                    className="mt-2 w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gray-900 outline-none"
                  />
                  {errors.quantity && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.quantity}
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-sm">Weight (kg)</label>
                  <input
                    name="weight"
                    type="number"
                    min="0"
                    value={form.weight}
                    onChange={handleChange}
                    className="mt-2 w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gray-900 outline-none"
                  />
                  {errors.weight && (
                    <div className="text-red-500 text-sm mt-1">{errors.weight}</div>
                  )}
                </div>
              </div>

              {errors.api && <div className="text-red-500 mt-2">{errors.api}</div>}

              <div className="mt-6 flex items-center space-x-3">
                <button
                  type="button"
                  onClick={back}
                  className="px-4 py-2 border rounded-lg"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:opacity-95 transition disabled:opacity-50"
                >
                  {loading ? "Calculating..." : "Calculate"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 cursor-pointer text-gray-600"
                >
                  Reset
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Result */}
          {step === 3 && result && (
            <div>
              <h2 className="text-xl font-semibold mb-4">3. Quote summary</h2>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Left */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5" />
                    <div>
                      <div className="text-sm text-gray-500">Route</div>
                      <div className="font-medium">
                        {form.origin} → {form.destination}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Box className="h-5 w-5" />
                    <div>
                      <div className="text-sm text-gray-500">Qty / Weight</div>
                      <div className="font-medium">
                        {result.qty} pcs • {result.weight} kg
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <DollarSign className="h-5 w-5" />
                    <div>
                      <div className="text-sm text-gray-500">Distance</div>
                      <div className="font-medium">
                        {result.distanceKm.toFixed(1)} km
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <CalendarDays className="h-5 w-5" />
                    <div>
                      <div className="text-sm text-gray-500">Estimated delivery</div>
                      <div className="font-medium">{result.eta}</div>
                    </div>
                  </div>
                </div>

                {/* Right */}
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <div className="text-sm text-gray-600 mb-3">Cost breakdown</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <div>Base ({type})</div>
                      <div>{formatCurrency(result.base)}</div>
                    </div>
                    <div className="flex justify-between">
                      <div>Distance ({result.distanceKm.toFixed(1)} km)</div>
                      <div>{formatCurrency(result.distanceCost)}</div>
                    </div>
                    <div className="flex justify-between">
                      <div>Weight</div>
                      <div>{formatCurrency(result.weightCost)}</div>
                    </div>
                    <div className="flex justify-between">
                      <div>Quantity</div>
                      <div>{formatCurrency(result.itemCost)}</div>
                    </div>
                  </div>

                  <div className="border-t pt-3 mt-3 flex justify-between items-center">
                    <div className="text-lg font-bold">Estimated total</div>
                    <div className="text-2xl font-extrabold text-gray-900">
                      {formatCurrency(result.total)}
                    </div>
                  </div>

                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() =>
                        navigator.clipboard?.writeText(
                          JSON.stringify({ type, form, result })
                        )
                      }
                      className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
                    >
                      Copy Quote
                    </button>
                    <button
                      onClick={resetForm}
                      className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:opacity-95 transition"
                    >
                      New Quote
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <p className="text-sm text-gray-500 mt-4">
          Note: Costs are auto-calculated using Google Maps distance. Actual
          charges may vary.
        </p>
      </div>
    </div>
  );
}
