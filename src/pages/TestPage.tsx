"use client";

import type React from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useUser } from "@/context/AuthContext";
import { FranchiseHandler } from "@/handler/FranchiseHandler";
import { CategoryHandler } from "@/handler/CategoryHandler";
import { ApplicationHandler } from "@/handler/ApplicationHandler";
import { NFTHandler } from "@/handler/NFTHandler";
import { TransactionHandler } from "@/handler/TransactionHandler";
import {
  ChevronDown,
  ChevronRight,
  Play,
  Loader2,
  CheckCircle,
  XCircle,
  Copy,
} from "lucide-react";

interface TestResult {
  method: string;
  result: any;
  error?: string;
  timestamp: Date;
  loading?: boolean;
}

const TestPage: React.FC = () => {
  const { actor, principal } = useUser();
  const [results, setResults] = useState<TestResult[]>([]);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set()
  );
  const [loadingTests, setLoadingTests] = useState<Set<string>>(new Set());

  // Form states
  const [franchiseId, setFranchiseId] = useState<string>("1");
  const [categoryId, setCategoryId] = useState<string>("1");
  const [applicationId, setApplicationId] = useState<string>("1");
  const [tokenId, setTokenId] = useState<string>("1");
  const [ownerPrincipal, setOwnerPrincipal] = useState<string>("");
  const [applicantPrincipal, setApplicantPrincipal] = useState<string>("");
  const [toPrincipal, setToPrincipal] = useState<string>("");
  const [subaccount, setSubaccount] = useState<string>("");
  const [memo, setMemo] = useState<string>("");
  const [categoryName, setCategoryName] = useState<string>("Test Category");
  const [categoryDescription, setCategoryDescription] =
    useState<string>("Test Description");
  const [coverLetter, setCoverLetter] = useState<string>("Test Cover Letter");
  const [rejectionReason, setRejectionReason] =
    useState<string>("Test Rejection");

  if (!actor || !principal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Authentication Required
          </h2>
          <p className="text-gray-600">
            Please log in to access the API testing interface.
          </p>
        </div>
      </div>
    );
  }

  const franchiseHandler = new FranchiseHandler(actor);
  const categoryHandler = new CategoryHandler(actor);
  const applicationHandler = new ApplicationHandler(actor);
  const nftHandler = new NFTHandler(actor);
  const transactionHandler = new TransactionHandler(actor);

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const executeTest = async (method: string, fn: () => Promise<any>) => {
    const newLoadingTests = new Set(loadingTests);
    newLoadingTests.add(method);
    setLoadingTests(newLoadingTests);

    try {
      const result = await fn();
      setResults((prev) => [
        {
          method,
          result: JSON.stringify(result, null, 2),
          timestamp: new Date(),
        },
        ...prev,
      ]);
    } catch (error: any) {
      setResults((prev) => [
        { method, result: null, error: error.message, timestamp: new Date() },
        ...prev,
      ]);
    } finally {
      const updatedLoadingTests = new Set(loadingTests);
      updatedLoadingTests.delete(method);
      setLoadingTests(updatedLoadingTests);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const clearResults = () => {
    setResults([]);
  };

  const InputField = ({
    label,
    value,
    onChange,
    placeholder,
    type = "text",
  }: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: string;
  }) => (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        placeholder={placeholder}
      />
    </div>
  );

  const TestButton = ({
    onClick,
    children,
    method,
  }: {
    onClick: () => void;
    children: React.ReactNode;
    method: string;
  }) => {
    const isLoading = loadingTests.has(method);
    return (
      <button
        onClick={onClick}
        disabled={isLoading}
        className={cn(
          "flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
          isLoading && "bg-blue-500"
        )}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Play className="w-4 h-4" />
        )}
        {children}
      </button>
    );
  };

  const TestSection = ({
    title,
    sectionKey,
    children,
  }: {
    title: string;
    sectionKey: string;
    children: React.ReactNode;
  }) => {
    const isExpanded = expandedSections.has(sectionKey);
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <button
          onClick={() => toggleSection(sectionKey)}
          className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-500" />
          )}
        </button>
        {isExpanded && <div className="p-6 space-y-4">{children}</div>}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                API Test Console
              </h1>
              <p className="text-gray-600">
                Test and debug your franchise management API endpoints
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Logged in as: {principal.toText()}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() =>
                  setExpandedSections(
                    new Set([
                      "franchise",
                      "category",
                      "application",
                      "nft",
                      "transaction",
                    ])
                  )
                }
                className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Expand All
              </button>
              <button
                onClick={() => setExpandedSections(new Set())}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Collapse All
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* FranchiseHandler Tests */}
          <TestSection title="Franchise Handler" sectionKey="franchise">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <InputField
                  label="Franchise ID"
                  value={franchiseId}
                  onChange={setFranchiseId}
                  type="number"
                  placeholder="Enter franchise ID"
                />
                <InputField
                  label="Category IDs (comma-separated)"
                  value={categoryId}
                  onChange={setCategoryId}
                  placeholder="e.g., 1,2,3"
                />
              </div>
              <div className="space-y-3">
                <TestButton
                  method="getFranchise"
                  onClick={() =>
                    executeTest("getFranchise", () =>
                      franchiseHandler.getFranchise(Number(franchiseId))
                    )
                  }
                >
                  Get Franchise
                </TestButton>
                <TestButton
                  method="listFranchises"
                  onClick={() =>
                    executeTest("listFranchises", () =>
                      franchiseHandler.listFranchises()
                    )
                  }
                >
                  List All Franchises
                </TestButton>
                <TestButton
                  method="listFranchisesByCategoryIds"
                  onClick={() =>
                    executeTest("listFranchisesByCategoryIds", () =>
                      franchiseHandler.listFranchisesByCategoryIds(
                        categoryId
                          .split(",")
                          .map(Number)
                          .filter((id) => !isNaN(id))
                      )
                    )
                  }
                >
                  List by Category IDs
                </TestButton>
                <TestButton
                  method="createFranchise"
                  onClick={() =>
                    executeTest("createFranchise", () =>
                      franchiseHandler.createFranchise(
                        "Test Franchise",
                        [1, 2],
                        "Test Description",
                        100000,
                        new Date(),
                        10,
                        "Test Entity",
                        50000,
                        100000,
                        20000,
                        40000,
                        true,
                        "5%",
                        { Years: 5 },
                        "https://example.com/cover.jpg",
                        [
                          "https://example.com/image1.jpg",
                          "https://example.com/image2.jpg",
                        ],
                        "1234567890",
                        "test@example.com",
                        ["Location1", "Location2"]
                      )
                    )
                  }
                >
                  Create Test Franchise
                </TestButton>
              </div>
            </div>
          </TestSection>

          {/* CategoryHandler Tests */}
          <TestSection title="Category Handler" sectionKey="category">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <InputField
                  label="Category ID"
                  value={categoryId}
                  onChange={setCategoryId}
                  type="number"
                  placeholder="Enter category ID"
                />
                <InputField
                  label="Category Name"
                  value={categoryName}
                  onChange={setCategoryName}
                  placeholder="Enter category name"
                />
                <InputField
                  label="Category Description"
                  value={categoryDescription}
                  onChange={setCategoryDescription}
                  placeholder="Enter category description"
                />
              </div>
              <div className="space-y-3">
                <TestButton
                  method="getCategory"
                  onClick={() =>
                    executeTest("getCategory", () =>
                      categoryHandler.getCategory(Number(categoryId))
                    )
                  }
                >
                  Get Category
                </TestButton>
                <TestButton
                  method="createCategory"
                  onClick={() =>
                    executeTest("createCategory", () =>
                      categoryHandler.createCategory(
                        categoryName,
                        categoryDescription
                      )
                    )
                  }
                >
                  Create Category
                </TestButton>
              </div>
            </div>
          </TestSection>

          {/* ApplicationHandler Tests */}
          <TestSection title="Application Handler" sectionKey="application">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <InputField
                  label="Application ID"
                  value={applicationId}
                  onChange={setApplicationId}
                  type="number"
                  placeholder="Enter application ID"
                />
                <InputField
                  label="Owner Principal"
                  value={ownerPrincipal}
                  onChange={setOwnerPrincipal}
                  placeholder="e.g., 2vxsx-fae"
                />
                <InputField
                  label="Applicant Principal"
                  value={applicantPrincipal}
                  onChange={setApplicantPrincipal}
                  placeholder="e.g., 2vxsx-fae"
                />
                <InputField
                  label="Cover Letter"
                  value={coverLetter}
                  onChange={setCoverLetter}
                  placeholder="Enter cover letter"
                />
                <InputField
                  label="Rejection Reason"
                  value={rejectionReason}
                  onChange={setRejectionReason}
                  placeholder="Enter rejection reason"
                />
              </div>
              <div className="space-y-3">
                <TestButton
                  method="getApplication"
                  onClick={() =>
                    executeTest("getApplication", () =>
                      applicationHandler.getApplication(Number(applicationId))
                    )
                  }
                >
                  Get Application
                </TestButton>
                <TestButton
                  method="getApplicationsByOwner"
                  onClick={() =>
                    executeTest("getApplicationsByOwner", () =>
                      applicationHandler.getApplicationsByOwner(
                        ownerPrincipal || principal.toText()
                      )
                    )
                  }
                >
                  Get by Owner
                </TestButton>
                <TestButton
                  method="getApplicationsByApplicant"
                  onClick={() =>
                    executeTest("getApplicationsByApplicant", () =>
                      applicationHandler.getApplicationsByApplicant(
                        applicantPrincipal || principal.toText()
                      )
                    )
                  }
                >
                  Get by Applicant
                </TestButton>
                <TestButton
                  method="applyForFranchise"
                  onClick={() =>
                    executeTest("applyForFranchise", () =>
                      applicationHandler.applyForFranchise(
                        Number(franchiseId),
                        coverLetter
                      )
                    )
                  }
                >
                  Apply for Franchise
                </TestButton>
                <TestButton
                  method="approveApplication"
                  onClick={() =>
                    executeTest("approveApplication", () =>
                      applicationHandler.approveApplication(
                        Number(applicationId)
                      )
                    )
                  }
                >
                  Approve Application
                </TestButton>
                <TestButton
                  method="rejectApplication"
                  onClick={() =>
                    executeTest("rejectApplication", () =>
                      applicationHandler.rejectApplication(
                        Number(applicationId),
                        rejectionReason
                      )
                    )
                  }
                >
                  Reject Application
                </TestButton>
              </div>
            </div>
          </TestSection>

          {/* NFTHandler Tests */}
          <TestSection title="NFT Handler" sectionKey="nft">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <InputField
                  label="Token ID"
                  value={tokenId}
                  onChange={setTokenId}
                  type="number"
                  placeholder="Enter token ID"
                />
                <InputField
                  label="To Principal"
                  value={toPrincipal}
                  onChange={setToPrincipal}
                  placeholder="e.g., 2vxsx-fae"
                />
                <InputField
                  label="Subaccount (hex)"
                  value={subaccount}
                  onChange={setSubaccount}
                  placeholder="e.g., 1234abcd"
                />
                <InputField
                  label="Memo"
                  value={memo}
                  onChange={setMemo}
                  placeholder="Transfer memo"
                />
              </div>
              <div className="space-y-3">
                <TestButton
                  method="getNFT"
                  onClick={() =>
                    executeTest("getNFT", () =>
                      nftHandler.getNFT(Number(tokenId))
                    )
                  }
                >
                  Get NFT
                </TestButton>
                <TestButton
                  method="transferNFT"
                  onClick={() =>
                    executeTest("transferNFT", () =>
                      nftHandler.transferNFT(
                        [Number(tokenId)],
                        {
                          owner: toPrincipal || principal.toText(),
                          subaccount: subaccount || undefined,
                        },
                        memo || undefined,
                        new Date()
                      )
                    )
                  }
                >
                  Transfer NFT
                </TestButton>
                <TestButton
                  method="balanceOf"
                  onClick={() =>
                    executeTest("balanceOf", () =>
                      nftHandler.balanceOf({
                        owner: ownerPrincipal || principal.toText(),
                        subaccount: subaccount || undefined,
                      })
                    )
                  }
                >
                  Get Balance
                </TestButton>
                <TestButton
                  method="ownerOf"
                  onClick={() =>
                    executeTest("ownerOf", () =>
                      nftHandler.ownerOf(Number(tokenId))
                    )
                  }
                >
                  Get Owner
                </TestButton>
                <TestButton
                  method="tokenMetadata"
                  onClick={() =>
                    executeTest("tokenMetadata", () =>
                      nftHandler.tokenMetadata([Number(tokenId)])
                    )
                  }
                >
                  Get Metadata
                </TestButton>
                <TestButton
                  method="totalSupply"
                  onClick={() =>
                    executeTest("totalSupply", () => nftHandler.totalSupply())
                  }
                >
                  Get Total Supply
                </TestButton>
              </div>
            </div>
          </TestSection>

          {/* TransactionHandler Tests */}
          <TestSection title="Transaction Handler" sectionKey="transaction">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <InputField
                  label="Transaction ID"
                  value={applicationId}
                  onChange={setApplicationId}
                  type="number"
                  placeholder="Enter transaction ID"
                />
              </div>
              <div className="space-y-3">
                <TestButton
                  method="getTransaction"
                  onClick={() =>
                    executeTest("getTransaction", () =>
                      transactionHandler.getTransaction(Number(applicationId))
                    )
                  }
                >
                  Get Transaction
                </TestButton>
                <TestButton
                  method="listTransactions"
                  onClick={() =>
                    executeTest("listTransactions", () =>
                      transactionHandler.listTransactions()
                    )
                  }
                >
                  List All Transactions
                </TestButton>
              </div>
            </div>
          </TestSection>

          {/* Results Display */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Test Results
              </h2>
              <div className="flex gap-2">
                <span className="text-sm text-gray-500">
                  {results.length} results
                </span>
                {results.length > 0 && (
                  <button
                    onClick={clearResults}
                    className="text-sm text-red-600 hover:text-red-700 transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>
            <div className="p-6">
              {results.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500">
                    No tests run yet. Click any test button to get started.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {results.map((res, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <div className="px-4 py-3 bg-gray-50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {res.error ? (
                            <XCircle className="w-5 h-5 text-red-500" />
                          ) : (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          )}
                          <span className="font-medium text-gray-900">
                            {res.method}
                          </span>
                          <span className="text-sm text-gray-500">
                            {res.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <button
                          onClick={() =>
                            copyToClipboard(res.error || res.result)
                          }
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Copy result"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="p-4">
                        {res.error ? (
                          <pre className="text-red-600 text-sm bg-red-50 p-3 rounded border border-red-200 overflow-x-auto">
                            Error: {res.error}
                          </pre>
                        ) : (
                          <pre className="text-gray-800 text-sm bg-gray-50 p-3 rounded border border-gray-200 overflow-x-auto">
                            {res.result}
                          </pre>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
