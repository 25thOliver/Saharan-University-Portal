import React, { useEffect, useState } from "react";
import { apiService } from "@/lib/api";

interface Enrollment {
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
  enrolledAt: string;
}

interface EnrollmentListProps {
  onUnenrollSuccess?: () => void;
}

export default function EnrollmentList({ onUnenrollSuccess }: EnrollmentListProps) {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [unenrollingId, setUnenrollingId] = useState<number | null>(null);

  const fetchEnrollments = () => {
    setLoading(true);
    apiService.getAllEnrollments()
      .then(setEnrollments)
      .catch(e => setError(e.message || "Failed to load enrollments"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const handleUnenroll = async (enrollmentId: number) => {
    if (!confirm("Are you sure you want to unenroll this student from the program?")) {
      return;
    }

    setUnenrollingId(enrollmentId);
    try {
      await apiService.deleteEnrollment(enrollmentId);
      setEnrollments(prev => prev.filter(e => e.id !== enrollmentId));
      onUnenrollSuccess?.();
    } catch (e: any) {
      setError(e.message || "Failed to unenroll student");
    } finally {
      setUnenrollingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return <div className="text-center py-4">Loading enrollments...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center py-4">{error}</div>;
  }

  if (enrollments.length === 0) {
    return <div className="text-center py-4 text-gray-500">No enrollments found.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2 text-left">Student Name</th>
            <th className="border px-4 py-2 text-left">Registration Number</th>
            <th className="border px-4 py-2 text-left">Program Code</th>
            <th className="border px-4 py-2 text-left">Program Title</th>
            <th className="border px-4 py-2 text-left">Enrolled Date</th>
            <th className="border px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {enrollments.map((enrollment) => (
            <tr key={enrollment.id}>
              <td className="border px-4 py-2">{enrollment.student.fullName}</td>
              <td className="border px-4 py-2">{enrollment.student.registrationNumber}</td>
              <td className="border px-4 py-2">{enrollment.program.programCode}</td>
              <td className="border px-4 py-2">{enrollment.program.programTitle}</td>
              <td className="border px-4 py-2">{formatDate(enrollment.enrolledAt)}</td>
              <td className="border px-4 py-2 text-center">
                <button
                  onClick={() => handleUnenroll(enrollment.id)}
                  disabled={unenrollingId === enrollment.id}
                  className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white px-3 py-1 rounded text-xs"
                >
                  {unenrollingId === enrollment.id ? "Unenrolling..." : "Unenroll"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 