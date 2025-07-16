import React, { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Loader, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const Login: React.FC = () => {
  const [mode, setMode] = useState<'student' | 'admin'>('student');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      (mode === 'student' && (!registrationNumber.trim() || !password.trim())) ||
      (mode === 'admin' && (!email.trim() || !password.trim()))
    ) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    try {
      let credentials;
      if (mode === 'admin') {
        credentials = { email: email.trim(), password };
      } else {
        credentials = { registrationNumber: registrationNumber.trim(), password };
      }
      const response = await apiService.login(credentials);
      login(response.token, response.user);
      toast({
        title: 'Welcome back!',
        description: `Logged in as ${response.user.firstName ? response.user.firstName : response.user.email}`,
      });
      navigate(from, { replace: true });
    } catch (error) {
      toast({
        title: 'Login Failed',
        description: error instanceof Error ? error.message : 'Invalid credentials',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-scale-in">
        <Card className="shadow-strong">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto p-4 bg-gradient-primary rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <GraduationCap className="h-8 w-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl font-bold">Student Portal</CardTitle>
            <CardDescription>
              Sign in to access your student dashboard
            </CardDescription>
            <div className="flex justify-center gap-2 mt-4">
              <Button
                type="button"
                variant={mode === 'student' ? 'premium' : 'outline'}
                onClick={() => setMode('student')}
                disabled={isLoading}
                className="px-4"
              >
                Student Login
              </Button>
              <Button
                type="button"
                variant={mode === 'admin' ? 'premium' : 'outline'}
                onClick={() => setMode('admin')}
                disabled={isLoading}
                className="px-4"
              >
                Admin Login
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'student' ? (
                <div className="space-y-2">
                  <Label htmlFor="registrationNumber">Registration Number</Label>
                  <Input
                    id="registrationNumber"
                    type="text"
                    placeholder="Enter your registration number"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    disabled={isLoading}
                    className="transition-all duration-200 focus:shadow-soft"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="email">Admin Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your admin email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="transition-all duration-200 focus:shadow-soft"
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="transition-all duration-200 focus:shadow-soft pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
                variant="premium"
              >
                {isLoading ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
            <div className="mt-6 p-4 bg-accent/30 rounded-lg">
              <p className="text-sm text-muted-foreground text-center">
                Demo Credentials:
              </p>
              <div className="mt-2 space-y-1 text-xs text-center">
                <div>Student: <span className="font-mono">STU001</span> / <span className="font-mono">password</span></div>
                <div>Admin: <span className="font-mono">admin@university.com</span> / <span className="font-mono">admin123</span></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};