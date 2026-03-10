import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  LogOut,
  Filter,
  Eye,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import {
  isAdminLoggedIn,
  clearAdminSession,
  getAllComplaints,
  getComplaintStats,
  updateComplaintStatus,
  Complaint,
  ComplaintStatus,
} from "../utils/storage";
import { getCategoryDisplayName } from "../utils/classifier";
import {
  getEmergencyLevelBadgeColor,
  getEmergencyLevelLabel,
  getPriorityBadgeColor,
} from "../utils/priority";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [filterStatus, setFilterStatus] = useState<ComplaintStatus | "all">("all");

  useEffect(() => {
    // Check authentication
    if (!isAdminLoggedIn()) {
      navigate("/admin/login");
      return;
    }

    loadComplaints();
  }, []);

  const loadComplaints = () => {
    const allComplaints = getAllComplaints();
    setComplaints(allComplaints);
  };

  const handleLogout = () => {
    clearAdminSession();
    toast.success("Logged out successfully");
    navigate("/admin/login");
  };

  const handleUpdateStatus = (id: string, newStatus: ComplaintStatus) => {
    const success = updateComplaintStatus(id, newStatus);
    if (success) {
      toast.success("Status updated successfully");
      loadComplaints();
      if (selectedComplaint?.id === id) {
        const updated = complaints.find((c) => c.id === id);
        if (updated) {
          setSelectedComplaint({ ...updated, status: newStatus });
        }
      }
    } else {
      toast.error("Failed to update status");
    }
  };

  const stats = getComplaintStats();

  const filteredComplaints =
    filterStatus === "all"
      ? complaints
      : complaints.filter((c) => c.status === filterStatus);

  // Chart data
  const categoryData = Object.entries(stats.byCategory).map(([name, value]) => ({
    name: getCategoryDisplayName(name as any).split(" ")[0],
    count: value,
  }));

  const statusData = Object.entries(stats.byStatus).map(([name, value]) => ({
    name: name.replace("_", " "),
    count: value,
  }));

  const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Complaints</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-orange-600 mt-1">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Resolved</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{stats.resolved}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">High Priority</p>
                <p className="text-3xl font-bold text-red-600 mt-1">
                  {stats.byPriority.high || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Complaints by Category
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#4F46E5" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Status Distribution
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, count }) => `${name}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Complaints Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">All Complaints</h2>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-600" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="submitted">Submitted</option>
                  <option value="under_review">Under Review</option>
                  <option value="in_process">In Process</option>
                  <option value="resolved">Resolved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Passenger
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Airline
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Emergency
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredComplaints.map((complaint) => (
                  <tr key={complaint.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {complaint.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {complaint.passengerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {complaint.airline}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getCategoryDisplayName(complaint.complaintType)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full text-white ${getPriorityBadgeColor(complaint.priority)}`}
                      >
                        {complaint.priority.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full text-white ${getEmergencyLevelBadgeColor(
                          complaint.emergencyLevel
                        )}`}
                      >
                        L{complaint.emergencyLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={complaint.status}
                        onChange={(e) =>
                          handleUpdateStatus(complaint.id, e.target.value as ComplaintStatus)
                        }
                        className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="submitted">Submitted</option>
                        <option value="under_review">Under Review</option>
                        <option value="in_process">In Process</option>
                        <option value="resolved">Resolved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => setSelectedComplaint(complaint)}
                        className="text-indigo-600 hover:text-indigo-900 flex items-center space-x-1"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredComplaints.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No complaints found
              </div>
            )}
          </div>
        </div>
      </div>

      {/* View Complaint Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  Complaint Details
                </h3>
                <button
                  onClick={() => setSelectedComplaint(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Complaint ID:</span>
                  <p className="font-medium">{selectedComplaint.id}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Status:</span>
                  <p className="font-medium capitalize">{selectedComplaint.status}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Passenger Name:</span>
                  <p className="font-medium">{selectedComplaint.passengerName}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Email:</span>
                  <p className="font-medium">{selectedComplaint.email}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Phone:</span>
                  <p className="font-medium">{selectedComplaint.phone || "N/A"}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">PNR:</span>
                  <p className="font-medium">{selectedComplaint.pnr || "N/A"}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Flight Number:</span>
                  <p className="font-medium">{selectedComplaint.flightNumber || "N/A"}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Airline:</span>
                  <p className="font-medium">{selectedComplaint.airline}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Route:</span>
                  <p className="font-medium">
                    {selectedComplaint.source} → {selectedComplaint.destination}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Date of Travel:</span>
                  <p className="font-medium">
                    {selectedComplaint.dateOfTravel
                      ? new Date(selectedComplaint.dateOfTravel).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Category:</span>
                  <p className="font-medium">
                    {getCategoryDisplayName(selectedComplaint.complaintType)}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Priority:</span>
                  <p className="font-medium capitalize">{selectedComplaint.priority}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Emergency Level:</span>
                  <p className="font-medium">
                    {selectedComplaint.emergencyLevel} -{" "}
                    {getEmergencyLevelLabel(selectedComplaint.emergencyLevel)}
                  </p>
                </div>
              </div>

              <div>
                <span className="text-sm text-gray-600">Description:</span>
                <p className="mt-1 text-gray-900">{selectedComplaint.description}</p>
              </div>

              {selectedComplaint.ocrData && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <span className="text-sm font-semibold text-gray-900">OCR Extracted Data:</span>
                  <p className="mt-1 text-sm text-gray-700 whitespace-pre-line">
                    {selectedComplaint.ocrData}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Submitted:</span>
                  <p className="font-medium">
                    {new Date(selectedComplaint.submittedAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Last Updated:</span>
                  <p className="font-medium">
                    {new Date(selectedComplaint.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setSelectedComplaint(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
