import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader, ArrowLeft, Plus, Save, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Program {
  id: number;
  programCode: string;
  programTitle: string;
}

interface Course {
  id: number;
  courseCode: string;
  courseTitle: string;
}

interface Trimester {
  id: number;
  name: string;
  academicYear: string;
  period: string;
  periodType: string;
  minimumCourses: number;
  maximumCourses: number;
}

interface CourseToAdd {
  courseId: number;
  courseCode: string;
  courseTitle: string;
  creditHours: number;
  isCore: boolean;
  prerequisites: string;
}

export const TrimesterCourseManagement: React.FC = () => {
  const [selectedProgramId, setSelectedProgramId] = useState<string>('');
  const [selectedTrimesterId, setSelectedTrimesterId] = useState<string>('');
  const [programs, setPrograms] = useState<Program[]>([]);
  const [trimesters, setTrimesters] = useState<Trimester[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesToAdd, setCoursesToAdd] = useState<CourseToAdd[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingCourses, setExistingCourses] = useState<Course[]>([]);
  const [isLoadingExisting, setIsLoadingExisting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchPrograms();
    fetchTrimesters();
    fetchCourses();
  }, []);

  const fetchPrograms = async () => {
    try {
      const data = await apiService.getAllPrograms();
      setPrograms(Array.isArray(data) ? data : []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch programs',
        variant: 'destructive',
      });
    }
  };

  const fetchTrimesters = async () => {
    try {
      const data = await apiService.getAllTrimesters();
      setTrimesters(Array.isArray(data) ? data : []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch trimesters',
        variant: 'destructive',
      });
    }
  };

  const fetchCourses = async () => {
    try {
      const data = await apiService.getAllCourses();
      console.log('Fetched courses:', data);
      setCourses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch courses',
        variant: 'destructive',
      });
    }
  };

  const addCourseToList = () => {
    if (coursesToAdd.length >= 10) {
      toast({
        title: 'Limit Reached',
        description: 'Maximum 10 courses can be added at once',
        variant: 'destructive',
      });
      return;
    }

    const newCourse: CourseToAdd = {
      courseId: 0,
      courseCode: '',
      courseTitle: '',
      creditHours: 3,
      isCore: true,
      prerequisites: '',
    };

    setCoursesToAdd([...coursesToAdd, newCourse]);
  };

  const removeCourseFromList = (index: number) => {
    setCoursesToAdd(coursesToAdd.filter((_, i) => i !== index));
  };

  const updateCourseInList = (index: number, field: keyof CourseToAdd, value: any) => {
    console.log('updateCourseInList called:', { index, field, value });
    setCoursesToAdd(prevCourses => {
      const updatedCourses = [...prevCourses];
      updatedCourses[index] = { ...updatedCourses[index], [field]: value };
      console.log('Updated coursesToAdd:', updatedCourses);
      return updatedCourses;
    });
  };

  // Add useEffect to monitor state changes
  useEffect(() => {
    console.log('coursesToAdd state changed:', coursesToAdd);
  }, [coursesToAdd]);

  const handleCourseSelection = (index: number, courseId: number) => {
    console.log('handleCourseSelection called:', { index, courseId });
    const selectedCourse = courses.find(c => c.id === courseId);
    console.log('selectedCourse found:', selectedCourse);
    if (selectedCourse) {
      // Update all fields atomically in a single state update
      setCoursesToAdd(prevCourses => {
        const updatedCourses = [...prevCourses];
        updatedCourses[index] = {
          ...updatedCourses[index],
          courseId: courseId,
          courseCode: selectedCourse.courseCode,
          courseTitle: selectedCourse.courseTitle
        };
        console.log('Course updated atomically for index:', index, 'New course:', updatedCourses[index]);
        return updatedCourses;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Submit button clicked');
    console.log('Selected Program ID:', selectedProgramId);
    console.log('Selected Trimester ID:', selectedTrimesterId);
    console.log('Courses to add:', coursesToAdd);
    
    if (!selectedProgramId || !selectedTrimesterId) {
      console.log('Validation failed: Missing program or trimester selection');
      toast({
        title: 'Validation Error',
        description: 'Please select both program and trimester',
        variant: 'destructive',
      });
      return;
    }

    if (coursesToAdd.length === 0) {
      console.log('Validation failed: No courses added');
      toast({
        title: 'Validation Error',
        description: 'Please add at least one course',
        variant: 'destructive',
      });
      return;
    }

    // Validate that all courses have required fields
    const invalidCourses = coursesToAdd.filter(c => c.courseId <= 0 || c.creditHours <= 0);
    if (invalidCourses.length > 0) {
      console.log('Validation failed: Invalid courses found:', invalidCourses);
      toast({
        title: 'Validation Error',
        description: 'Please select a course and ensure credit hours are greater than 0 for all courses',
        variant: 'destructive',
      });
      return;
    }

    console.log('Validation passed, starting submission...');
    setIsSubmitting(true);
    
    try {
      let successCount = 0;
      let skippedCount = 0;
      let errorCount = 0;
      // Add each course to the program for the selected trimester
      for (const courseToAdd of coursesToAdd) {
        console.log('Adding course:', courseToAdd);
        try {
          await apiService.addCourseToProgram(
            parseInt(selectedProgramId),
            courseToAdd.courseId,
            parseInt(selectedTrimesterId),
            courseToAdd.creditHours,
            courseToAdd.isCore,
            courseToAdd.prerequisites
          );
          successCount++;
          console.log(`Successfully added course: ${courseToAdd.courseTitle}`);
        } catch (error: any) {
          if (error.message && error.message.includes('already added')) {
            console.log(`Course already exists: ${courseToAdd.courseTitle}`);
            skippedCount++;
          } else {
            console.error(`Error adding course ${courseToAdd.courseTitle}:`, error);
            errorCount++;
          }
        }
      }
      
      // Show summary toast
      let message = '';
      if (successCount > 0) {
        message += `${successCount} course(s) added successfully. `;
      }
      if (skippedCount > 0) {
        message += `${skippedCount} course(s) were already added. `;
      }
      if (errorCount > 0) {
        message += `${errorCount} course(s) failed to add.`;
      }
      
      if (successCount > 0) {
        toast({
          title: 'Success',
          description: message,
        });
      } else if (skippedCount > 0) {
        toast({
          title: 'Info',
          description: message,
        });
      } else {
        toast({
          title: 'Error',
          description: message,
          variant: 'destructive',
        });
      }
      
      // Reset form only if some courses were successfully added
      if (successCount > 0) {
        setCoursesToAdd([]);
        setSelectedProgramId('');
        setSelectedTrimesterId('');
      }
    } catch (error) {
      console.error('Error adding courses:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to add courses',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const checkExistingCourses = async () => {
    if (!selectedProgramId || !selectedTrimesterId) return;
    
    setIsLoadingExisting(true);
    try {
      const data = await apiService.getCoursesByTrimester(parseInt(selectedTrimesterId));
      const existingCourseIds = data.map((pc: any) => pc.course.id);
      const existing = courses.filter(c => existingCourseIds.includes(c.id));
      setExistingCourses(existing);
      console.log('Existing courses in trimester:', existing);
    } catch (error) {
      console.error('Error fetching existing courses:', error);
    } finally {
      setIsLoadingExisting(false);
    }
  };

  // Check existing courses when program or trimester changes
  useEffect(() => {
    checkExistingCourses();
  }, [selectedProgramId, selectedTrimesterId]);

  const selectedTrimester = trimesters.find(t => t.id === parseInt(selectedTrimesterId));

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => navigate('/admin/courses')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Courses
        </Button>
        <h1 className="text-3xl font-bold text-foreground">Manage Trimester Courses</h1>
      </div>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Add Courses to Trimester/Semester</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Program and Trimester Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="program">Program *</Label>
                <Select value={selectedProgramId} onValueChange={setSelectedProgramId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a program" />
                  </SelectTrigger>
                  <SelectContent>
                    {programs.map((program) => (
                      <SelectItem key={program.id} value={program.id.toString()}>
                        {program.programCode} - {program.programTitle}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="trimester">Trimester/Semester *</Label>
                <Select value={selectedTrimesterId} onValueChange={setSelectedTrimesterId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a trimester/semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {trimesters.map((trimester) => (
                      <SelectItem key={trimester.id} value={trimester.id.toString()}>
                        {trimester.name} - {trimester.academicYear} ({trimester.periodType})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Trimester Info */}
            {selectedTrimester && (
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Trimester Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Period:</span> {selectedTrimester.period}
                  </div>
                  <div>
                    <span className="font-medium">Academic Year:</span> {selectedTrimester.academicYear}
                  </div>
                  <div>
                    <span className="font-medium">Minimum Courses:</span> {selectedTrimester.minimumCourses}
                  </div>
                  <div>
                    <span className="font-medium">Maximum Courses:</span> {selectedTrimester.maximumCourses}
                  </div>
                </div>
              </div>
            )}

            {/* Debug Information */}
            {coursesToAdd.length > 0 && (
              <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Debug Info</h3>
                <div className="text-xs font-mono">
                  <div>Total courses: {coursesToAdd.length}</div>
                  <div>Available courses: {courses.length}</div>
                  {courses.length === 0 && (
                    <div className="text-red-600 font-bold">⚠️ No courses available in database!</div>
                  )}
                  {coursesToAdd.map((course, index) => (
                    <div key={index} className="mt-1">
                      Course {index + 1}: ID={course.courseId}, Code={course.courseCode}, Title={course.courseTitle}, Credits={course.creditHours}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Validation Summary */}
            {coursesToAdd.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">Validation Status</h3>
                <div className="space-y-1 text-sm">
                  <div className={`flex items-center gap-2 ${selectedProgramId ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedProgramId ? '✓' : '✗'} Program selected
                  </div>
                  <div className={`flex items-center gap-2 ${selectedTrimesterId ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedTrimesterId ? '✓' : '✗'} Trimester selected
                  </div>
                  <div className={`flex items-center gap-2 ${coursesToAdd.length > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {coursesToAdd.length > 0 ? '✓' : '✗'} {coursesToAdd.length} course(s) added
                  </div>
                  {coursesToAdd.length > 0 && (
                    <div className={`flex items-center gap-2 ${
                      coursesToAdd.every(c => c.courseId > 0 && c.creditHours > 0) ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {coursesToAdd.every(c => c.courseId > 0 && c.creditHours > 0) ? '✓' : '✗'} All courses have valid data
                    </div>
                  )}
                </div>
                {coursesToAdd.some(c => c.courseId <= 0 || c.creditHours <= 0) && (
                  <p className="text-red-600 text-sm mt-2">
                    Please fix the validation errors above before submitting.
                  </p>
                )}
              </div>
            )}

            {/* Course List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Courses to Add</h3>
                <Button
                  type="button"
                  onClick={addCourseToList}
                  disabled={coursesToAdd.length >= 10}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Course
                </Button>
              </div>

              {coursesToAdd.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No courses added yet. Click "Add Course" to get started.
                </div>
              ) : (
                <div className="space-y-4">
                  {coursesToAdd.map((courseToAdd, index) => (
                    <Card key={`course-${index}-${courseToAdd.courseId}`} className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium">Course {index + 1}</h4>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeCourseFromList(index)}
                          className="gap-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Course *</Label>
                          <Select 
                            value={courseToAdd.courseId > 0 ? courseToAdd.courseId.toString() : ""} 
                            onValueChange={(value) => handleCourseSelection(index, parseInt(value))}
                          >
                            <SelectTrigger className={courseToAdd.courseId <= 0 ? "border-red-500" : ""}>
                              <SelectValue placeholder="Select a course" />
                            </SelectTrigger>
                            <SelectContent>
                              {courses.map((course) => (
                                <SelectItem key={course.id} value={course.id.toString()}>
                                  {course.courseCode} - {course.courseTitle}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {courseToAdd.courseId <= 0 && (
                            <p className="text-sm text-red-500">Please select a course</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`creditHours-${index}`}>Credit Hours *</Label>
                          <Input
                            id={`creditHours-${index}`}
                            type="number"
                            min="1"
                            max="6"
                            value={courseToAdd.creditHours}
                            onChange={(e) => updateCourseInList(index, 'creditHours', parseInt(e.target.value) || 3)}
                            className={courseToAdd.creditHours <= 0 ? "border-red-500" : ""}
                          />
                          {courseToAdd.creditHours <= 0 && (
                            <p className="text-sm text-red-500">Credit hours must be greater than 0</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`prerequisites-${index}`}>Prerequisites</Label>
                          <Input
                            id={`prerequisites-${index}`}
                            value={courseToAdd.prerequisites}
                            onChange={(e) => updateCourseInList(index, 'prerequisites', e.target.value)}
                            placeholder="e.g., CS101, MATH201"
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 mt-4">
                        <Checkbox
                          id={`isCore-${index}`}
                          checked={courseToAdd.isCore}
                          onCheckedChange={(checked) => updateCourseInList(index, 'isCore', checked)}
                        />
                        <Label htmlFor={`isCore-${index}`}>Core Course</Label>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting || coursesToAdd.length === 0}
                className="gap-2"
                onClick={() => {
                  console.log('Button clicked!');
                  console.log('isSubmitting:', isSubmitting);
                  console.log('coursesToAdd.length:', coursesToAdd.length);
                  console.log('selectedProgramId:', selectedProgramId);
                  console.log('selectedTrimesterId:', selectedTrimesterId);
                }}
              >
                {isSubmitting ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {isSubmitting ? 'Adding Courses...' : `Add ${coursesToAdd.length} Course(s)`}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/courses')}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Existing Courses Info */}
      {selectedProgramId && selectedTrimesterId && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">Existing Courses in Trimester</h3>
          {isLoadingExisting ? (
            <div className="flex items-center gap-2 text-sm text-yellow-700">
              <Loader className="h-4 w-4 animate-spin" />
              Loading existing courses...
            </div>
          ) : existingCourses.length === 0 ? (
            <p className="text-sm text-yellow-700">No courses have been added to this trimester yet.</p>
          ) : (
            <div className="space-y-1">
              <p className="text-sm text-yellow-700 mb-2">
                The following courses are already added to this trimester:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {existingCourses.map((course) => (
                  <div key={course.id} className="text-sm bg-yellow-100 px-2 py-1 rounded-md">
                    {course.courseCode} - {course.courseTitle}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}; 