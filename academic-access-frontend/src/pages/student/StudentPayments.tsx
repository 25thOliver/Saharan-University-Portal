import React from "react";
import { CreditCard } from "lucide-react";

export default function StudentPaymentsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Payment History</h1>
        <p className="text-gray-600">View your payment history and transaction details</p>
      </div>

      <div className="bg-white rounded-lg shadow p-8 text-center">
        <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Coming Soon</h3>
        <p className="text-gray-600">Payment history feature is under development.</p>
      </div>
    </div>
  );
} 