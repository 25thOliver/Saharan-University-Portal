import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { apiService } from "@/lib/api";
import { 
  X, 
  BookOpen, 
  CheckCircle, 
  AlertTriangle, 
  Info,
  GraduationCap,
  Calendar,
  Clock,
  Plus,
  Minus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Program {
  id: number;
  programCode: string;
  programTitle: string;
}

interface Trimester {
  id: number;
  name: string;
  academicYear: string;
  period: string;
  periodType: string;
  minimumCourses: number;
  maximumCourses: number;
  startDate: string;
  endDate: string;
}

interface ProgramCourse {
  id: number;
  course: {
    id: number;
    courseCode: string;
    courseTitle: string;
  };
  creditHours: number;
  isCore: boolean;
  prerequisites?: string;
}

interface EnrollmentRequestModalProps {
  program: Program;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EnrollmentRequestModal({ 
  program, 
  isOpen, 
  onClose, 
  onSuccess 
}: EnrollmentRequestModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [trimesters, setTrimesters] = useState<Trimester[]>([]);
  const [selectedTrimester, setSelectedTrimester] = useState<Trimester | null>(null);
  const [availableCourses, setAvailableCourses] = useState<ProgramCourse[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadTrimesters();
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedTrimester) {
      loadAvailableCourses();
    }
  }, [selectedTrimester]);

  const loadTrimesters = async () => {
    setLoading(true);
    try {
      const data = await apiService.getActiveTrimesters();
      setTrimesters(data);
    } catch (error) {
      console.error('Error loading trimesters:', error);
      toast({
        title: "Error",
        description: "Failed to load available trimesters",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableCourses = async () => {
    if (!selectedTrimester) return;
    
    try {
      const data = await apiService.getCoursesByProgramAndTrimester(program.id, selectedTrimester.id);
      setAvailableCourses(data);
      setSelectedCourses([]); // Reset selections
    } catch (error) {
      console.error('Error loading courses:', error);
      toast({
        title: "Error",
        description: "Failed to load available courses",
        variant: "destructive",
      });
    }
  };

  const handleCourseToggle = (courseId: number) => {
    setSelectedCourses(prev => {
      if (prev.includes(courseId)) {
        return prev.filter(id => id !== courseId);
      } else {
        // Check if adding this course would exceed maximum
        if (prev.length >= (selectedTrimester?.maximumCourses || 10)) {
          toast({
            title: "Course Limit Reached",
            description: `You can select a maximum of ${selectedTrimester?.maximumCourses} courses for ${selectedTrimester?.periodType.toLowerCase()}`,
            variant: "destructive",
          });
          return prev;
        }
        return [...prev, courseId];
      }
    });
  };

  const getSelectedCoursesData = () => {
    return availableCourses.filter(course => selectedCourses.includes(course.id));
  };

  const getTotalCreditHours = () => {
    return getSelectedCoursesData().reduce((total, course) => total + course.creditHours, 0);
  };

  const canSubmit = () => {
    if (!selectedTrimester) return false;
    if (selectedCourses.length < selectedTrimester.minimumCourses) return false;
    if (selectedCourses.length > selectedTrimester.maximumCourses) return false;
    return true;
  };

  const handleSubmit = async () => {
    if (!user?.id || !selectedTrimester || !canSubmit()) return;

    setSubmitting(true);
    try {
      // Create enrollment request with course selections
      await apiService.createEnrollmentRequestWithCourses(
        user.id, 
        program.id, 
        selectedTrimester.id, 
        selectedCourses
      );
      
      toast({
        title: "Success",
        description: "Enrollment request submitted successfully!",
      });
      
      onSuccess();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit enrollment request",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-bold">Request Enrollment</h2>
            <p className="text-gray-600">{program.programTitle} ({program.programCode})</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Step 1: Select Study Period */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Step 1: Select Study Period
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {trimesters.map((trimester) => (
                    <div
                      key={trimester.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedTrimester?.id === trimester.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedTrimester(trimester)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{trimester.name}</h3>
                        <Badge variant={trimester.periodType === 'TRIMESTER' ? 'default' : 'secondary'}>
                          {trimester.periodType}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{trimester.academicYear}</p>
                      <div className="text-xs text-gray-500 space-y-1">
                        <div>Courses: {trimester.minimumCourses} - {trimester.maximumCourses}</div>
                        <div>Period: {trimester.period}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Step 2: Select Courses */}
          {selectedTrimester && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Step 2: Select Courses
                </CardTitle>
                <div className="text-sm text-gray-600">
                  {selectedTrimester.periodType === 'TRIMESTER' 
                    ? `Select ${selectedTrimester.minimumCourses}-${selectedTrimester.maximumCourses} courses for trimester study`
                    : `Select ${selectedTrimester.minimumCourses}-${selectedTrimester.maximumCourses} courses for semester study`
                  }
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Course Selection Summary */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Selected Courses: {selectedCourses.length}</span>
                      <span className="text-sm text-gray-600">
                        Total Credits: {getTotalCreditHours()}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className={`flex items-center gap-1 ${
                        selectedCourses.length >= selectedTrimester.minimumCourses 
                          ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {selectedCourses.length >= selectedTrimester.minimumCourses ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <AlertTriangle className="h-4 w-4" />
                        )}
                        Minimum: {selectedTrimester.minimumCourses}
                      </span>
                      <span className={`flex items-center gap-1 ${
                        selectedCourses.length <= selectedTrimester.maximumCourses 
                          ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {selectedCourses.length <= selectedTrimester.maximumCourses ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <AlertTriangle className="h-4 w-4" />
                        )}
                        Maximum: {selectedTrimester.maximumCourses}
                      </span>
                    </div>
                  </div>

                  {/* Available Courses */}
                  <div className="space-y-2">
                    <h4 className="font-medium">Available Courses</h4>
                    {availableCourses.map((course) => (
                      <div
                        key={course.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                          selectedCourses.includes(course.id)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleCourseToggle(course.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h5 className="font-medium">{course.course.courseTitle}</h5>
                              {course.isCore && (
                                <Badge variant="outline" className="text-xs">
                                  Core
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-60">{course.course.courseCode}</p>
                            {course.prerequisites && (
                              <p className="text-xs text-gray-500">
                                Prerequisites: {course.prerequisites}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">{course.creditHours} Credits</div>
                            {selectedCourses.includes(course.id) && (
                              <CheckCircle className="h-4 w-4 text-blue-600 ml-2" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submit Button */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!canSubmit() || submitting}
              className="min-w-[120px]"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                "Submit Request"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 