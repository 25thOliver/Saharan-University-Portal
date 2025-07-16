import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { apiService } from "@/lib/api";
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  User, 
  FileText,
  GraduationCap,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

interface Course {
  id: number;
  courseCode: string;
  courseTitle: string;
  programTitle: string;
  units: Unit[];
  enrolledAt: string;
}

interface Unit {
  id: number;
  code: string;
  title: string;
}

export default function StudentCoursesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  useEffect(() => {
    loadStudentCourses();
  }, []);

  const loadStudentCourses = async () => {
    setLoading(true);
    try {
      const enrollments = await apiService.getEnrollmentsByStudent(user?.id || 0);
      const courseData = enrollments.map((enrollment: any) => ({
        id: enrollment.program.id,
        courseCode: enrollment.program.programCode,
        courseTitle: enrollment.program.programTitle,
        programTitle: enrollment.program.programTitle,
        units: enrollment.program.courses || [],
        enrolledAt: enrollment.enrolledAt
      }));
      setCourses(courseData);
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEnrollmentStatus = (enrolledAt: string) => {
    const enrollmentDate = new Date(enrolledAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - enrollmentDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 30) {
      return { status: 'Recent', color: 'bg-green-100 text-green-800' };
    } else if (diffDays <= 90) {
      return { status: 'Active', color: 'bg-blue-100 text-blue-800' };
    } else {
      return { status: 'Ongoing', color: 'bg-yellow-100 text-yellow-800' };
    }
  };

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
        <h1 className="text-2xl font-bold mb-2">My Courses</h1>
        <p className="text-gray-600">View your enrolled courses and academic progress</p>
      </div>

      {courses.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Courses Enrolled</h3>
          <p className="text-gray-600 mb-4">You haven't enrolled in any courses yet.</p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
            Browse Available Courses
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Course List */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Enrolled Courses ({courses.length})</h2>
            {courses.map((course) => {
              const enrollmentStatus = getEnrollmentStatus(course.enrolledAt);
              return (
                <div
                  key={course.id}
                  className={`bg-white rounded-lg shadow p-6 cursor-pointer transition-all hover:shadow-md ${
                    selectedCourse?.id === course.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedCourse(course)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <BookOpen className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{course.courseTitle}</h3>
                        <p className="text-sm text-gray-600">{course.courseCode}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${enrollmentStatus.color}`}>
                      {enrollmentStatus.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Enrolled: {new Date(course.enrolledAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span>{course.units.length} units</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Course Details */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Course Details</h2>
            {selectedCourse ? (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <GraduationCap className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{selectedCourse.courseTitle}</h3>
                      <p className="text-gray-600">{selectedCourse.courseCode}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Program</p>
                      <p className="font-medium">{selectedCourse.programTitle}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Units</p>
                      <p className="font-medium">{selectedCourse.units.length}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Enrollment Date</p>
                      <p className="font-medium">{new Date(selectedCourse.enrolledAt).toLocaleDateString()}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Status</p>
                      <p className="font-medium text-green-600">Active</p>
                    </div>
                  </div>
                </div>

                {/* Units */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Course Units
                  </h4>
                  {selectedCourse.units.length > 0 ? (
                    <div className="space-y-2">
                      {selectedCourse.units.map((unit) => (
                        <div key={unit.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{unit.title}</p>
                            <p className="text-sm text-gray-600">{unit.code}</p>
                          </div>
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No units available for this course</p>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold mb-3">Quick Actions</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">View Materials</span>
                    </button>
                    <button className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">Schedule</span>
                    </button>
                    <button className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <User className="h-4 w-4" />
                      <span className="text-sm">Instructor</span>
                    </button>
                    <button className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-sm">Report Issue</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Course</h3>
                <p className="text-gray-600">Choose a course from the list to view detailed information</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 