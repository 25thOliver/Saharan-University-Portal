import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { apiService } from "@/lib/api";
import { 
  DollarSign, 
  Calendar, 
  CreditCard, 
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Eye
} from "lucide-react";

interface StudentFee {
  id: number;
  feeName: string;
  amount: number;
  dueDate: string;
  status: string;
  paidAmount: number;
  description?: string;
}

interface Payment {
  id: number;
  amount: number;
  paymentMethod: string;
  status: string;
  paymentDate: string;
  referenceNumber: string;
  description?: string;
}

export default function StudentFeesPage() {
  const { user } = useAuth();
  const [studentFees, setStudentFees] = useState<StudentFee[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [outstandingAmount, setOutstandingAmount] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [totalFees, setTotalFees] = useState(0);
  const [selectedFee, setSelectedFee] = useState<StudentFee | null>(null);

  useEffect(() => {
    loadStudentFees();
  }, []);

  const loadStudentFees = async () => {
    setLoading(true);
    try {
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

      // Calculate total fees
      const total = feesData.reduce((sum: number, fee: StudentFee) => sum + fee.amount, 0);
      setTotalFees(total);

    } catch (error) {
      console.error('Error loading student fees:', error);
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
        return <Clock className="h-4 w-4" />;
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Fee Statement</h1>
        <p className="text-gray-600">View your fee details, outstanding amounts, and payment history</p>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Fees</p>
              <p className="text-xl font-bold">{formatCurrency(totalFees)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Paid</p>
              <p className="text-xl font-bold">{formatCurrency(totalPaid)}</p>
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
              <p className="text-xl font-bold">{formatCurrency(outstandingAmount)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <CreditCard className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Payments Made</p>
              <p className="text-xl font-bold">{payments.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fee Statement */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Fee Statement</h2>
            <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
              <Download className="h-4 w-4" />
              <span className="text-sm">Download PDF</span>
            </button>
          </div>
          
          {studentFees.length > 0 ? (
            <div className="space-y-3">
              {studentFees.map((fee) => (
                <div
                  key={fee.id}
                  className={`bg-white rounded-lg shadow p-4 cursor-pointer transition-all hover:shadow-md ${
                    selectedFee?.id === fee.id ? 'ring-2 ring-blue-500' : ''
                  } ${isOverdue(fee.dueDate) ? 'border-l-4 border-red-500' : ''}`}
                  onClick={() => setSelectedFee(fee)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{fee.feeName}</h3>
                      {fee.description && (
                        <p className="text-sm text-gray-600">{fee.description}</p>
                      )}
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(fee.status)}`}>
                      {getStatusIcon(fee.status)}
                      <span className="ml-1">{fee.status}</span>
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Amount:</p>
                      <p className="font-medium">{formatCurrency(fee.amount)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Paid:</p>
                      <p className="font-medium">{formatCurrency(fee.paidAmount)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Due Date:</p>
                      <p className={`font-medium ${isOverdue(fee.dueDate) ? 'text-red-600' : ''}`}>
                        {new Date(fee.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Balance:</p>
                      <p className="font-medium">{formatCurrency(fee.amount - fee.paidAmount)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Fees Assigned</h3>
              <p className="text-gray-600">You don't have any fees assigned yet.</p>
            </div>
          )}
        </div>

        {/* Payment History */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Payment History</h2>
          
          {payments.length > 0 ? (
            <div className="space-y-3">
              {payments.map((payment) => (
                <div key={payment.id} className="bg-white rounded-lg shadow p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Payment #{payment.referenceNumber}
                      </h3>
                      {payment.description && (
                        <p className="text-sm text-gray-600">{payment.description}</p>
                      )}
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                      {getStatusIcon(payment.status)}
                      <span className="ml-1">{payment.status}</span>
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Amount:</p>
                      <p className="font-medium">{formatCurrency(payment.amount)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Method:</p>
                      <p className="font-medium">{payment.paymentMethod}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Date:</p>
                      <p className="font-medium">{new Date(payment.paymentDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Reference:</p>
                      <p className="font-medium text-xs">{payment.referenceNumber}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Payments Yet</h3>
              <p className="text-gray-600">You haven't made any payments yet.</p>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <CreditCard className="h-4 w-4" />
                <span className="text-sm">Make Payment</span>
              </button>
              <button className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <FileText className="h-4 w-4" />
                <span className="text-sm">Download Statement</span>
              </button>
              <button className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Eye className="h-4 w-4" />
                <span className="text-sm">View Details</span>
              </button>
              <button className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">Report Issue</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 