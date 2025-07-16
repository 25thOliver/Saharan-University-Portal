import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '@/lib/api';
import { User } from '@/types/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, Loader, User as UserIcon, Lock, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const StudentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchStudent(parseInt(id));
    }
  }, [id]);

  const fetchStudent = async (studentId: number) => {
    try {
      const data = await apiService.getStudentById(studentId);
      setStudent(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch student details',
        variant: 'destructive',
      });
      navigate('/admin/students');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!student || !newPassword.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a new password',
        variant: 'destructive',
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: 'Error',
        description: 'Password must be at least 6 characters long',
        variant: 'destructive',
      });
      return;
    }

    setIsResettingPassword(true);

    try {
      await apiService.resetStudentPassword(student.registrationNumber, {
        newPassword: newPassword.trim(),
      });

      toast({
        title: 'Success',
        description: `Password reset successfully for ${student.firstName} ${student.lastName}`,
      });

      setNewPassword('');
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to reset password',
        variant: 'destructive',
      });
    } finally {
      setIsResettingPassword(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2 text-primary">
          <Loader className="h-6 w-6 animate-spin" />
          <span className="text-lg">Loading student details...</span>
        </div>
      </div>
    );
  }

  if (!student) {
    return null;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate('/admin/students')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-primary rounded-lg">
            {student.role === 'ADMIN' ? (
              <Shield className="h-6 w-6 text-primary-foreground" />
            ) : (
              <UserIcon className="h-6 w-6 text-primary-foreground" />
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {student.firstName} {student.lastName}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-muted-foreground">{student.registrationNumber}</span>
              <Badge variant={student.role === 'ADMIN' ? 'default' : 'secondary'}>
                {student.role}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Student Information */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="h-5 w-5 text-primary" />
              Student Information
            </CardTitle>
            <CardDescription>
              Personal and academic details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="text-sm text-muted-foreground">First Name</Label>
                <p className="font-medium">{student.firstName}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Last Name</Label>
                <p className="font-medium">{student.lastName}</p>
              </div>
            </div>

            <div>
              <Label className="text-sm text-muted-foreground">Registration Number</Label>
              <p className="font-medium font-mono">{student.registrationNumber}</p>
            </div>

            <div>
              <Label className="text-sm text-muted-foreground">Email Address</Label>
              <p className="font-medium">{student.email}</p>
            </div>

            <div>
              <Label className="text-sm text-muted-foreground">Role</Label>
              <div className="flex items-center gap-2">
                <Badge variant={student.role === 'ADMIN' ? 'default' : 'secondary'}>
                  {student.role}
                </Badge>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="text-sm text-muted-foreground">Phone Number</Label>
                <p className="font-medium">
                  {student.phoneNumber || (
                    <span className="text-muted-foreground italic">Not provided</span>
                  )}
                </p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Date of Birth</Label>
                <p className="font-medium">{formatDate(student.dateOfBirth)}</p>
              </div>
            </div>

            <div>
              <Label className="text-sm text-muted-foreground">Address</Label>
              <p className="font-medium">
                {student.address || (
                  <span className="text-muted-foreground italic">Not provided</span>
                )}
              </p>
            </div>

            <div>
              <Label className="text-sm text-muted-foreground">Enrollment Date</Label>
              <p className="font-medium">{formatDate(student.enrollmentDate)}</p>
            </div>

            <div>
              <Label className="text-sm text-muted-foreground">Student ID</Label>
              <p className="font-medium text-muted-foreground">#{student.id}</p>
            </div>
          </CardContent>
        </Card>

        {/* Password Reset */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Reset Password
            </CardTitle>
            <CardDescription>
              Set a new password for this student
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isResettingPassword}
                placeholder="Enter new password (min 6 characters)"
                minLength={6}
              />
            </div>

            <Button
              onClick={handleResetPassword}
              disabled={isResettingPassword || !newPassword.trim()}
              className="w-full"
              variant="warning"
            >
              {isResettingPassword ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  Resetting Password...
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  Reset Password
                </>
              )}
            </Button>

            <div className="p-3 bg-warning/10 rounded-lg border border-warning/20">
              <p className="text-sm text-warning-foreground">
                <strong>Note:</strong> The student will need to use this new password to log in. 
                Make sure to communicate the new password securely.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};