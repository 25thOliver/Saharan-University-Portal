import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiService } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader, ArrowLeft, Save } from 'lucide-react';
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
  program: {
    id: number;
    programCode: string;
    programTitle: string;
  };
}

export const CourseEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [courseCode, setCourseCode] = useState('');
  const [courseTitle, setCourseTitle] = useState('');
  const [selectedProgramId, setSelectedProgramId] = useState<string>('');
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchCourse(parseInt(id));
      fetchPrograms();
    }
  }, [id]);

  const fetchCourse = async (courseId: number) => {
    setIsFetching(true);
    try {
      const course = await apiService.getCourseById(courseId);
      setCourseCode(course.courseCode || '');
      setCourseTitle(course.courseTitle || '');
      setSelectedProgramId(course.program?.id?.toString() || '');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch course details',
        variant: 'destructive',
      });
      navigate('/admin/courses');
    } finally {
      setIsFetching(false);
    }
  };

  const fetchPrograms = async () => {
    setIsLoading(true);
    try {
      const data = await apiService.getAllPrograms();
      setPrograms(Array.isArray(data) ? data : []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch programs',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!courseCode.trim() || !courseTitle.trim() || !selectedProgramId) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await apiService.updateCourse(parseInt(id!), {
        courseCode: courseCode.trim(),
        courseTitle: courseTitle.trim(),
        program: { id: parseInt(selectedProgramId) }
      });
      
      toast({
        title: 'Success',
        description: 'Course updated successfully',
      });
      
      navigate('/admin/courses');
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update course',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2 text-primary">
          <Loader className="h-6 w-6 animate-spin" />
          <span>Loading course details...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => navigate('/admin/courses')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Courses
        </Button>
        <h1 className="text-3xl font-bold text-foreground">Edit Course</h1>
      </div>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Course Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="courseCode">Course Code *</Label>
              <Input
                id="courseCode"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                placeholder="e.g., CS101, MATH201"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="courseTitle">Course Title *</Label>
              <Input
                id="courseTitle"
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                placeholder="e.g., Introduction to Computer Science"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="program">Program *</Label>
              <Select value={selectedProgramId} onValueChange={setSelectedProgramId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a program" />
                </SelectTrigger>
                <SelectContent>
                  {isLoading ? (
                    <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
                      <Loader className="h-4 w-4 animate-spin" />
                      Loading programs...
                    </div>
                  ) : programs.length === 0 ? (
                    <div className="px-3 py-2 text-sm text-muted-foreground">
                      No programs available
                    </div>
                  ) : (
                    programs.map((program) => (
                      <SelectItem key={program.id} value={program.id.toString()}>
                        {program.programCode} - {program.programTitle}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="gap-2"
              >
                {isSubmitting ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {isSubmitting ? 'Updating...' : 'Update Course'}
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
    </div>
  );
}; 