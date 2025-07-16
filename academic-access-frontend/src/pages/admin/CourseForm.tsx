import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiService } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader, Save, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProgramOption {
  id: number;
  programCode: string;
  programTitle: string;
}

interface CourseFormState {
  courseCode: string;
  courseTitle: string;
  programId: string;
}

export const CourseForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const isEdit = Boolean(id);
  const [form, setForm] = useState<CourseFormState>({ courseCode: '', courseTitle: '', programId: '' });
  const [programs, setPrograms] = useState<ProgramOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    apiService.getAllPrograms().then(setPrograms);
    if (isEdit && id) {
      fetchCourse(Number(id));
    }
  }, [isEdit, id]);

  const fetchCourse = async (courseId: number) => {
    setIsLoading(true);
    try {
      const data = await apiService.getCourseById(courseId);
      setForm({
        courseCode: data.courseCode || '',
        courseTitle: data.courseTitle || '',
        programId: data.program?.id ? String(data.program.id) : ''
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch course',
        variant: 'destructive',
      });
      navigate('/admin/courses');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.courseCode.trim() || !form.courseTitle.trim() || !form.programId) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    const payload = {
      courseCode: form.courseCode.trim(),
      courseTitle: form.courseTitle.trim(),
      program: { id: Number(form.programId) }
    };
    try {
      if (isEdit && id) {
        await apiService.updateCourse(Number(id), payload);
        toast({ title: 'Success', description: 'Course updated successfully' });
      } else {
        await apiService.createCourse(payload);
        toast({ title: 'Success', description: 'Course created successfully' });
      }
      navigate('/admin/courses');
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save course',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate('/admin/courses')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold text-foreground">
          {isEdit ? 'Edit Course' : 'Add New Course'}
        </h1>
      </div>
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>{isEdit ? 'Edit Course' : 'Add New Course'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="courseCode" className="block mb-1 font-medium">Course Code *</label>
              <Input
                id="courseCode"
                name="courseCode"
                value={form.courseCode}
                onChange={handleChange}
                disabled={isLoading}
                required
                placeholder="e.g., CS101"
              />
            </div>
            <div>
              <label htmlFor="courseTitle" className="block mb-1 font-medium">Course Title *</label>
              <Input
                id="courseTitle"
                name="courseTitle"
                value={form.courseTitle}
                onChange={handleChange}
                disabled={isLoading}
                required
                placeholder="e.g., BSc Computer Science"
              />
            </div>
            <div>
              <label htmlFor="programId" className="block mb-1 font-medium">Program *</label>
              <select
                id="programId"
                name="programId"
                value={form.programId}
                onChange={handleChange}
                disabled={isLoading}
                required
                className="w-full border rounded px-2 py-1"
              >
                <option value="">Select program</option>
                {programs.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.programTitle} ({p.programCode})
                  </option>
                ))}
              </select>
            </div>
            <Button type="submit" variant="premium" className="w-full" disabled={isLoading}>
              {isLoading ? <><Loader className="h-4 w-4 animate-spin" /> Saving...</> : <><Save className="h-4 w-4" /> Save</>}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}; 