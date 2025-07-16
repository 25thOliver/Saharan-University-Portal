import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  Calendar, 
  Phone, 
  MapPin, 
  GraduationCap,
  Shield,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-hero rounded-lg p-6 text-primary-foreground shadow-medium">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/10 rounded-full">
            {isAdmin ? (
              <Shield className="h-8 w-8" />
            ) : (
              <GraduationCap className="h-8 w-8" />
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold">
              Welcome back, {user.firstName}!
            </h1>
            <p className="text-primary-foreground/80 mt-1">
              {isAdmin ? 'Admin Dashboard' : 'Student Dashboard'}
            </p>
          </div>
        </div>
      </div>

      {/* Profile Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Basic Info Card */}
        <Card className="shadow-soft">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Full Name</p>
              <p className="font-medium">{user.firstName} {user.lastName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Registration Number</p>
              <div className="flex items-center gap-2">
                <p className="font-medium font-mono">{user.registrationNumber}</p>
                <Badge variant={isAdmin ? "default" : "secondary"}>
                  {user.role}
                </Badge>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">User ID</p>
              <p className="font-medium text-muted-foreground">#{user.id}</p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Info Card */}
        <Card className="shadow-soft">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Email Address</p>
              <p className="font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone Number</p>
              <p className="font-medium">
                {user.phoneNumber || (
                  <span className="text-muted-foreground italic">Not provided</span>
                )}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Address</p>
              <p className="font-medium">
                {user.address || (
                  <span className="text-muted-foreground italic">Not provided</span>
                )}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Academic Info Card */}
        <Card className="shadow-soft">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Academic Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Date of Birth</p>
              <p className="font-medium">{formatDate(user.dateOfBirth)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Enrollment Date</p>
              <p className="font-medium">{formatDate(user.enrollmentDate)}</p>
            </div>
            {!isAdmin && (
              <div className="pt-2">
                <Badge variant="outline" className="text-success border-success">
                  Active Student
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div
              className="p-4 border border-border rounded-lg hover:shadow-soft transition-all duration-200 cursor-pointer"
              onClick={() => navigate(isAdmin ? '/profile' : '/profile')}
            >
              <User className="h-6 w-6 text-primary mb-2" />
              <h3 className="font-medium">Update Profile</h3>
              <p className="text-sm text-muted-foreground">Change your personal information</p>
            </div>
            {!isAdmin && (
              <></>
            )}
            {isAdmin && (
              <>
                <div
                  className="p-4 border border-border rounded-lg hover:shadow-soft transition-all duration-200 cursor-pointer"
                  onClick={() => navigate('/admin/students')}
                >
                  <User className="h-6 w-6 text-primary mb-2" />
                  <h3 className="font-medium">Manage Students</h3>
                  <p className="text-sm text-muted-foreground">Add, edit, or remove students</p>
                </div>
                <div
                  className="p-4 border border-border rounded-lg hover:shadow-soft transition-all duration-200 cursor-pointer"
                  onClick={() => navigate('/admin/courses')}
                >
                  <Shield className="h-6 w-6 text-primary mb-2" />
                  <h3 className="font-medium">Admin Tools</h3>
                  <p className="text-sm text-muted-foreground">Access administrative functions</p>
                </div>
                <div
                  className="p-4 border border-border rounded-lg hover:shadow-soft transition-all duration-200 cursor-pointer"
                  onClick={() => navigate('/admin/enrollments')}
                >
                  <GraduationCap className="h-6 w-6 text-primary mb-2" />
                  <h3 className="font-medium">Enroll Students</h3>
                  <p className="text-sm text-muted-foreground">Enroll students in courses</p>
                </div>
              </>
            )}
            <div
              className="p-4 border border-border rounded-lg hover:shadow-soft transition-all duration-200 cursor-pointer"
              onClick={() => navigate('/support')}
            >
              <Mail className="h-6 w-6 text-primary mb-2" />
              <h3 className="font-medium">Support</h3>
              <p className="text-sm text-muted-foreground">Get help or contact support</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};