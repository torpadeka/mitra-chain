import { useState } from "react";

export default function FloatingActionButton() {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  // Dummy backend call
  const analyseFranchise = async () => {
    setResult("Analysing franchise...");
    // Simulate API call
    setTimeout(() => {
      setResult("✅ Franchise looks like a good opportunity!");
    }, 1500);
  };

  return (
    <div>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={() => setOpen(!open)}
          className="bg-blue-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition"
        >
          +
        </button>
      </div>

      {/* Expandable Menu */}
      {open && (
        <div className="fixed bottom-24 right-6 bg-white shadow-xl rounded-lg p-4 w-56">
          <h3 className="text-sm font-semibold mb-2">Actions</h3>
          <button
            onClick={analyseFranchise}
            className="w-full px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Analyse Franchise
          </button>
        </div>
      )}

      {/* Result Modal / Toast */}
      {result && (
        <div className="fixed bottom-32 right-6 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg">
          {result}
        </div>
      )}
    </div>
  );
}
