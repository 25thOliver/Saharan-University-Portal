import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '@/lib/api';
import { CreateStudentRequest } from '@/types/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Loader, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const CreateStudent: React.FC = () => {
  const [formData, setFormData] = useState({
    registrationNumber: '',
    firstName: '',
    lastName: '',
    idOrPassportNumber: '',
    gender: '',
    dateOfBirth: '',
    disability: '',
    phoneNumber: '',
    universityEmail: '',
    personalEmail: '',
    postalAddress: '',
    totalBilled: '',
    totalPaid: '',
    balance: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.registrationNumber.trim() ||
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.idOrPassportNumber.trim() ||
      !formData.gender.trim() ||
      !formData.universityEmail.trim() ||
      !formData.password.trim()
    ) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    try {
      const studentData = {
        registrationNumber: formData.registrationNumber.trim(),
        idOrPassportNumber: formData.idOrPassportNumber.trim(),
        fullName: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.universityEmail.trim(),
        gender: formData.gender.trim(),
        dateOfBirth: formData.dateOfBirth || undefined,
        disability: formData.disability || undefined,
        phoneNumber: formData.phoneNumber.trim() || undefined,
        universityEmail: formData.universityEmail.trim(),
        personalEmail: formData.personalEmail.trim() || undefined,
        postalAddress: formData.postalAddress.trim() || undefined,
        totalBilled: formData.totalBilled ? parseFloat(formData.totalBilled) : 0.00,
        totalPaid: formData.totalPaid ? parseFloat(formData.totalPaid) : 0.00,
        balance: formData.balance ? parseFloat(formData.balance) : 0.00,
        password: formData.password,
      };
      await apiService.createStudent(studentData);
      toast({
        title: 'Success',
        description: `Student ${formData.firstName} ${formData.lastName} created successfully`,
      });
      navigate('/admin/students');
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create student',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
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
            <UserPlus className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Add New Student</h1>
            <p className="text-muted-foreground">Create a new student account</p>
          </div>
        </div>
      </div>
      {/* Form */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Student Information</CardTitle>
          <CardDescription>
            Fill in the details for the new student account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName ?? ""}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName ?? ""}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="registrationNumber">Registration Number *</Label>
                <Input
                  id="registrationNumber"
                  value={formData.registrationNumber ?? ""}
                  onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                  disabled={isLoading}
                  required
                  placeholder="e.g., STU001"
                />
              </div>
              <div>
                <Label htmlFor="idOrPassportNumber">ID/Passport Number *</Label>
                <Input
                  id="idOrPassportNumber"
                  value={formData.idOrPassportNumber ?? ""}
                  onChange={(e) => handleInputChange('idOrPassportNumber', e.target.value)}
                  disabled={isLoading}
                  required
                  placeholder="e.g., ID123456"
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender *</Label>
                <select
                  id="gender"
                  value={formData.gender ?? ""}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  disabled={isLoading}
                  required
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <Label htmlFor="universityEmail">University Email *</Label>
                <Input
                  id="universityEmail"
                  type="email"
                  value={formData.universityEmail ?? ""}
                  onChange={(e) => handleInputChange('universityEmail', e.target.value)}
                  disabled={isLoading}
                  required
                  placeholder="e.g., stu100@university.com"
                />
              </div>
              <div>
                <Label htmlFor="password">Initial Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password ?? ""}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  disabled={isLoading}
                  required
                  minLength={6}
                  placeholder="Minimum 6 characters"
                />
              </div>
            </div>
            {/* Optional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b border-border pb-2">
                Optional Information
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth ?? ""}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber ?? ""}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    disabled={isLoading}
                    placeholder="e.g., +1-555-123-4567"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="disability">Disability</Label>
                <Input
                  id="disability"
                  value={formData.disability ?? ""}
                  onChange={(e) => handleInputChange('disability', e.target.value)}
                  disabled={isLoading}
                  placeholder="e.g., None"
                />
              </div>
              <div>
                <Label htmlFor="personalEmail">Personal Email</Label>
                <Input
                  id="personalEmail"
                  type="email"
                  value={formData.personalEmail ?? ""}
                  onChange={(e) => handleInputChange('personalEmail', e.target.value)}
                  disabled={isLoading}
                  placeholder="e.g., test.student@gmail.com"
                />
              </div>
              <div>
                <Label htmlFor="postalAddress">Postal Address</Label>
                <Input
                  id="postalAddress"
                  value={formData.postalAddress ?? ""}
                  onChange={(e) => handleInputChange('postalAddress', e.target.value)}
                  disabled={isLoading}
                  placeholder="e.g., 123 Main St"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <Label htmlFor="totalBilled">Total Billed</Label>
                  <Input
                    id="totalBilled"
                    type="number"
                    value={formData.totalBilled ?? ""}
                    onChange={(e) => handleInputChange('totalBilled', e.target.value)}
                    disabled={isLoading}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="totalPaid">Total Paid</Label>
                  <Input
                    id="totalPaid"
                    type="number"
                    value={formData.totalPaid ?? ""}
                    onChange={(e) => handleInputChange('totalPaid', e.target.value)}
                    disabled={isLoading}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="balance">Balance</Label>
                  <Input
                    id="balance"
                    type="number"
                    value={formData.balance ?? ""}
                    onChange={(e) => handleInputChange('balance', e.target.value)}
                    disabled={isLoading}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/students')}
                disabled={isLoading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                variant="premium"
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Create Student
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};