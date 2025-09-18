import React, { useState } from "react";

const FranchiseAnalyzer: React.FC = () => {
  const [userMessage, setUserMessage] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const sampleFranchise: Franchise = {
    id: 1,
    owner: "John Doe",
    name: "Sample Franchise",
    categoryIds: [1, 2],
    description: "A sample franchise for testing",
    startingPrice: 100000,
    foundedIn: 2010,
    totalOutlets: 50,
    legalEntity: "Sample LLC",
    minGrossProfit: 50000,
    maxGrossProfit: 150000,
    minNetProfit: 20000,
    maxNetProfit: 80000,
    isDepositRequired: true,
    royaltyFee: "5%",
    licenseDuration: { Years: 5 },
    coverImageUrl: "https://example.com/cover.jpg",
    productGallery: [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg",
    ],
    contactNumber: "123-456-7890",
    contactEmail: "contact@sample.com",
    locations: ["New York, NY", "Los Angeles, CA"],
    status: "Active",
    isVerified: true,
    reviewsCount: 100,
  };

  const handleAnalyze = async () => {
    // try {
    //   const response = await analyzeFranchise(userMessage, sampleFranchise);
    //   setResult(response.content || "No result returned");
    // } catch (error) {
    //   console.error("Error analyzing franchise:", error);
    //   setResult("An error occurred while analyzing the franchise.");
    // }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Franchise Analyzer</h1>
      <textarea
        className="w-full p-2 border rounded"
        rows={4}
        value={userMessage}
        onChange={(e) => setUserMessage(e.target.value)}
        placeholder="Enter your analysis request (e.g., Analyze the potential of this franchise)"
      />
      <button
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={handleAnalyze}
      >
        Analyze Franchise
      </button>
      {result && (
        <div className="mt-4 p-4 border rounded">
          <h2 className="text-xl font-semibold">Analysis Result</h2>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
};

export default FranchiseAnalyzer;
