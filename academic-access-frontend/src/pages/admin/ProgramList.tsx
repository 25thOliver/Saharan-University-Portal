import React, { useEffect, useState } from 'react';
import { apiService } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader, Plus, Edit3, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface Program {
  id: number;
  programCode: string;
  programTitle: string;
}

const ProgramList: React.FC = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    setIsLoading(true);
    try {
      const data = await apiService.getAllPrograms();
      setPrograms(Array.isArray(data) ? data : []);
    } catch (error) {
      setPrograms([]);
      toast({
        title: 'Error',
        description: 'Failed to fetch programs',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await apiService.deleteProgram(id);
      setPrograms(prev => prev.filter(program => program.id !== id));
      toast({
        title: 'Success',
        description: 'Program deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete program',
        variant: 'destructive',
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Programs</h1>
        <Button onClick={() => navigate('/admin/programs/create')} variant="premium" className="gap-2">
          <Plus className="h-4 w-4" /> Add Program
        </Button>
      </div>
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>All Programs</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center gap-2 text-primary">
              <Loader className="h-6 w-6 animate-spin" />
              <span>Loading programs...</span>
            </div>
          ) : programs.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">No programs found.</div>
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
                {programs.map(program => (
                  <tr key={program.id} className="border-b">
                    <td className="p-2 font-mono">{program.programCode}</td>
                    <td className="p-2">{program.programTitle}</td>
                    <td className="p-2 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/admin/programs/${program.id}/edit`)}
                        className="gap-1"
                      >
                        <Edit3 className="h-4 w-4" /> Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(program.id)}
                        disabled={deletingId === program.id}
                        className="gap-1"
                      >
                        {deletingId === program.id ? <Loader className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
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

export default ProgramList; 