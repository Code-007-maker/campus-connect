import React from "react";

export default function ResourceCard({ resource, onBook }) {
  return (
    <div className="p-4 rounded-xl shadow border bg-white flex flex-col justify-between"
         style={{ borderColor: "var(--glass-border)" }}
    >
      <div>
        <div className="text-lg font-bold">{resource.name}</div>
        <div className="text-sm text-slate-500">{resource.location}</div>

        <p className="text-sm text-slate-600 mt-2">{resource.description}</p>

        <div className="mt-3 text-sm">
          <span className="font-medium">Type:</span> {resource.type}
        </div>

        <div className="mt-1 text-sm">
          <span className="font-medium">Capacity:</span> {resource.capacity}
        </div>

        <div className="mt-1 text-sm">
          <span className={`font-semibold ${resource.available ? "text-green-600" : "text-red-600"}`}>
            {resource.available ? "Available" : "Unavailable"}
          </span>
        </div>
      </div>

      <button
        disabled={!resource.available}
        onClick={onBook}
        className={`mt-6 w-full py-2 rounded-lg text-white font-medium ${
          resource.available ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-300 cursor-not-allowed"
        }`}
      >
        {resource.available ? "Book Now" : "Not Available"}
      </button>
    </div>
  );
}
