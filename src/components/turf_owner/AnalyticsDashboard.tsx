import React, { useState, useEffect } from "react";
import { DashboardAnalytics, RevenueAnalytics, CustomerAnalytics } from "../../types";
import { apiService } from "../../services/api";

interface AnalyticsDashboardProps {
  turfId?: string;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  turfId,
}) => {
  const [dashboardData, setDashboardData] =
    useState<DashboardAnalytics | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueAnalytics | null>(
    null
  );
  const [customerData, setCustomerData] = useState<CustomerAnalytics | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<
    "daily" | "weekly" | "monthly" | "yearly"
  >("monthly");

  useEffect(() => {
    loadAnalytics();
  }, [selectedPeriod, turfId]);

  const loadAnalytics = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = { period: selectedPeriod, ...(turfId && { turfId }) };

      const [dashboardResponse, revenueResponse, customerResponse] =
        await Promise.all([
          apiService.getDashboardAnalytics(params),
          apiService.getRevenueAnalytics({ ...params, months: 12 }),
          apiService.getCustomerAnalytics({ ...params, months: 6 }),
        ]);

      setDashboardData((dashboardResponse as any).data);
      setRevenueData((revenueResponse as any).data);
      setCustomerData((customerResponse as any).data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load analytics"
      );
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value.toFixed(1)}%`;
  };

  const getChangeColor = (value: number) => {
    return value >= 0 ? "text-green-600" : "text-red-600";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>Error loading analytics: {error}</p>
        <button
          onClick={loadAnalytics}
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      {/* Key Metrics Cards */}
      {dashboardData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData.currentPeriod.totalBookings}
                </p>
              </div>
              <div className="text-right">
                <p
                  className={`text-sm font-medium ${getChangeColor(
                    dashboardData.changes.bookings
                  )}`}
                >
                  {formatPercentage(dashboardData.changes.bookings)}
                </p>
                <p className="text-xs text-gray-500">vs last {selectedPeriod}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(dashboardData.currentPeriod.totalRevenue)}
                </p>
              </div>
              <div className="text-right">
                <p
                  className={`text-sm font-medium ${getChangeColor(
                    dashboardData.changes.revenue
                  )}`}
                >
                  {formatPercentage(dashboardData.changes.revenue)}
                </p>
                <p className="text-xs text-gray-500">vs last {selectedPeriod}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Hours</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData.currentPeriod.totalHours.toFixed(1)}
                </p>
              </div>
              <div className="text-right">
                <p
                  className={`text-sm font-medium ${getChangeColor(
                    dashboardData.changes.hours
                  )}`}
                >
                  {formatPercentage(dashboardData.changes.hours)}
                </p>
                <p className="text-xs text-gray-500">vs last {selectedPeriod}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unique Customers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData.currentPeriod.totalUniqueCustomers}
                </p>
              </div>
              <div className="text-right">
                <p
                  className={`text-sm font-medium ${getChangeColor(
                    dashboardData.changes.customers
                  )}`}
                >
                  {formatPercentage(dashboardData.changes.customers)}
                </p>
                <p className="text-xs text-gray-500">vs last {selectedPeriod}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Revenue Chart */}
      {revenueData && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Revenue Trend
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-xl font-bold text-blue-600">
                  {formatCurrency(revenueData.totals.totalRevenue)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Average Monthly</p>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(revenueData.totals.averageMonthlyRevenue)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Avg Booking Value</p>
                <p className="text-xl font-bold text-purple-600">
                  {formatCurrency(revenueData.totals.averageBookingValue)}
                </p>
              </div>
            </div>

            {/* Simple bar chart representation */}
            <div className="space-y-2">
              {revenueData.revenueData.slice(-6).map((item) => {
                const maxRevenue = Math.max(
                  ...revenueData.revenueData.map((d) => d.revenue)
                );
                const width = (item.revenue / maxRevenue) * 100;

                return (
                  <div key={item.month} className="flex items-center space-x-4">
                    <div className="w-16 text-sm text-gray-600">{item.month}</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                      <div
                        className="bg-blue-500 h-6 rounded-full flex items-center justify-end pr-2"
                        style={{ width: `${width}%` }}
                      >
                        <span className="text-white text-xs font-medium">
                          {formatCurrency(item.revenue)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Customer Analytics */}
      {customerData && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Customer Analytics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">New Customers</p>
              <p className="text-2xl font-bold text-blue-600">
                {customerData.summary.totalNewCustomers}
              </p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Returning Customers</p>
              <p className="text-2xl font-bold text-green-600">
                {customerData.summary.totalReturningCustomers}
              </p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600">Retention Rate</p>
              <p className="text-2xl font-bold text-purple-600">
                {customerData.summary.retentionRate.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Additional Metrics */}
      {dashboardData && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Additional Insights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-md font-medium text-gray-700 mb-2">
                Average Booking Value
              </h3>
              <p className="text-xl font-bold text-indigo-600">
                {formatCurrency(dashboardData.currentPeriod.averageBookingValue)}
              </p>
            </div>
            <div>
              <h3 className="text-md font-medium text-gray-700 mb-2">Period</h3>
              <p className="text-lg text-gray-600 capitalize">
                {dashboardData.period}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(dashboardData.dateRange.start).toLocaleDateString()} -{" "}
                {new Date(dashboardData.dateRange.end).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


