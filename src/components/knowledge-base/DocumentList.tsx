"use client";

import React, { useState, useEffect } from "react";

import {
  useCompanyAppSelector,
  useCompanyAppDispatch,
} from "@/hooks/company/useCompanyAuth";
import {
  listDocuments,
  deleteDocument,
} from "@/store/company/slices/knowledgeBaseSlice";
import { Icons } from "@/components/ui";
import type { DocumentListProps } from "@/interfaces/KnowledgeBase.interface";
import type { Document } from "@/types/knowledgeBase";

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getStatusColor = (status: Document["embeddings_status"]) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-700";
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    case "failed":
      return "bg-red-100 text-red-700";
    default:
      return "bg-neutral-100 text-neutral-700";
  }
};

const getFileTypeIcon = (contentType: string) => {
  if (contentType.includes("pdf"))
    return <Icons.FileText className="h-5 w-5 text-red-600" />;
  if (contentType.includes("word") || contentType.includes("document"))
    return <Icons.FileText className="h-5 w-5 text-primary-600" />;
  if (contentType.includes("text"))
    return <Icons.Document className="h-5 w-5 text-green-600" />;
  return <Icons.Document className="h-5 w-5 text-neutral-600" />;
};


const DocumentList: React.FC<DocumentListProps> = ({ className = "" }) => {
  const dispatch = useCompanyAppDispatch();
  const { documents, loading, error } = useCompanyAppSelector(
    (state) => state.knowledgeBase,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [docsPerPage, setDocsPerPage] = useState(10);
  const [deletingDocId, setDeletingDocId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(listDocuments());
  }, [dispatch]);

  const handleDelete = async (docId: string) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      setDeletingDocId(docId);
      try {
        await dispatch(deleteDocument(docId));
      } finally {
        setDeletingDocId(null);
      }
    }
  };

  // Filter documents based on search term
  const filteredDocuments = documents.filter((doc) => {
    const searchLower = searchTerm.toLowerCase();
    return doc.filename.toLowerCase().includes(searchLower);
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredDocuments.length / docsPerPage);
  const indexOfLastDoc = currentPage * docsPerPage;
  const indexOfFirstDoc = indexOfLastDoc - docsPerPage;
  const currentDocuments = filteredDocuments.slice(indexOfFirstDoc, indexOfLastDoc);

  // Reset to first page when search term or docs per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, docsPerPage]);

  // Generate pagination pages array
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (loading && documents.length === 0) {
    return (
      <div className={`${className}`}>
        <div className="text-center py-20">
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 mb-8">
            <div className="animate-spin rounded-full h-8 w-8 border-3 border-primary-600 border-t-transparent"></div>
          </div>
          <h3 className="text-2xl font-semibold text-neutral-900 mb-3">
            Loading documents...
          </h3>
          <p className="text-lg text-neutral-600">
            Please wait while we fetch your knowledge base documents.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {error && (
        <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl shadow-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Icons.AlertCircle className="h-5 w-5 text-red-600" />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-red-800">
                {typeof error === "string"
                  ? error
                  : "An error occurred while loading documents."}
              </p>
            </div>
            <button
              onClick={() => {}}
              className="text-red-400 hover:text-red-600 text-xl font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <h3 className="text-xl font-semibold text-neutral-900">
            Documents
            <span className="text-sm font-normal text-neutral-600 ml-2">
              ({filteredDocuments.length} {searchTerm ? "found" : "total"})
            </span>
          </h3>
          {searchTerm && (
            <div className="text-sm text-neutral-600">
              Showing results for "{searchTerm}"
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Box */}
          <div className="relative">
            <Icons.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                <Icons.Close className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Pagination Size Selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-neutral-600 whitespace-nowrap">
              Show:
            </span>
            <select
              value={docsPerPage}
              onChange={(e) => setDocsPerPage(Number(e.target.value))}
              className="border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>
      </div>

      {filteredDocuments.length === 0 ? (
        <div className="text-center py-16">
          <div className="relative">
            <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center mb-6">
              <Icons.Document className="h-8 w-8 text-neutral-400" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">
            {searchTerm ? "No Documents Found" : "No Documents Yet"}
          </h3>
          <p className="text-neutral-600 mb-6 max-w-sm mx-auto">
            {searchTerm
              ? `No documents found matching "${searchTerm}". Try adjusting your search.`
              : "Upload documents to start building your knowledge base."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-gradient-to-r from-neutral-50 to-neutral-100">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider"
                  >
                    Document
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider"
                  >
                    Type
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider"
                  >
                    Size
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider"
                  >
                    Created
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-right text-xs font-semibold text-neutral-700 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {currentDocuments.map((document) => (
                  <tr
                    key={document.doc_id}
                    className="hover:bg-neutral-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {getFileTypeIcon(document.content_type)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-neutral-900 truncate max-w-xs">
                            {document.filename}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                      {document.content_type.split("/")[1]?.toUpperCase() || "FILE"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                      {formatFileSize(document.file_size)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(document.embeddings_status)}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                            document.embeddings_status === "completed"
                              ? "bg-green-600"
                              : document.embeddings_status === "pending"
                                ? "bg-yellow-600"
                                : "bg-red-600"
                          }`}
                        ></span>
                        {document.embeddings_status.charAt(0).toUpperCase() +
                          document.embeddings_status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                      {formatDate(document.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button
                        onClick={() => handleDelete(document.doc_id)}
                        disabled={deletingDocId === document.doc_id}
                        className="text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors p-2 hover:bg-red-50 rounded-lg"
                        aria-label="Delete document"
                      >
                        {deletingDocId === document.doc_id ? (
                          <div className="animate-spin h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full"></div>
                        ) : (
                          <Icons.Trash className="h-4 w-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {filteredDocuments.length > 0 && totalPages > 1 && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-neutral-600">
            Showing {indexOfFirstDoc + 1} to{" "}
            {Math.min(indexOfLastDoc, filteredDocuments.length)} of{" "}
            {filteredDocuments.length} documents
          </div>

          <nav className="flex items-center space-x-1">
            {/* Previous Button */}
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                currentPage === 1
                  ? "text-neutral-400 cursor-not-allowed"
                  : "text-neutral-600 hover:text-primary-600 hover:bg-primary-50"
              }`}
            >
              <Icons.ArrowLeft className="h-4 w-4 mr-1" />
              Previous
            </button>

            {/* Page Numbers */}
            <div className="flex items-center space-x-1">
              {getPageNumbers().map((page, index) =>
                page === "..." ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-3 py-2 text-sm text-neutral-400"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page as number)}
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      currentPage === page
                        ? "bg-primary-600 text-white shadow-sm"
                        : "text-neutral-600 hover:text-primary-600 hover:bg-primary-50"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}
            </div>

            {/* Next Button */}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                currentPage === totalPages
                  ? "text-neutral-400 cursor-not-allowed"
                  : "text-neutral-600 hover:text-primary-600 hover:bg-primary-50"
              }`}
            >
              Next
              <Icons.ArrowLeft className="h-4 w-4 ml-1 rotate-180" />
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default DocumentList;
