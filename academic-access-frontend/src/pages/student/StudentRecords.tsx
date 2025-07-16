import React, { useEffect, useState } from "react";
import { FileText, Download, Award } from "lucide-react";
import { apiService } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export default function StudentRecordsPage() {
  const { user } = useAuth();
  const [transcript, setTranscript] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadingCert, setDownloadingCert] = useState(false);

  useEffect(() => {
    setLoading(true);
    apiService.getTranscriptMe()
      .then(setTranscript)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleDownloadTranscript = async () => {
    setDownloading(true);
    try {
      const blob = await apiService.downloadTranscriptPdfMe();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'transcript.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      alert('Failed to download transcript PDF');
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadCertificate = async () => {
    setDownloadingCert(true);
    try {
      const blob = await apiService.downloadCertificatePdfMe();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'certificate.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      alert('Failed to download certificate PDF');
    } finally {
      setDownloadingCert(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Academic Records</h1>
        <p className="text-gray-600">Access your academic records, transcripts, and certificates</p>
      </div>
      <div className="bg-white rounded-lg shadow p-8">
        {loading ? (
          <div className="text-center text-gray-500">Loading transcript...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : transcript ? (
          <>
            <div className="mb-4">
              <div className="font-semibold text-lg">Transcript</div>
              <div className="text-gray-700 mb-2">{transcript.studentName} ({transcript.registrationNumber})</div>
              <div className="text-gray-700 mb-2">Program: {transcript.programTitle}</div>
              <div className="text-gray-700 mb-2">GPA: {transcript.gpa !== null ? transcript.gpa.toFixed(2) : 'N/A'}</div>
              <div className="overflow-x-auto">
                <table className="min-w-full mt-4 border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 border">Course Code</th>
                      <th className="px-4 py-2 border">Course Title</th>
                      <th className="px-4 py-2 border">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transcript.courses.map((c: any, idx: number) => (
                      <tr key={idx}>
                        <td className="px-4 py-2 border">{c.courseCode}</td>
                        <td className="px-4 py-2 border">{c.courseTitle}</td>
                        <td className="px-4 py-2 border">{c.grade}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <Button onClick={handleDownloadTranscript} disabled={downloading} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                {downloading ? 'Downloading...' : 'Download Transcript PDF'}
              </Button>
              <Button onClick={handleDownloadCertificate} disabled={downloadingCert} variant="outline">
                <Award className="h-4 w-4 mr-2" />
                {downloadingCert ? 'Downloading...' : 'Download Certificate PDF'}
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500">No transcript data available.</div>
        )}
      </div>
    </div>
  );
} 