import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { Search, CheckCircle, Clock, AlertCircle, XCircle, FileText } from "lucide-react";
import { getComplaintById, Complaint } from "../utils/storage";
import { getCategoryDisplayName } from "../utils/classifier";
import {
  getEmergencyLevelBadgeColor,
  getEmergencyLevelLabel,
  getPriorityBadgeColor,
} from "../utils/priority";

export default function TrackComplaint() {
  const [searchParams] = useSearchParams();
  const [complaintId, setComplaintId] = useState(searchParams.get("id") || "");
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      handleSearch(id);
    }
  }, [searchParams]);

  const handleSearch = (id?: string) => {
    const searchId = id || complaintId;
    if (!searchId.trim()) return;

    const result = getComplaintById(searchId.trim());
    if (result) {
      setComplaint(result);
      setNotFound(false);
    } else {
      setComplaint(null);
      setNotFound(true);
    }
  };

  const getStatusIcon = (status: Complaint["status"]) => {
    switch (status) {
      case "submitted":
        return <FileText className="h-6 w-6 text-blue-600" />;
      case "under_review":
        return <Search className="h-6 w-6 text-yellow-600" />;
      case "in_process":
        return <Clock className="h-6 w-6 text-orange-600" />;
      case "resolved":
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case "rejected":
        return <XCircle className="h-6 w-6 text-red-600" />;
    }
  };

  const getStatusColor = (status: Complaint["status"]) => {
    switch (status) {
      case "submitted":
        return "bg-blue-50 border-blue-200 text-blue-700";
      case "under_review":
        return "bg-yellow-50 border-yellow-200 text-yellow-700";
      case "in_process":
        return "bg-orange-50 border-orange-200 text-orange-700";
      case "resolved":
        return "bg-green-50 border-green-200 text-green-700";
      case "rejected":
        return "bg-red-50 border-red-200 text-red-700";
    }
  };

  const getStatusLabel = (status: Complaint["status"]) => {
    switch (status) {
      case "submitted":
        return "Submitted";
      case "under_review":
        return "Under Review";
      case "in_process":
        return "In Process";
      case "resolved":
        return "Resolved";
      case "rejected":
        return "Rejected";
    }
  };

  const getProgressPercentage = (status: Complaint["status"]) => {
    switch (status) {
      case "submitted":
        return 25;
      case "under_review":
        return 50;
      case "in_process":
        return 75;
      case "resolved":
      case "rejected":
        return 100;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Track Your Complaint</h1>

        {/* Search Box */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter Complaint ID
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={complaintId}
              onChange={(e) => setComplaintId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="e.g., FH123ABC456"
            />
            <button
              onClick={() => handleSearch()}
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center space-x-2"
            >
              <Search className="h-4 w-4" />
              <span>Search</span>
            </button>
          </div>
        </div>

        {/* Not Found Message */}
        {notFound && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900">Complaint Not Found</p>
              <p className="text-sm text-red-700">
                No complaint found with ID "{complaintId}". Please check the ID and try
                again.
              </p>
            </div>
          </div>
        )}

        {/* Complaint Details */}
        {complaint && (
          <div className="space-y-6">
            {/* Status Header */}
            <div
              className={`p-6 rounded-lg border-2 ${getStatusColor(complaint.status)}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(complaint.status)}
                  <div>
                    <h2 className="text-xl font-bold">
                      Status: {getStatusLabel(complaint.status)}
                    </h2>
                    <p className="text-sm">Complaint ID: {complaint.id}</p>
                  </div>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${getPriorityBadgeColor(complaint.priority)}`}
                >
                  {complaint.priority.toUpperCase()} PRIORITY
                </div>
              </div>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span>Passenger emergency level</span>
                <span
                  className={`px-3 py-1 rounded-full text-white font-semibold ${getEmergencyLevelBadgeColor(
                    complaint.emergencyLevel
                  )}`}
                >
                  LEVEL {complaint.emergencyLevel} -{" "}
                  {getEmergencyLevelLabel(complaint.emergencyLevel).toUpperCase()}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1">
                  <span>Progress</span>
                  <span>{getProgressPercentage(complaint.status)}%</span>
                </div>
                <div className="w-full bg-white bg-opacity-50 rounded-full h-2">
                  <div
                    className="bg-current h-2 rounded-full transition-all duration-500"
                    style={{ width: `${getProgressPercentage(complaint.status)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-4">Status Timeline</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      complaint.status === "submitted" ||
                      complaint.status === "under_review" ||
                      complaint.status === "in_process" ||
                      complaint.status === "resolved" ||
                      complaint.status === "rejected"
                        ? "bg-green-500 text-white"
                        : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Submitted</p>
                    <p className="text-sm text-gray-600">
                      {new Date(complaint.submittedAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      complaint.status === "under_review" ||
                      complaint.status === "in_process" ||
                      complaint.status === "resolved" ||
                      complaint.status === "rejected"
                        ? "bg-green-500 text-white"
                        : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    <Search className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Under Review</p>
                    <p className="text-sm text-gray-600">
                      {complaint.status !== "submitted"
                        ? "Complaint is being reviewed"
                        : "Pending"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      complaint.status === "in_process" ||
                      complaint.status === "resolved" ||
                      complaint.status === "rejected"
                        ? "bg-green-500 text-white"
                        : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    <Clock className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">In Process</p>
                    <p className="text-sm text-gray-600">
                      {complaint.status === "in_process" ||
                      complaint.status === "resolved" ||
                      complaint.status === "rejected"
                        ? "Being processed"
                        : "Pending"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      complaint.status === "resolved"
                        ? "bg-green-500 text-white"
                        : complaint.status === "rejected"
                        ? "bg-red-500 text-white"
                        : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    {complaint.status === "resolved" ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : complaint.status === "rejected" ? (
                      <XCircle className="h-4 w-4" />
                    ) : (
                      <Clock className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">
                      {complaint.status === "resolved"
                        ? "Resolved"
                        : complaint.status === "rejected"
                        ? "Rejected"
                        : "Resolution"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {complaint.status === "resolved" || complaint.status === "rejected"
                        ? new Date(complaint.updatedAt).toLocaleString()
                        : "Pending"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Complaint Details */}
            <div className="bg-white border border-gray-200 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-4">Complaint Details</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Passenger Name:</span>
                  <p className="font-medium">{complaint.passengerName}</p>
                </div>
                <div>
                  <span className="text-gray-600">Email:</span>
                  <p className="font-medium">{complaint.email}</p>
                </div>
                <div>
                  <span className="text-gray-600">PNR:</span>
                  <p className="font-medium">{complaint.pnr || "N/A"}</p>
                </div>
                <div>
                  <span className="text-gray-600">Flight:</span>
                  <p className="font-medium">
                    {complaint.flightNumber || "N/A"} ({complaint.airline})
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Route:</span>
                  <p className="font-medium">
                    {complaint.source} → {complaint.destination}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Date of Travel:</span>
                  <p className="font-medium">
                    {complaint.dateOfTravel
                      ? new Date(complaint.dateOfTravel).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Category:</span>
                  <p className="font-medium">
                    {getCategoryDisplayName(complaint.complaintType)}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Last Updated:</span>
                  <p className="font-medium">
                    {new Date(complaint.updatedAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Emergency Level:</span>
                  <p className="font-medium">
                    {complaint.emergencyLevel} - {getEmergencyLevelLabel(complaint.emergencyLevel)}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <span className="text-gray-600">Description:</span>
                <p className="mt-1 text-gray-900">{complaint.description}</p>
              </div>

              {complaint.adminNotes && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <span className="text-sm font-semibold text-blue-900">Admin Notes:</span>
                  <p className="mt-1 text-sm text-blue-800">{complaint.adminNotes}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
