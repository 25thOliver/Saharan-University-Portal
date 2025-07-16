import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Lock, 
  Save, 
  Eye, 
  EyeOff, 
  Loader,
  Shield
} from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  
  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  if (!user) return null;

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'New passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: 'Error',
        description: 'Password must be at least 6 characters long',
        variant: 'destructive',
      });
      return;
    }

    setIsChangingPassword(true);

    try {
      await apiService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      toast({
        title: 'Success',
        description: 'Password changed successfully',
      });

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to change password',
        variant: 'destructive',
      });
    } finally {
      setIsChangingPassword(false);
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

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-primary rounded-lg">
          <User className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your account information and security</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profile Information */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Profile Information
            </CardTitle>
            <CardDescription>
              Your personal and academic information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="text-sm text-muted-foreground">First Name</Label>
                <p className="font-medium">{user.firstName}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Last Name</Label>
                <p className="font-medium">{user.lastName}</p>
              </div>
            </div>

            <Separator />

            <div>
              <Label className="text-sm text-muted-foreground">Registration Number</Label>
              <div className="flex items-center gap-2">
                <p className="font-medium font-mono">{user.registrationNumber}</p>
                {user.role === 'ADMIN' && (
                  <Shield className="h-4 w-4 text-primary" />
                )}
              </div>
            </div>

            <div>
              <Label className="text-sm text-muted-foreground">Email Address</Label>
              <p className="font-medium">{user.email}</p>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="text-sm text-muted-foreground">Phone Number</Label>
                <p className="font-medium">
                  {user.phoneNumber || (
                    <span className="text-muted-foreground italic">Not provided</span>
                  )}
                </p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Date of Birth</Label>
                <p className="font-medium">{formatDate(user.dateOfBirth)}</p>
              </div>
            </div>

            <div>
              <Label className="text-sm text-muted-foreground">Address</Label>
              <p className="font-medium">
                {user.address || (
                  <span className="text-muted-foreground italic">Not provided</span>
                )}
              </p>
            </div>

            {user.enrollmentDate && (
              <>
                <Separator />
                <div>
                  <Label className="text-sm text-muted-foreground">Enrollment Date</Label>
                  <p className="font-medium">{formatDate(user.enrollmentDate)}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Change Password
            </CardTitle>
            <CardDescription>
              Update your password to keep your account secure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showPasswords.current ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({ 
                      ...prev, 
                      currentPassword: e.target.value 
                    }))}
                    disabled={isChangingPassword}
                    required
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPasswords(prev => ({ 
                      ...prev, 
                      current: !prev.current 
                    }))}
                  >
                    {showPasswords.current ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPasswords.new ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ 
                      ...prev, 
                      newPassword: e.target.value 
                    }))}
                    disabled={isChangingPassword}
                    required
                    minLength={6}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPasswords(prev => ({ 
                      ...prev, 
                      new: !prev.new 
                    }))}
                  >
                    {showPasswords.new ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ 
                      ...prev, 
                      confirmPassword: e.target.value 
                    }))}
                    disabled={isChangingPassword}
                    required
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPasswords(prev => ({ 
                      ...prev, 
                      confirm: !prev.confirm 
                    }))}
                  >
                    {showPasswords.confirm ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isChangingPassword}
                className="w-full"
              >
                {isChangingPassword ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    Changing Password...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Change Password
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};