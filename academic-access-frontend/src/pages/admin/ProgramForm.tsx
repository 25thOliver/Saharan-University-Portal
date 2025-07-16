import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiService } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader, Save, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProgramFormState {
  programCode: string;
  programTitle: string;
}

const ProgramForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const isEdit = Boolean(id);
  const [form, setForm] = useState<ProgramFormState>({ programCode: '', programTitle: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (isEdit && id) {
      fetchProgram(Number(id));
    }
  }, [isEdit, id]);

  const fetchProgram = async (programId: number) => {
    setIsLoading(true);
    try {
      const data = await apiService.getProgramById(programId);
      setForm({
        programCode: data.programCode || '',
        programTitle: data.programTitle || ''
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch program',
        variant: 'destructive',
      });
      navigate('/admin/programs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.programCode.trim() || !form.programTitle.trim()) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    try {
      if (isEdit && id) {
        await apiService.updateProgram(Number(id), form);
        toast({ title: 'Success', description: 'Program updated successfully' });
      } else {
        await apiService.createProgram(form);
        toast({ title: 'Success', description: 'Program created successfully' });
      }
      navigate('/admin/programs');
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save program',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate('/admin/programs')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold text-foreground">
          {isEdit ? 'Edit Program' : 'Add New Program'}
        </h1>
      </div>
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>{isEdit ? 'Edit Program' : 'Add New Program'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="programCode" className="block mb-1 font-medium">Program Code *</label>
              <Input
                id="programCode"
                name="programCode"
                value={form.programCode}
                onChange={handleChange}
                disabled={isLoading}
                required
                placeholder="e.g., BSC-CS"
              />
            </div>
            <div>
              <label htmlFor="programTitle" className="block mb-1 font-medium">Program Title *</label>
              <Input
                id="programTitle"
                name="programTitle"
                value={form.programTitle}
                onChange={handleChange}
                disabled={isLoading}
                required
                placeholder="e.g., BSc Computer Science"
              />
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

export default ProgramForm; 