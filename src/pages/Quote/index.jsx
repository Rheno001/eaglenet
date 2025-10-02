// src/pages/Quote/index.jsx
import React, { useState } from "react";
import { LoadScript } from "@react-google-maps/api";
import QuoteForm from "./QuoteForm";

export default function Quote() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY;

  return (
    <LoadScript googleMapsApiKey={apiKey} libraries={["places"]}>
      <QuoteForm />
    </LoadScript>
  );
}
