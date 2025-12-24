import React from "react";
import { Card, PageHeader, StatCard, Button } from "customMain/components/shared";
import { useAppDispatch, useAppSelector } from "customMain/store/hooks";
import { increment, decrement, reset } from "customMain/store/slices/counterSlice";
import { addUser } from "customMain/store/slices/userSlice";
import { mockLicenses, mockActivities } from "./data/mockData";
import { formatRelativeTime, formatDate, isExpiringSoon } from "./utils";

export default function App() {
  const dispatch = useAppDispatch();
  const counter = useAppSelector((state) => state.counter);
  const users = useAppSelector((state) => state.users);

  const handleAddLicenseOfficer = () => {
    const randomId = Math.random().toString(36).substr(2, 9);
    dispatch(addUser({
      id: randomId,
      name: `License Officer ${randomId}`,
      email: `officer${randomId}@licenses.gov`,
      role: 'License Officer',
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-green-600 bg-green-100';
      case 'Expired': return 'text-red-600 bg-red-100';
      case 'Suspended': return 'text-orange-600 bg-orange-100';
      case 'Pending': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const activeLicenses = mockLicenses.filter(l => l.status === 'Active').length;
  const expiringSoon = mockLicenses.filter(l => isExpiringSoon(l.expiryDate)).length;
  const pendingLicenses = mockLicenses.filter(l => l.status === 'Pending').length;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <PageHeader 
        title="License Management Module" 
        description="Manage import/export licenses and permits with shared state" 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard title="Active Licenses" value={activeLicenses.toString()} icon="📜" color="emerald" />
        <StatCard title="Expiring Soon" value={expiringSoon.toString()} icon="⚠️" color="orange" />
        <StatCard title="Pending" value={pendingLicenses.toString()} icon="⏳" color="blue" />
        <StatCard title="Counter (Shared)" value={counter.value.toString()} icon="🔢" color="purple" />
      </div>

      {/* Shared Redux Counter Demo */}
      <Card className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🔗 Shared Redux Counter</h2>
        <p className="text-gray-600 mb-4">
          Counter shared across all micro-frontends
          <br />
          <span className="font-semibold text-purple-600">Current Count: {counter.value}</span>
        </p>
        <div className="flex gap-4">
          <Button variant="primary" onClick={() => dispatch(increment())}>
            Increment from License Module
          </Button>
          <Button variant="secondary" onClick={() => dispatch(decrement())}>
            Decrement
          </Button>
          <Button variant="danger" onClick={() => dispatch(reset())}>
            Reset
          </Button>
        </div>
      </Card>

      {/* Shared Users */}
      <Card className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🔗 Shared User Store</h2>
        <p className="text-gray-600 mb-4">
          Total Users: <span className="font-semibold text-emerald-600">{users.totalCount}</span>
        </p>
        <Button variant="success" onClick={handleAddLicenseOfficer}>
          Add License Officer
        </Button>
      </Card>

      {/* License Records Table */}
      <Card className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">License Records</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="text-left p-3 font-semibold text-gray-700">License No.</th>
                <th className="text-left p-3 font-semibold text-gray-700">Company</th>
                <th className="text-left p-3 font-semibold text-gray-700">Type</th>
                <th className="text-left p-3 font-semibold text-gray-700">Issue Date</th>
                <th className="text-left p-3 font-semibold text-gray-700">Expiry Date</th>
                <th className="text-left p-3 font-semibold text-gray-700">Status</th>
                <th className="text-left p-3 font-semibold text-gray-700">Issued By</th>
              </tr>
            </thead>
            <tbody>
              {mockLicenses.map((license) => (
                <tr key={license.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-mono text-sm">{license.licenseNumber}</td>
                  <td className="p-3">{license.companyName}</td>
                  <td className="p-3">{license.licenseType}</td>
                  <td className="p-3">{formatDate(license.issueDate)}</td>
                  <td className="p-3">
                    <span className={isExpiringSoon(license.expiryDate) ? 'text-orange-600 font-semibold' : ''}>
                      {formatDate(license.expiryDate)}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(license.status)}`}>
                      {license.status}
                    </span>
                  </td>
                  <td className="p-3 text-sm">{license.issuedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent License Activity</h3>
        <div className="space-y-3">
          {mockActivities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {activity.type === 'issued' ? '📜' : activity.type === 'renewed' ? '🔄' : activity.type === 'suspended' ? '⏸️' : '❌'}
                </span>
                <span className="text-gray-700">{activity.description}</span>
              </div>
              <span className="text-sm text-gray-500">{formatRelativeTime(activity.timestamp)}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
