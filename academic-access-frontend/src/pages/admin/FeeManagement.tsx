import React, { useState, useEffect } from "react";
import { apiService } from "@/lib/api";
import { Plus, Edit, Trash2, DollarSign, AlertTriangle, CheckCircle } from "lucide-react";

interface Fee {
  id: number;
  feeCode: string;
  feeName: string;
  description: string;
  amount: number;
  feeType: string;
  isActive: boolean;
}

interface StudentFee {
  id: number;
  studentName: string;
  studentRegistrationNumber: string;
  feeName: string;
  amount: number;
  dueDate: string;
  status: string;
  paidAmount: number;
  academicYear: string;
  semester: string;
}

interface Payment {
  id: number;
  studentName: string;
  amount: number;
  paymentMethod: string;
  status: string;
  paymentDate: string;
  referenceNumber: string;
}

export default function FeeManagementPage() {
  const [activeTab, setActiveTab] = useState<'fees' | 'student-fees' | 'payments'>('fees');
  const [fees, setFees] = useState<Fee[]>([]);
  const [studentFees, setStudentFees] = useState<StudentFee[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFeeForm, setShowFeeForm] = useState(false);
  const [showStudentFeeForm, setShowStudentFeeForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [editingFee, setEditingFee] = useState<Fee | null>(null);
  const [editingStudentFee, setEditingStudentFee] = useState<StudentFee | null>(null);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'fees':
          const feesData = await apiService.getAllFees();
          setFees(feesData);
          break;
        case 'student-fees':
          const studentFeesData = await apiService.getAllStudentFees();
          setStudentFees(studentFeesData);
          break;
        case 'payments':
          const paymentsData = await apiService.getAllPayments();
          setPayments(paymentsData);
          break;
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFee = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this fee?')) {
      try {
        await apiService.deleteFee(id);
        loadData();
      } catch (error) {
        console.error('Error deleting fee:', error);
      }
    }
  };

  const handleDeleteStudentFee = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this student fee?')) {
      try {
        await apiService.deleteStudentFee(id);
        loadData();
      } catch (error) {
        console.error('Error deleting student fee:', error);
      }
    }
  };

  const handleDeletePayment = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this payment?')) {
      try {
        await apiService.deletePayment(id);
        loadData();
      } catch (error) {
        console.error('Error deleting payment:', error);
      }
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
        return <DollarSign className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Fee Management</h1>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('fees')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'fees'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Fee Types
        </button>
        <button
          onClick={() => setActiveTab('student-fees')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'student-fees'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Student Fees
        </button>
        <button
          onClick={() => setActiveTab('payments')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'payments'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Payments
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow">
          {/* Header with Add Button */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                {activeTab === 'fees' && 'Fee Types'}
                {activeTab === 'student-fees' && 'Student Fees'}
                {activeTab === 'payments' && 'Payments'}
              </h2>
              <button
                onClick={() => {
                  if (activeTab === 'fees') setShowFeeForm(true);
                  if (activeTab === 'student-fees') setShowStudentFeeForm(true);
                  if (activeTab === 'payments') setShowPaymentForm(true);
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add {activeTab === 'fees' ? 'Fee' : activeTab === 'student-fees' ? 'Student Fee' : 'Payment'}
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {activeTab === 'fees' && (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fee Code</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {fees.map((fee) => (
                    <tr key={fee.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{fee.feeCode}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{fee.feeName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{fee.feeType}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${fee.amount.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          fee.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {fee.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setEditingFee(fee)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteFee(fee.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'student-fees' && (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {studentFees.map((studentFee) => (
                    <tr key={studentFee.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{studentFee.studentName}</div>
                          <div className="text-sm text-gray-500">{studentFee.studentRegistrationNumber}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{studentFee.feeName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${studentFee.amount.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(studentFee.dueDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(studentFee.status)}`}>
                          {getStatusIcon(studentFee.status)}
                          <span className="ml-1">{studentFee.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setEditingStudentFee(studentFee)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteStudentFee(studentFee.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'payments' && (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payments.map((payment) => (
                    <tr key={payment.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{payment.studentName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${payment.amount.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.paymentMethod}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                          {getStatusIcon(payment.status)}
                          <span className="ml-1">{payment.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(payment.paymentDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleDeletePayment(payment.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Forms would go here - simplified for now */}
      {showFeeForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Add Fee</h3>
            <p className="text-gray-600 mb-4">Fee form implementation would go here</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowFeeForm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowFeeForm(false)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {showStudentFeeForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Add Student Fee</h3>
            <p className="text-gray-600 mb-4">Student fee form implementation would go here</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowStudentFeeForm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowStudentFeeForm(false)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {showPaymentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Add Payment</h3>
            <p className="text-gray-600 mb-4">Payment form implementation would go here</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowPaymentForm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowPaymentForm(false)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 