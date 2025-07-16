import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { apiService } from "@/lib/api";
import { 
  User, 
  Mail, 
  Calendar, 
  Clock, 
  BookOpen, 
  DollarSign, 
  GraduationCap,
  FileText,
  Bell,
  Settings,
  CreditCard,
  CheckCircle,
  AlertTriangle,
  Clock as ClockIcon
} from "lucide-react";

interface Course {
  id: number;
  courseCode: string;
  courseTitle: string;
  programTitle: string;
  units: any[];
}

interface StudentFee {
  id: number;
  feeName: string;
  amount: number;
  dueDate: string;
  status: string;
  paidAmount: number;
}

interface Payment {
  id: number;
  amount: number;
  paymentMethod: string;
  status: string;
  paymentDate: string;
  referenceNumber: string;
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [studentFees, setStudentFees] = useState<StudentFee[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [outstandingAmount, setOutstandingAmount] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);

  useEffect(() => {
    loadStudentData();
  }, []);

  const loadStudentData = async () => {
    setLoading(true);
    try {
      // Load student's courses (enrollments)
      const enrollments = await apiService.getEnrollmentsByStudent(user?.id || 0);
      const courseData = enrollments.map((enrollment: any) => ({
        id: enrollment.program.id,
        courseCode: enrollment.program.programCode,
        courseTitle: enrollment.program.programTitle,
        programTitle: enrollment.program.programTitle,
        units: enrollment.program.courses || []
      }));
      setCourses(courseData);

      // Load student fees
      const feesData = await apiService.getStudentFeesByStudentId(user?.id || 0);
      setStudentFees(feesData);

      // Load payments
      const paymentsData = await apiService.getPaymentsByStudentId(user?.id || 0);
      setPayments(paymentsData);

      // Calculate financial summary
      const outstanding = await apiService.getOutstandingAmount(user?.id || 0);
      const paid = await apiService.getPaidAmount(user?.id || 0);
      setOutstandingAmount(outstanding);
      setTotalPaid(paid);

    } catch (error) {
      console.error('Error loading student data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
      case 'COMPLETED':
        return 'text-green-600 bg-green-100';
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-100';
      case 'OVERDUE':
        return 'text-red-600 bg-red-100';
      case 'PARTIAL':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID':
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4" />;
      case 'OVERDUE':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-lg">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-lg">
            <GraduationCap className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {user?.firstName}!</h1>
            <p className="text-blue-100">Student Dashboard</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Enrolled Courses</p>
              <p className="text-xl font-bold">{courses.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Paid</p>
              <p className="text-xl font-bold">${totalPaid.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Outstanding</p>
              <p className="text-xl font-bold">${outstandingAmount.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FileText className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Payments</p>
              <p className="text-xl font-bold">{payments.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-3 mb-4">
              <User className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold">Basic Information</h2>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Full Name:</span>
                <span className="font-medium">{user?.firstName} {user?.lastName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Registration Number:</span>
                <span className="font-medium">{user?.registrationNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">User ID:</span>
                <span className="font-medium">#{user?.id}</span>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold">Contact Information</h2>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Email Address:</span>
                <span className="font-medium">{user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phone Number:</span>
                <span className="font-medium">{user?.phoneNumber || "Not provided"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Address:</span>
                <span className="font-medium">{user?.address || "Not provided"}</span>
              </div>
            </div>
          </div>

          {/* Academic Details */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold">Academic Details</h2>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Date of Birth:</span>
                <span className="font-medium">
                  {user?.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : "Not provided"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Enrollment Date:</span>
                <span className="font-medium">Not provided</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Status:</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active Student
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Enrolled Courses */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold">Enrolled Courses</h2>
            </div>
            {courses.length > 0 ? (
              <div className="space-y-3">
                {courses.map((course) => (
                  <div key={course.id} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{course.courseTitle}</h3>
                        <p className="text-sm text-gray-600">{course.courseCode}</p>
                        <p className="text-xs text-gray-500">{course.units.length} units</p>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Enrolled
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No courses enrolled yet</p>
            )}
          </div>

          {/* Fee Statement */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-3 mb-4">
              <DollarSign className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold">Fee Statement</h2>
            </div>
            {studentFees.length > 0 ? (
              <div className="space-y-3">
                {studentFees.slice(0, 3).map((fee) => (
                  <div key={fee.id} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{fee.feeName}</h3>
                        <p className="text-sm text-gray-600">Due: {new Date(fee.dueDate).toLocaleDateString()}</p>
                        <p className="text-xs text-gray-500">
                          Paid: ${fee.paidAmount.toFixed(2)} / ${fee.amount.toFixed(2)}
                        </p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(fee.status)}`}>
                        {getStatusIcon(fee.status)}
                        <span className="ml-1">{fee.status}</span>
                      </span>
                    </div>
                  </div>
                ))}
                {studentFees.length > 3 && (
                  <p className="text-sm text-blue-600 text-center">View all {studentFees.length} fees</p>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No fees assigned yet</p>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold">Quick Actions</h2>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <button className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <User className="h-5 w-5 text-blue-600" />
                <div className="text-left">
                  <p className="font-medium">Update Profile</p>
                  <p className="text-sm text-gray-600">Change your personal information</p>
                </div>
              </button>
              <button className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <CreditCard className="h-5 w-5 text-green-600" />
                <div className="text-left">
                  <p className="font-medium">Make Payment</p>
                  <p className="text-sm text-gray-600">Pay outstanding fees online</p>
                </div>
              </button>
              <button className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <FileText className="h-5 w-5 text-purple-600" />
                <div className="text-left">
                  <p className="font-medium">View Transcript</p>
                  <p className="text-sm text-gray-600">Access your academic records</p>
                </div>
              </button>
              <button className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Bell className="h-5 w-5 text-orange-600" />
                <div className="text-left">
                  <p className="font-medium">Support</p>
                  <p className="text-sm text-gray-600">Get help or contact support</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 