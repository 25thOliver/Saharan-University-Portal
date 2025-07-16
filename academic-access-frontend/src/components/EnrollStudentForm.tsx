import React, { useEffect, useState } from "react";
import axios from "axios";
import { apiService } from '@/lib/api';

interface EnrollStudentFormProps {
  onEnrollSuccess?: () => void;
}

export default function EnrollStudentForm({ onEnrollSuccess }: EnrollStudentFormProps) {
  const [students, setStudents] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch students and programs using apiService to include Authorization header
    apiService.getAllStudents().then(data => {
      console.log("Fetched students:", data);
      setStudents(data);
    });
    apiService.getAllPrograms().then(data => {
      console.log("Fetched programs:", data);
      setPrograms(data);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        "/api/enrollments",
        null,
        {
          params: {
            studentId: selectedStudent,
            programId: selectedProgram
          },
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setMessage("Enrollment successful!");
      if (onEnrollSuccess) onEnrollSuccess();
    } catch (err) {
      setMessage(
        err.response?.data || "Enrollment failed. Please check your input."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Enroll Student in Program</h2>
      <div className="mb-4">
        <label className="block mb-1">Student:</label>
        <select
          value={selectedStudent}
          onChange={e => setSelectedStudent(e.target.value)}
          required
          className="w-full border rounded px-2 py-1"
        >
          <option value="">Select student</option>
          {(Array.isArray(students) ? students : []).map((s: any) => (
            <option key={s.id} value={s.id}>
              {/* Fallback to registrationNumber if fullName is missing */}
              {(s.fullName || s.firstName || s.registrationNumber || "Unknown Student")} {s.registrationNumber ? `(${s.registrationNumber})` : ""}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-1">Program:</label>
        <select
          value={selectedProgram}
          onChange={e => setSelectedProgram(e.target.value)}
          required
          className="w-full border rounded px-2 py-1"
        >
          <option value="">Select program</option>
          {(Array.isArray(programs) ? programs : []).map((p: any) => (
            <option key={p.id} value={p.id}>
              {(p.programTitle || p.programCode || "Unknown Program")} {p.programCode ? `(${p.programCode})` : ""}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        disabled={!selectedStudent || !selectedProgram}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Enroll
      </button>
      {message && <div className="mt-4 text-center">{message}</div>}
    </form>
  );
} 