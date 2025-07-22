import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import StudentDashboard from './pages/StudentDashboard';
import { StudentList } from './pages/admin/StudentList';
import ProgramList from './pages/admin/ProgramList';
import { CourseList } from './pages/admin/CourseList';
import { CourseCreate } from './pages/admin/CourseCreate';
import { CourseEdit } from './pages/admin/CourseEdit';
import { TrimesterCourseManagement } from './pages/admin/TrimesterCourseManagement';
import { TrimesterManagement } from './pages/admin/TrimesterManagement';
import EnrollmentsPage from './pages/admin/Enrollments';
import EnrollmentRequestsPage from './pages/admin/EnrollmentRequests';
import BulkOperationsPage from './pages/admin/BulkOperations';
import FeeManagementPage from './pages/admin/FeeManagement';
import StudentCourses from './pages/student/StudentCourses';
import CourseCatalog from './pages/student/CourseCatalog';
import StudentFees from './pages/student/StudentFees';
import StudentPayments from './pages/student/StudentPayments';
import StudentRecords from './pages/student/StudentRecords';
import { Profile } from './pages/Profile';
import { ProtectedRoute } from './components/ProtectedRoute';
import { StudentDetail } from './pages/admin/StudentDetail';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/student-dashboard" element={
            <ProtectedRoute>
              <Layout>
                <StudentDashboard />
              </Layout>
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin/students" element={
            <ProtectedRoute>
              <Layout>
                <StudentList />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/programs" element={
            <ProtectedRoute>
              <Layout>
                <ProgramList />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/courses" element={
            <ProtectedRoute>
              <Layout>
                <CourseList />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/admin/courses/create" element={
            <ProtectedRoute>
              <Layout>
                <CourseCreate />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/admin/courses/:id/edit" element={
            <ProtectedRoute>
              <Layout>
                <CourseEdit />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/admin/trimester-courses" element={
            <ProtectedRoute>
              <Layout>
                <TrimesterCourseManagement />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/admin/trimesters" element={
            <ProtectedRoute>
              <Layout>
                <TrimesterManagement />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/enrollments" element={
            <ProtectedRoute>
              <Layout>
                <EnrollmentsPage />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/enrollment-requests" element={
            <ProtectedRoute>
              <Layout>
                <EnrollmentRequestsPage />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/bulk-operations" element={
            <ProtectedRoute>
              <Layout>
                <BulkOperationsPage />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/fee-management" element={
            <ProtectedRoute>
              <Layout>
                <FeeManagementPage />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/students/:id" element={
            <ProtectedRoute>
              <Layout>
                <StudentDetail />
              </Layout>
            </ProtectedRoute>
          } />
          
          {/* Student Routes */}
          <Route path="/student/courses" element={
            <ProtectedRoute>
              <Layout>
                <StudentCourses />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/student/course-catalog" element={
            <ProtectedRoute>
              <Layout>
                <CourseCatalog />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/student/fees" element={
            <ProtectedRoute>
              <Layout>
                <StudentFees />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/student/payments" element={
            <ProtectedRoute>
              <Layout>
                <StudentPayments />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/student/records" element={
            <ProtectedRoute>
              <Layout>
                <StudentRecords />
              </Layout>
            </ProtectedRoute>
          } />
          
          {/* Common Routes */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
