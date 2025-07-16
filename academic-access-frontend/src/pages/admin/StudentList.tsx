import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '@/lib/api';
import { User } from '@/types/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Loader,
  Mail,
  Phone,
  Shield,
  User as UserIcon,
  Filter
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export const StudentList: React.FC = () => {
  const [students, setStudents] = useState<User[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    const filtered = students.filter(student =>
      (student.firstName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.lastName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.registrationNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [students, searchTerm]);

  const fetchStudents = async () => {
    try {
      const data = await apiService.getAllStudents();
      setStudents(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch students',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteStudent = async (id: number, name: string) => {
    setDeletingId(id);
    try {
      await apiService.deleteStudent(id);
      setStudents(prev => prev.filter(student => student.id !== id));
      toast({
        title: 'Success',
        description: `${name} has been deleted successfully`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete student',
        variant: 'destructive',
      });
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2 text-primary">
          <Loader className="h-6 w-6 animate-spin" />
          <span className="text-lg">Loading students...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-primary rounded-lg">
            <Users className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Student Management</h1>
            <p className="text-muted-foreground">Manage all registered students</p>
          </div>
        </div>
        <Button 
          onClick={() => navigate('/admin/students/create')}
          variant="premium"
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Student
        </Button>
      </div>

      {/* Search and Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="md:col-span-3">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students by name, registration number, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-secondary shadow-soft">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{students.length}</div>
            <div className="text-sm text-muted-foreground">Total Students</div>
          </CardContent>
        </Card>
      </div>

      {/* Students Grid */}
      {filteredStudents.length === 0 ? (
        <Card className="shadow-soft">
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {searchTerm ? 'No students found' : 'No students yet'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm 
                ? 'Try adjusting your search terms' 
                : 'Add your first student to get started'}
            </p>
            {!searchTerm && (
              <Button 
                onClick={() => navigate('/admin/students/create')}
                variant="premium"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Student
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredStudents.map((student) => (
            <Card key={student.id} className="shadow-soft hover:shadow-medium transition-all duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-primary rounded-lg">
                      {student.role === 'ADMIN' ? (
                        <Shield className="h-5 w-5 text-primary-foreground" />
                      ) : (
                        <UserIcon className="h-5 w-5 text-primary-foreground" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{student.firstName} {student.lastName}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-mono text-muted-foreground">
                          {student.registrationNumber}
                        </span>
                        <Badge variant={student.role === 'ADMIN' ? 'default' : 'secondary'}>
                          {student.role}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{student.email}</span>
                  </div>
                  
                  {student.phoneNumber && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{student.phoneNumber}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-border">
                  <div className="text-xs text-muted-foreground">
                    Enrolled: {formatDate(student.enrollmentDate)}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/admin/students/${student.id}`)}
                    className="flex-1"
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={deletingId === student.id}
                      >
                        {deletingId === student.id ? (
                          <Loader className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Student</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete <strong>{student.firstName} {student.lastName}</strong>? 
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteStudent(student.id, `${student.firstName} ${student.lastName}`)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};