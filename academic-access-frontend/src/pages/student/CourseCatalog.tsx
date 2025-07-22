import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { apiService } from "@/lib/api";
import { 
  BookOpen, 
  Search, 
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info
} from "lucide-react";
import EnrollmentRequestModal from "@/components/EnrollmentRequestModal";

interface Program {
  id: number;
  programCode: string;
  programTitle: string;
  courses: Course[];
}

interface Course {
  id: number;
  courseCode: string;
  courseTitle: string;
}

interface EnrollmentRequest {
  id: number;
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

export default function CourseCatalogPage() {
  const { user } = useAuth();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [enrollmentRequests, setEnrollmentRequests] = useState<EnrollmentRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load available programs
      const programsData = await apiService.getAllPrograms();
      setPrograms(Array.isArray(programsData) ? programsData : []);

      // Load student's enrollment requests
      const requestsData = await apiService.getEnrollmentRequestsByStudent(user?.id || 0);
      setEnrollmentRequests(Array.isArray(requestsData) ? requestsData : []);
    } catch (error) {
      console.error('Error loading data:', error);
      setPrograms([]); // fallback to empty array on error
      setEnrollmentRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollmentRequest = (program: Program) => {
    setSelectedProgram(program);
    setShowEnrollmentModal(true);
  };

  const handleEnrollmentSuccess = () => {
    loadData(); // Reload data to show updated enrollment requests
  };

  const getRequestStatus = (programId: number) => {
    const request = enrollmentRequests.find(req => req.program.id === programId);
    return request;
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
        return <Info className="h-4 w-4 text-gray-500" />;
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

  const filteredPrograms = programs.filter(program =>
    program.programTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.programCode.toLowerCase().includes(searchTerm.toLowerCase())
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
        <h1 className="text-2xl font-bold mb-2">Course Catalog</h1>
        <p className="text-gray-600">Browse available programs and request enrollment</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search programs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Programs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPrograms.map((program) => {
          const request = getRequestStatus(program.id);
          const isRequesting = request?.status === 'PENDING';
          
          return (
            <div
              key={program.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{program.programTitle}</h3>
                    <p className="text-sm text-gray-600">{program.programCode}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-sm text-gray-600">
                  <p><strong>Courses:</strong> {program.courses?.length || 0}</p>
                </div>

                {/* Request Status */}
                {request && (
                  <div className="flex items-center gap-2">
                    {getStatusIcon(request.status)}
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                    {request.status === 'REJECTED' && (
                      <span className="text-xs text-orange-600 bg-orange-50 px-2 rounded-full">
                        You can reapply
                      </span>
                    )}
                  </div>
                )}

                {/* Admin Notes */}
                {request?.adminNotes && (
                  <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                    <strong>Admin Notes:</strong> {request.adminNotes}
                  </div>
                )}

                {/* Action Button */}
                <div className="pt-2">
                  {request && request.status === 'PENDING' ? (
                    <div className="text-sm text-gray-500">
                      Request pending approval
                    </div>
                  ) : request && request.status === 'APPROVED' ? (
                    <div className="text-sm text-green-600">✓ Request approved</div>
                  ) : (
                    <button
                      onClick={() => handleEnrollmentRequest(program)}
                      className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      Request Enrollment
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredPrograms.length === 0 && (
        <div className="text-center py-8">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No programs found</h3>
          <p className="text-gray-600">Try adjusting your search terms</p>
        </div>
      )}

      {/* Enrollment Requests Summary */}
      {enrollmentRequests.length > 0 && (
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Your Enrollment Requests</h2>
          <div className="space-y-3">
            {enrollmentRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(request.status)}
                  <div>
                    <p className="font-medium">{request.program.programTitle}</p>
                    <p className="text-sm text-gray-600">{request.program.programCode}</p>
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
            ))}
          </div>
        </div>
      )}

      {selectedProgram && (
        <EnrollmentRequestModal
          program={selectedProgram}
          isOpen={showEnrollmentModal}
          onClose={() => setShowEnrollmentModal(false)}
          onSuccess={handleEnrollmentSuccess}
        />
      )}
    </div>
  );
} 