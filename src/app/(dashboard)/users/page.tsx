"use client";

import React, { useState, useEffect } from "react";

import { useCompanyAppSelector } from "@/hooks/company/useCompanyAuth";
import { getApiUrl } from "@/constants/api";
import { Icons, IOSContentLoader } from "@/components/ui";

interface CompanyUser {
  user_id: string;
  email: string | null;
  name: string | null;
  is_anonymous: boolean;
  chat_count: number;
  message_count: number;
  created_at: string;
}

interface UsersApiResponse {
  users: CompanyUser[];
  total_users: number;
  total_chats: number;
  total_messages: number;
  company_id: string;
}

export default function UsersPage() {
  const companyAuth = useCompanyAppSelector((state) => state.companyAuth);
  const [users, setUsers] = useState<CompanyUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [companyData, setCompanyData] = useState<UsersApiResponse | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(10);

  const fetchUsers = async () => {
    if (!companyAuth.company?.company_id) {
      setError("Company information not available");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(getApiUrl("/api/company/analytics/users"), {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("company_access_token")}`,
        },
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error(
            "Access denied: Only company admins can view user lists",
          );
        } else if (response.status === 404) {
          throw new Error("Company not found");
        } else {
          throw new Error("Failed to fetch users");
        }
      }

      const data: UsersApiResponse = await response.json();
      setUsers(data.users || []);
      setCompanyData(data);
    } catch (error: any) {
      console.error("Failed to fetch users:", error);
      setError(error.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (companyAuth.company?.company_id && companyAuth.isAuthenticated) {
      fetchUsers();
    } else if (
      companyAuth.isAuthenticated &&
      !companyAuth.company?.company_id
    ) {
      setLoading(true);
    }
  }, [companyAuth.company?.company_id, companyAuth.isAuthenticated]);

  if (!companyAuth.isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Icons.Users className="h-10 w-10 text-neutral-300 mb-4" />
        <h3 className="text-base font-semibold text-neutral-900 mb-1">
          Access Restricted
        </h3>
        <p className="text-sm text-neutral-500">
          Only company administrators can manage users.
        </p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    const name = user.is_anonymous
      ? "anonymous user"
      : (user.name || "").toLowerCase();
    const email = user.is_anonymous ? "" : (user.email || "").toLowerCase();

    return name.includes(searchLower) || email.includes(searchLower);
  });

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, usersPerPage]);

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

  if (loading) {
    return <IOSContentLoader isLoading={true} message="Loading users..." />;
  }

  const newThisMonth = users.filter((user) => {
    const userDate = new Date(user.created_at);
    const now = new Date();
    return (
      userDate.getMonth() === now.getMonth() &&
      userDate.getFullYear() === now.getFullYear()
    );
  }).length;

  const stats = [
    {
      label: "Total Users",
      value: companyData?.total_users || users.length,
      icon: Icons.Users,
      color: "text-primary-600",
      bg: "bg-primary-50",
    },
    {
      label: "Total Chats",
      value: companyData?.total_chats || 0,
      icon: Icons.MessageSquare,
      color: "text-accent-600",
      bg: "bg-accent-50",
    },
    {
      label: "Total Messages",
      value: companyData?.total_messages || 0,
      icon: Icons.MessageCircle,
      color: "text-warning-600",
      bg: "bg-warning-50",
    },
    {
      label: "New This Month",
      value: newThisMonth,
      icon: Icons.Clock,
      color: "text-neutral-600",
      bg: "bg-neutral-100",
    },
  ];

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Users</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Manage users interacting with your chatbot
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 bg-error-50 border border-error-200 rounded-lg p-3.5">
          <Icons.AlertTriangle className="h-4 w-4 text-error-500 flex-shrink-0" />
          <p className="text-sm text-error-700 flex-1">
            {typeof error === "string"
              ? error
              : "An error occurred while loading users."}
          </p>
          <button
            onClick={() => setError(null)}
            className="text-error-400 hover:text-error-600"
          >
            <Icons.Close className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-lg border border-neutral-200 p-5"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-neutral-900">{stat.value}</p>
              <p className="text-xs text-neutral-500 mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Users Table */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-base font-semibold text-neutral-900">
              Users
              <span className="text-sm font-normal text-neutral-500 ml-2">
                {filteredUsers.length} {searchTerm ? "found" : "total"}
              </span>
            </h3>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-56 pl-9 pr-8 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 bg-white"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  <Icons.Close className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Per page */}
            <select
              value={usersPerPage}
              onChange={(e) => setUsersPerPage(Number(e.target.value))}
              className="border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 bg-white"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border border-neutral-200">
            <Icons.Users className="mx-auto h-10 w-10 text-neutral-300 mb-4" />
            <h3 className="text-base font-semibold text-neutral-900 mb-1">
              {searchTerm ? "No Users Found" : "No Users Yet"}
            </h3>
            <p className="text-sm text-neutral-500 max-w-xs mx-auto">
              {searchTerm
                ? `No users matching "${searchTerm}".`
                : "Users who interact with your chatbot will appear here."}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-100">
                <thead>
                  <tr className="bg-neutral-50">
                    <th className="px-5 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Chats
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Messages
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Joined
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {currentUsers.map((user) => (
                    <tr
                      key={user.user_id}
                      className="hover:bg-neutral-50/50 transition-colors"
                    >
                      <td className="px-5 py-3.5 whitespace-nowrap text-sm font-medium text-neutral-900">
                        {user.is_anonymous ? (
                          <span className="text-neutral-400 italic">
                            Anonymous
                          </span>
                        ) : (
                          user.name || "No Name"
                        )}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap text-sm text-neutral-500">
                        {user.is_anonymous ? (
                          <span className="text-neutral-400 italic">
                            &mdash;
                          </span>
                        ) : (
                          user.email || "No Email"
                        )}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap text-sm">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-accent-50 text-accent-700">
                          {user.chat_count}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap text-sm">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-50 text-primary-700">
                          {user.message_count}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap text-sm text-neutral-500">
                        {formatDate(user.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {filteredUsers.length > 0 && totalPages > 1 && (
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm text-neutral-500">
              {indexOfFirstUser + 1}–{Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length}
            </p>

            <nav className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-2.5 py-1.5 text-sm rounded-md text-neutral-600 hover:bg-neutral-100 disabled:text-neutral-300 disabled:hover:bg-transparent transition-colors"
              >
                Previous
              </button>

              {getPageNumbers().map((page, index) =>
                page === "..." ? (
                  <span key={`ellipsis-${index}`} className="px-2 text-sm text-neutral-400">
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page as number)}
                    className={`w-8 h-8 text-sm rounded-md transition-colors ${
                      currentPage === page
                        ? "bg-primary-600 text-white"
                        : "text-neutral-600 hover:bg-neutral-100"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-2.5 py-1.5 text-sm rounded-md text-neutral-600 hover:bg-neutral-100 disabled:text-neutral-300 disabled:hover:bg-transparent transition-colors"
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}
