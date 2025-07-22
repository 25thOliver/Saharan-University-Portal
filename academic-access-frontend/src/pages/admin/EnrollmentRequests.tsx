import React, { useState, useEffect } from "react";
import { apiService } from "@/lib/api";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Filter,
  Eye,
  Check,
  X
} from "lucide-react";

interface EnrollmentRequest {
  id: number;
  student: {
    id: number;
    registrationNumber: string;
    fullName: string;
  };
  program: {
    id: number;
    programCode: string;
    programTitle: string;
  };
  status: string;
  requestedAt: string;
  processedAt?: string;
  adminNotes?: string;
}

export default function EnrollmentRequestsPage() {
  const [requests, setRequests] = useState<EnrollmentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedRequest, setSelectedRequest] = useState<EnrollmentRequest | null>(null);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [adminNotes, setAdminNotes] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await apiService.getAllEnrollmentRequests();
      setRequests(data);
    } catch (error: any) {
      setError(error.message || "Failed to load enrollment requests");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId: number) => {
    if (!confirm("Are you sure you want to approve this enrollment request?")) {
      return;
    }

    setProcessingId(requestId);
    try {
      await apiService.approveEnrollmentRequest(requestId, adminNotes);
      await fetchRequests();
      setSelectedRequest(null);
      setAdminNotes("");
      alert("Enrollment request approved successfully!");
    } catch (error: any) {
      alert(error.message || "Failed to approve request");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (requestId: number) => {
    if (!confirm("Are you sure you want to reject this enrollment request?")) {
      return;
    }

    setProcessingId(requestId);
    try {
      await apiService.rejectEnrollmentRequest(requestId, adminNotes);
      await fetchRequests();
      setSelectedRequest(null);
      setAdminNotes("");
      alert("Enrollment request rejected successfully!");
    } catch (error: any) {
      alert(error.message || "Failed to reject request");
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'APPROVED':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'REJECTED':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRequests = requests.filter(request => 
    statusFilter === "ALL" || request.status === statusFilter
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Enrollment Requests</h1>
        <p className="text-gray-600">Manage student enrollment requests</p>
      </div>

      {/* Filter */}
      <div className="mb-6 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filter by status:</span>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-1 text-sm"
        >
          <option value="ALL">All Requests</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Requests List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Enrollment Requests ({filteredRequests.length})</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {filteredRequests.map((request) => (
                <div
                  key={request.id}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedRequest?.id === request.id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedRequest(request)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(request.status)}
                      <div>
                        <p className="font-medium text-gray-900">{request.student.fullName}</p>
                        <p className="text-sm text-gray-600">{request.student.registrationNumber}</p>
                        <p className="text-sm text-gray-600">{request.program.programTitle}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(request.requestedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {filteredRequests.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No enrollment requests found
              </div>
            )}
          </div>
        </div>

        {/* Request Details */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Request Details</h3>
            
            {selectedRequest ? (
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">Student Information</h4>
                  <p className="text-sm text-gray-600">Name: {selectedRequest.student.fullName}</p>
                  <p className="text-sm text-gray-600">Registration: {selectedRequest.student.registrationNumber}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">Program Information</h4>
                  <p className="text-sm text-gray-600">Program: {selectedRequest.program.programTitle}</p>
                  <p className="text-sm text-gray-600">Code: {selectedRequest.program.programCode}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">Request Information</h4>
                  <p className="text-sm text-gray-600">Status: {selectedRequest.status}</p>
                  <p className="text-sm text-gray-600">Requested: {new Date(selectedRequest.requestedAt).toLocaleString()}</p>
                  {selectedRequest.processedAt && (
                    <p className="text-sm text-gray-600">Processed: {new Date(selectedRequest.processedAt).toLocaleString()}</p>
                  )}
                </div>

                {selectedRequest.adminNotes && (
                  <div>
                    <h4 className="font-medium text-gray-900">Admin Notes</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{selectedRequest.adminNotes}</p>
                  </div>
                )}

                {selectedRequest.status === 'PENDING' && (
                  <div className="space-y-3 pt-4 border-t border-gray-200">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Admin Notes (Optional)
                      </label>
                      <textarea
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        rows={3}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Add notes about this request..."
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(selectedRequest.id)}
                        disabled={processingId === selectedRequest.id}
                        className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-3 py-2 rounded-md text-sm flex items-center justify-center gap-1"
                      >
                        {processingId === selectedRequest.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(selectedRequest.id)}
                        disabled={processingId === selectedRequest.id}
                        className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white px-3 py-2 rounded-md text-sm flex items-center justify-center gap-1"
                      >
                        {processingId === selectedRequest.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <X className="h-4 w-4" />
                        )}
                        Reject
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <Eye className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>Select a request to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 