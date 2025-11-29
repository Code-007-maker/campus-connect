// src/components/resources/ResourceCard.jsx
import React from "react";

export default function ResourceCard({ resource, onBook }) {
  return (
    <div className="p-4 rounded-xl shadow border bg-white">
      <h3 className="text-xl font-semibold">{resource.name}</h3>
      <p className="muted text-sm">{resource.location}</p>

      <div className="mt-2 text-sm">
        {resource.description}
      </div>

      <div className="mt-3 text-sm">
        <b>Type:</b> {resource.type}
      </div>

      <div className="mt-1 text-sm">
        <b>Status:</b>{" "}
        <span className={resource.available ? "text-green-600" : "text-red-600"}>
          {resource.available ? "Available" : "Not available"}
        </span>
      </div>

      <button
        disabled={!resource.available}
        onClick={onBook}
        className={`mt-4 w-full py-2 rounded-lg text-white ${
          resource.available
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        {resource.available ? "Book Now" : "Not Available"}
      </button>
    </div>
  );
}
