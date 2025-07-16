import React, { useState } from "react";
import { apiService } from "@/lib/api";

export default function BulkOperationsPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [operationType, setOperationType] = useState<'import-students' | 'bulk-enroll' | 'export-students' | 'export-enrollments'>('export-students');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [error, setError] = useState("");

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError("");
    }
  };

  const handleExport = async () => {
    setLoading(true);
    setError("");
    setResults([]);

    try {
      let blob: Blob;
      let filename: string;

      if (operationType === 'export-students') {
        blob = await apiService.exportStudentsToCsv();
        filename = 'students_export.csv';
      } else {
        blob = await apiService.exportEnrollmentsToCsv();
        filename = 'enrollments_export.csv';
      }

      // Download the file
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setResults([`Successfully exported ${filename}`]);
    } catch (e: any) {
      setError(e.message || "Export failed");
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) {
      setError("Please select a file to upload");
      return;
    }

    setLoading(true);
    setError("");
    setResults([]);

    try {
      let importResults: string[];

      if (operationType === 'import-students') {
        importResults = await apiService.importStudentsFromCsv(selectedFile);
      } else {
        importResults = await apiService.bulkEnrollStudentsFromCsv(selectedFile);
      }

      setResults(importResults);
    } catch (e: any) {
      setError(e.message || "Import failed");
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = async () => {
    setLoading(true);
    setError("");

    try {
      let blob: Blob;
      let filename: string;

      if (operationType === 'import-students') {
        blob = await apiService.downloadStudentsCsvTemplate();
        filename = 'students_template.csv';
      } else {
        blob = await apiService.downloadEnrollmentsCsvTemplate();
        filename = 'enrollments_template.csv';
      }

      // Download the template
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (e: any) {
      setError(e.message || "Failed to download template");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin: Bulk Operations</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Export Data</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Export Type:</label>
            <select
              value={operationType}
              onChange={(e) => setOperationType(e.target.value as any)}
              className="w-full p-2 border rounded"
            >
              <option value="export-students">Export Students</option>
              <option value="export-enrollments">Export Enrollments</option>
            </select>
          </div>

          <button
            onClick={handleExport}
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white py-2 px-4 rounded"
          >
            {loading ? "Exporting..." : "Export to CSV"}
          </button>
        </div>

        {/* Import Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Import Data</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Import Type:</label>
            <select
              value={operationType}
              onChange={(e) => setOperationType(e.target.value as any)}
              className="w-full p-2 border rounded"
            >
              <option value="import-students">Import Students</option>
              <option value="bulk-enroll">Bulk Enroll Students</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Select CSV File:</label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="flex gap-2 mb-4">
            <button
              onClick={downloadTemplate}
              disabled={loading}
              className="flex-1 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white py-2 px-4 rounded"
            >
              Download Template
            </button>
            <button
              onClick={handleImport}
              disabled={loading || !selectedFile}
              className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white py-2 px-4 rounded"
            >
              {loading ? "Importing..." : "Import"}
            </button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {(results.length > 0 || error) && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Results</h2>
          
          {error && (
            <div className="text-red-600 mb-4">{error}</div>
          )}
          
          {results.length > 0 && (
            <div className="max-h-64 overflow-y-auto">
              {results.map((result, index) => (
                <div key={index} className={`py-1 ${result.startsWith('Error:') ? 'text-red-600' : 'text-green-600'}`}>
                  {result}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 bg-blue-50 p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-3">Instructions</h2>
        <div className="space-y-2 text-sm">
          <p><strong>Export:</strong> Download current data as CSV files for backup or analysis.</p>
          <p><strong>Import Students:</strong> Upload a CSV file with student information to create multiple students at once.</p>
          <p><strong>Bulk Enroll:</strong> Upload a CSV file with student registration numbers and program codes to enroll multiple students.</p>
          <p><strong>Templates:</strong> Download CSV templates to see the required format for imports.</p>
          <p className="text-red-600"><strong>Note:</strong> Imported students will have a default password of "password123".</p>
        </div>
      </div>
    </div>
  );
} 