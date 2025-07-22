import React, { useEffect, useState } from 'react';
import { apiService } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader, Plus, Edit3, Trash2, Calendar, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface Course {
  id: number;
  courseCode: string;
  courseTitle: string;
}

export const CourseList: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const data = await apiService.getAllCourses();
      console.log('Fetched courses:', data); // Debug log
      setCourses(Array.isArray(data) ? data : []);
    } catch (error) {
      setCourses([]); // Ensure it's always an array on error
      toast({
        title: 'Error',
        description: 'Failed to fetch courses',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await apiService.deleteCourse(id);
      setCourses(prev => prev.filter(course => course.id !== id));
      toast({
        title: 'Success',
        description: 'Course deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete course',
        variant: 'destructive',
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Courses</h1>
        <div className="flex gap-2">
          <Button onClick={() => navigate('/admin/trimesters')} variant="outline" className="gap-2">
            <Settings className="h-4 w-4" /> Manage Trimesters
          </Button>
          <Button onClick={() => navigate('/admin/trimester-courses')} variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" /> Manage Trimester Courses
          </Button>
          <Button onClick={() => navigate('/admin/courses/create')} variant="premium" className="gap-2">
            <Plus className="h-4 w-4" /> Add Course
          </Button>
        </div>
      </div>
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>All Courses</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center gap-2 text-primary">
              <Loader className="h-6 w-6 animate-spin" />
              <span>Loading courses...</span>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">No courses found.</div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-accent/30">
                  <th className="p-2 text-left">Code</th>
                  <th className="p-2 text-left">Title</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(courses) && courses.map(course => (
                  <tr key={course.id} className="border-b">
                    <td className="p-2 font-mono">{course.courseCode}</td>
                    <td className="p-2">{course.courseTitle}</td>
                    <td className="p-2 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/admin/courses/${course.id}/edit`)}
                        className="gap-1"
                      >
                        <Edit3 className="h-4 w-4" /> Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(course.id)}
                        disabled={deletingId === course.id}
                        className="gap-1"
                      >
                        {deletingId === course.id ? <Loader className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}; 