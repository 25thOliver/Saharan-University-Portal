import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader, ArrowLeft, Plus, Save, Edit3, Trash2, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Trimester {
  id: number;
  name: string;
  academicYear: string;
  period: string;
  periodType: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  minimumCourses: number;
  maximumCourses: number;
}

export const TrimesterManagement: React.FC = () => {
  const [trimesters, setTrimesters] = useState<Trimester[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    academicYear: '',
    period: '',
    periodType: 'TRIMESTER',
    startDate: '',
    endDate: '',
    minimumCourses: 6,
    maximumCourses: 8,
    isActive: true
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchTrimesters();
  }, []);

  const fetchTrimesters = async () => {
    setIsLoading(true);
    try {
      const data = await apiService.getAllTrimesters();
      setTrimesters(Array.isArray(data) ? data : []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch trimesters',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.academicYear || !formData.period || !formData.startDate || !formData.endDate) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingId) {
        await apiService.updateTrimester(editingId, formData);
        toast({
          title: 'Success',
          description: 'Trimester updated successfully',
        });
      } else {
        await apiService.createTrimester(formData);
        toast({
          title: 'Success',
          description: 'Trimester created successfully',
        });
      }
      
      resetForm();
      fetchTrimesters();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save trimester',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (trimester: Trimester) => {
    setEditingId(trimester.id);
    setFormData({
      name: trimester.name,
      academicYear: trimester.academicYear,
      period: trimester.period,
      periodType: trimester.periodType,
      startDate: trimester.startDate.split('T')[0], // Convert to date format
      endDate: trimester.endDate.split('T')[0],
      minimumCourses: trimester.minimumCourses,
      maximumCourses: trimester.maximumCourses,
      isActive: trimester.isActive
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this trimester?')) return;
    
    try {
      await apiService.deleteTrimester(id);
      toast({
        title: 'Success',
        description: 'Trimester deleted successfully',
      });
      fetchTrimesters();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete trimester',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: '',
      academicYear: '',
      period: '',
      periodType: 'TRIMESTER',
      startDate: '',
      endDate: '',
      minimumCourses: 6,
      maximumCourses: 8,
      isActive: true
    });
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-update course limits based on period type
    if (field === 'periodType') {
      if (value === 'TRIMESTER') {
        setFormData(prev => ({ 
          ...prev, 
          [field]: value,
          minimumCourses: 6,
          maximumCourses: 8
        }));
      } else if (value === 'SEMESTER') {
        setFormData(prev => ({ 
          ...prev, 
          [field]: value,
          minimumCourses: 8,
          maximumCourses: 10
        }));
      }
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => navigate('/admin/courses')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Courses
        </Button>
        <h1 className="text-3xl font-bold text-foreground">Trimester Management</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Card */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {editingId ? 'Edit Trimester' : 'Create New Trimester'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => updateFormData('name', e.target.value)}
                    placeholder="e.g., Trimester 1.1, Semester 1"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="academicYear">Academic Year *</Label>
                  <Input
                    id="academicYear"
                    value={formData.academicYear}
                    onChange={(e) => updateFormData('academicYear', e.target.value)}
                    placeholder="e.g., 2024/2025"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="period">Period Code *</Label>
                  <Input
                    id="period"
                    value={formData.period}
                    onChange={(e) => updateFormData('period', e.target.value)}
                    placeholder="e.g., TRIM1_YEAR1, SEM1_YEAR1"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="periodType">Period Type *</Label>
                  <Select value={formData.periodType} onValueChange={(value) => updateFormData('periodType', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TRIMESTER">Trimester</SelectItem>
                      <SelectItem value="SEMESTER">Semester</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => updateFormData('startDate', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => updateFormData('endDate', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minimumCourses">Minimum Courses</Label>
                  <Input
                    id="minimumCourses"
                    type="number"
                    min="1"
                    max="12"
                    value={formData.minimumCourses}
                    onChange={(e) => updateFormData('minimumCourses', parseInt(e.target.value) || 6)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maximumCourses">Maximum Courses</Label>
                  <Input
                    id="maximumCourses"
                    type="number"
                    min="1"
                    max="12"
                    value={formData.maximumCourses}
                    onChange={(e) => updateFormData('maximumCourses', parseInt(e.target.value) || 8)}
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="gap-2"
                >
                  {isSubmitting ? (
                    <Loader className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {isSubmitting ? 'Saving...' : (editingId ? 'Update Trimester' : 'Create Trimester')}
                </Button>
                
                {editingId && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    disabled={isSubmitting}
                  >
                    Cancel Edit
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* List Card */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>All Trimesters</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center gap-2 text-primary">
                <Loader className="h-6 w-6 animate-spin" />
                <span>Loading trimesters...</span>
              </div>
            ) : trimesters.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">No trimesters found.</div>
            ) : (
              <div className="space-y-3">
                {trimesters.map(trimester => (
                  <div key={trimester.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{trimester.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {trimester.academicYear} • {trimester.period} • {trimester.periodType}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {trimester.startDate.split('T')[0]} - {trimester.endDate.split('T')[0]} • 
                          Min: {trimester.minimumCourses} • Max: {trimester.maximumCourses}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(trimester)}
                          className="gap-1"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(trimester.id)}
                          className="gap-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        trimester.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {trimester.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 