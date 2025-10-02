import React, { useState } from "react";
import { MapPin, Box, CalendarDays, DollarSign } from "lucide-react";
import statesLgas from "../../data/states.json";

// Rates (per km, per kg, per item)
const RATES = {
  interstate: { base: 5000, perKm: 2, perKg: 100, perItem: 150 },
};

function formatCurrency(n) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(n);
}

export default function Quote() {
  const [step, setStep] = useState(1);
  const [type, setType] = useState("interstate"); // default selection
  const [form, setForm] = useState({
    originState: "",
    destinationState: "",
    quantity: 1,
    weight: 0,
  });
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const next = () => {
    if (step === 1 && !type) {
      setErrors({ type: "Please select Interstate." });
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
    if (!form.originState.trim()) err.originState = "Origin is required.";
    if (!form.destinationState.trim())
      err.destinationState = "Destination is required.";
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
      // Use Google Maps JS API service
      const service = new window.google.maps.DistanceMatrixService();

      service.getDistanceMatrix(
        {
          origins: [form.originState],
          destinations: [form.destinationState],
          travelMode: window.google.maps.TravelMode.DRIVING,
          unitSystem: window.google.maps.UnitSystem.METRIC,
        },
        (response, status) => {
          if (
            status !== "OK" ||
            !response.rows[0].elements[0] ||
            response.rows[0].elements[0].status !== "OK"
          ) {
            setErrors({ api: "Could not calculate distance. Check locations." });
            setLoading(false);
            return;
          }

          const distanceMeters =
            response.rows[0].elements[0].distance.value;
          const distanceKm = distanceMeters / 1000;

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

          const eta = "3–7 business days";

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
          setLoading(false);
        }
      );
    } catch (err) {
      console.error(err);
      setErrors({ api: "Error fetching distance. Try again." });
      setLoading(false);
    }
  };

  const resetForm = () => {
    setType("interstate");
    setForm({
      originState: "",
      destinationState: "",
      quantity: 1,
      weight: 0,
    });
    setResult(null);
    setErrors({});
    setStep(1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-20 px-4 lg:px-8 text-gray-900">
      <div className="max-w-4xl mx-auto">
        {/* Stepper */}
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
        </div>

        <div className="bg-white shadow-md rounded-2xl p-6">
          {/* Step 1 */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                1. Select shipment type
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {/* Interstate (default, enabled) */}
                <label
                  className={`cursor-pointer rounded-lg border p-4 flex items-center space-x-4 ${
                    type === "interstate"
                      ? "border-gray-900 bg-gray-100"
                      : "border-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="type"
                    value="interstate"
                    checked={type === "interstate"}
                    onChange={() => setType("interstate")}
                  />
                  <div>
                    <div className="font-semibold capitalize">Interstate</div>
                    <div className="text-sm text-gray-600">
                      Shipments across states in Nigeria
                    </div>
                  </div>
                </label>

                {/* International (disabled) */}
                <label className="cursor-not-allowed rounded-lg border p-4 flex items-center space-x-4 border-gray-200 opacity-50">
                  <input type="radio" name="type" value="international" disabled />
                  <div>
                    <div className="font-semibold capitalize">International</div>
                    <div className="text-sm text-gray-600">
                      Coming soon...
                    </div>
                  </div>
                </label>
              </div>

              <div className="mt-6 flex items-center space-x-3">
                <button
                  onClick={next}
                  className="bg-gray-900 text-white px-6 py-2 rounded-lg"
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

          {/* Step 2 */}
          {step === 2 && (
            <form onSubmit={calculate}>
              <h2 className="text-xl font-semibold mb-4">
                2. Shipment details
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Origin */}
                <div>
                  <label className="text-sm">Origin State</label>
                  <select
                    name="originState"
                    value={form.originState}
                    onChange={handleChange}
                    className="mt-2 w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gray-900 outline-none"
                  >
                    <option value="">Select state</option>
                    {statesLgas.map((s, idx) => (
                      <option key={idx} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  {errors.originState && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.originState}
                    </div>
                  )}
                </div>

                {/* Destination */}
                <div>
                  <label className="text-sm">Destination State</label>
                  <select
                    name="destinationState"
                    value={form.destinationState}
                    onChange={handleChange}
                    className="mt-2 w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gray-900 outline-none"
                  >
                    <option value="">Select state</option>
                    {statesLgas.map((s, idx) => (
                      <option key={idx} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  {errors.destinationState && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.destinationState}
                    </div>
                  )}
                </div>

                {/* Quantity */}
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
                </div>

                {/* Weight */}
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
                </div>
              </div>

              {errors.api && (
                <div className="text-red-500 mt-2">{errors.api}</div>
              )}

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
              </div>
            </form>
          )}

          {/* Step 3: Result */}
          {step === 3 && result && (
            <div>
              <h2 className="text-xl font-semibold mb-4">3. Quote summary</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5" />
                    <div>
                      <div className="text-sm text-gray-500">Route</div>
                      <div className="font-medium">
                        {form.originState} → {form.destinationState}
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
                      <div className="text-sm text-gray-500">
                        Estimated delivery
                      </div>
                      <div className="font-medium">{result.eta}</div>
                    </div>
                  </div>
                </div>

                {/* Cost breakdown */}
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <div className="text-sm text-gray-600 mb-3">Cost breakdown</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <div>Base (Interstate)</div>
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
                    <div className="text-lg font-bold">Estimated total:</div>
                    <div className="text-xl font-extrabold text-gray-900">
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
      </div>
    </div>
  );
}
