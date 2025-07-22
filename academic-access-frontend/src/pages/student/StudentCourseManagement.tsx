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
  AlertTriangle,
  Plus,
  Minus,
  Info,
  Trash2,
  Edit3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface CourseEnrollment {
  id: number;
  enrolledAt: string;
  status: string;
  grade?: string;
  score?: number;
  isActive: boolean;
  programCourse: {
    id: number;
    creditHours: number;
    isCore: boolean;
    prerequisites?: string;
    course: {
      id: number;
      courseCode: string;
      courseTitle: string;
    };
    trimester: {
      id: number;
      name: string;
      academicYear: string;
      period: string;
      periodType: string;
      minimumCourses: number;
      maximumCourses: number;
    };
  };
}

interface TrimesterSummary {
  trimesterId: number;
  trimesterName: string;
  academicYear: string;
  periodType: string;
  minimumCourses: number;
  maximumCourses: number;
  enrolledCourses: CourseEnrollment[];
  totalCreditHours: number;
}

export default function StudentCourseManagementPage() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [trimesterSummaries, setTrimesterSummaries] = useState<TrimesterSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTrimester, setSelectedTrimester] = useState<TrimesterSummary | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadStudentEnrollments();
  }, []);

  const loadStudentEnrollments = async () => {
    setLoading(true);
    try {
      const data = await apiService.getStudentCourseEnrollments(user?.id || 0);
      setEnrollments(data);
      
      // Group enrollments by trimester
      const trimesterMap = new Map<number, TrimesterSummary>();
      
      data.forEach((enrollment: CourseEnrollment) => {
        const trimester = enrollment.programCourse.trimester;
        const trimesterId = trimester.id;
        
        if (!trimesterMap.has(trimesterId)) {
          trimesterMap.set(trimesterId, {
            trimesterId,
            trimesterName: trimester.name,
            academicYear: trimester.academicYear,
            periodType: trimester.periodType,
            minimumCourses: trimester.minimumCourses,
            maximumCourses: trimester.maximumCourses,
            enrolledCourses: [],
            totalCreditHours: 0
          });
        }
        
        const summary = trimesterMap.get(trimesterId)!;
        summary.enrolledCourses.push(enrollment);
        summary.totalCreditHours += enrollment.programCourse.creditHours;
      });
      
      setTrimesterSummaries(Array.from(trimesterMap.values()));
    } catch (error) {
      console.error('Error loading enrollments:', error);
      toast({
        title: "Error",
        description: "Failed to load your course enrollments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTrimesterStatus = (summary: TrimesterSummary) => {
    const courseCount = summary.enrolledCourses.length;
    
    if (courseCount < summary.minimumCourses) {
      return {
        status: 'Below Minimum',
        color: 'bg-red-100 text-red-800',
        icon: AlertTriangle,
        description: `You need at least ${summary.minimumCourses} courses`
      };
    } else if (courseCount === summary.minimumCourses) {
      return {
        status: 'Minimum Load',
        color: 'bg-yellow-100 text-yellow-800',
        icon: Info,
        description: `You have the minimum required courses`
      };
    } else if (courseCount <= summary.maximumCourses) {
      return {
        status: 'Optimal Load',
        color: 'bg-green-100 text-green-800',
        icon: CheckCircle,
        description: `You have ${courseCount} courses enrolled`
      };
    } else {
      return {
        status: 'Over Maximum',
        color: 'bg-red-100 text-red-800',
        icon: AlertTriangle,
        description: `You have exceeded the maximum of ${summary.maximumCourses} courses`
      };
    }
  };

  const handleDropCourse = async (enrollmentId: number, courseTitle: string) => {
    if (!confirm(`Are you sure you want to drop "${courseTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await apiService.dropCourseEnrollment(enrollmentId);
      toast({
        title: "Success",
        description: `Successfully dropped ${courseTitle}`,
      });
      loadStudentEnrollments(); // Reload data
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to drop course",
        variant: "destructive",
      });
    }
  };

  const canDropCourse = (summary: TrimesterSummary) => {
    return summary.enrolledCourses.length > summary.minimumCourses;
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
        <h1 className="text-2xl font-bold">My Course Management</h1>
        <p className="text-gray-600">View and manage your course enrollments by trimester</p>
      </div>

      {trimesterSummaries.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Course Enrollments</h3>
          <p className="text-gray-600 mb-4">You haven't enrolled in any courses yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Trimester Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trimesterSummaries.map((summary) => {
              const status = getTrimesterStatus(summary);
              const StatusIcon = status.icon;
              
              return (
                <Card 
                  key={summary.trimesterId}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedTrimester?.trimesterId === summary.trimesterId ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedTrimester(summary)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <StatusIcon className="h-5 w-5 text-gray-600" />
                        <CardTitle className="text-lg">{summary.trimesterName}</CardTitle>
                      </div>
                      <Badge className={status.color}>
                        {status.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{summary.academicYear} - {summary.periodType}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Courses:</span>
                        <span className="font-medium">
                          {summary.enrolledCourses.length} / {summary.maximumCourses}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Credit Hours:</span>
                        <span className="font-medium">{summary.totalCreditHours}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        {status.description}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Selected Trimester Details */}
          {selectedTrimester && (
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">{selectedTrimester.trimesterName}</CardTitle>
                    <p className="text-gray-600">
                      {selectedTrimester.academicYear} - {selectedTrimester.periodType}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      {selectedTrimester.enrolledCourses.length}
                    </div>
                    <div className="text-sm text-gray-500">Courses</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Course List */}
                  <div className="space-y-3">
                    {selectedTrimester.enrolledCourses.map((enrollment) => (
                      <div 
                        key={enrollment.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <BookOpen className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {enrollment.programCourse.course.courseTitle}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {enrollment.programCourse.course.courseCode}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-sm font-medium">
                              {enrollment.programCourse.creditHours} Credits
                            </div>
                            <div className="text-xs text-gray-500">
                              {enrollment.programCourse.isCore ? 'Core' : 'Elective'}
                            </div>
                          </div>
                          
                          {enrollment.grade && (
                            <Badge variant="outline">
                              Grade: {enrollment.grade}
                            </Badge>
                          )}
                          
                          {canDropCourse(selectedTrimester) && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDropCourse(enrollment.id, enrollment.programCourse.course.courseTitle);
                              }}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Course Load Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Course Load Information</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Minimum Required:</span>
                        <span className="font-medium ml-2">{selectedTrimester.minimumCourses} courses</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Maximum Allowed:</span>
                        <span className="font-medium ml-2">{selectedTrimester.maximumCourses} courses</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Currently Enrolled:</span>
                        <span className="font-medium ml-2">{selectedTrimester.enrolledCourses.length} courses</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Total Credits:</span>
                        <span className="font-medium ml-2">{selectedTrimester.totalCreditHours}</span>
                      </div>
                    </div>
                    
                    {selectedTrimester.enrolledCourses.length > selectedTrimester.minimumCourses && (
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                        <div className="flex items-center gap-2 text-blue-800">
                          <Info className="h-4 w-4" />
                          <span className="text-sm font-medium">Course Reduction Available</span>
                        </div>
                        <p className="text-sm text-blue-700 mt-1">
                          You can reduce your course load to {selectedTrimester.minimumCourses} courses if needed. 
                          Use the drop button next to any course to remove it from your enrollment.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
} 