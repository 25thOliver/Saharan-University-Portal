import React, { useEffect, useState } from "react";
import EnrollStudentForm from "../../components/EnrollStudentForm";
import EnrollmentList from "../../components/EnrollmentList";
import { apiService } from "@/lib/api";

export default function EnrollmentsPage() {
  const [report, setReport] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<'enroll' | 'list' | 'report'>('list');

  const fetchReport = () => {
    setLoading(true);
    apiService.getEnrollmentsByProgramReport()
      .then(setReport)
      .catch(e => setError(e.message || "Failed to load report"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handleEnrollSuccess = () => {
    fetchReport();
  };

  const handleUnenrollSuccess = () => {
    fetchReport();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin: Enrollment Management</h1>
      
      {/* Tab Navigation */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab('list')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'list'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          All Enrollments
        </button>
        <button
          onClick={() => setActiveTab('enroll')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'enroll'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Enroll Student
        </button>
        <button
          onClick={() => setActiveTab('report')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'report'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Enrollment Report
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'list' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">All Enrollments</h2>
          <EnrollmentList onUnenrollSuccess={handleUnenrollSuccess} />
        </div>
      )}

      {activeTab === 'enroll' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Enroll New Student</h2>
          <EnrollStudentForm onEnrollSuccess={handleEnrollSuccess} />
        </div>
      )}

      {activeTab === 'report' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Enrollments by Program</h2>
          {loading ? (
            <div>Loading report...</div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-4 py-2 text-left">Program Code</th>
                    <th className="border px-4 py-2 text-left">Program Title</th>
                    <th className="border px-4 py-2 text-left">Enrolled Students (Reg. Numbers)</th>
                  </tr>
                </thead>
                <tbody>
                  {report.map((row, idx) => (
                    <tr key={row.programCode || idx}>
                      <td className="border px-4 py-2">{row.programCode}</td>
                      <td className="border px-4 py-2">{row.programTitle}</td>
                      <td className="border px-4 py-2">
                        {row.studentRegistrationNumbers && row.studentRegistrationNumbers.length > 0 ? (
                          <ul className="list-disc pl-5">
                            {row.studentRegistrationNumbers.map((reg: string, i: number) => (
                              <li key={i}>{reg}</li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-gray-400">No students enrolled</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 