import { db } from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function AdminRequestsPage() {
  const requests = await db.bookingRequest.findMany({
    include: {
      user: true,
      journeyTemplate: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    confirmed: requests.filter((r) => r.status === "confirmed").length,
    cancelled: requests.filter((r) => r.status === "cancelled").length,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Booking Requests</h1>
        <p className="text-slate-600">
          Manage customer booking requests and send proposals
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="text-sm text-slate-500 mb-1">Total Requests</div>
          <div className="text-3xl font-bold">{stats.total}</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-6 shadow-sm">
          <div className="text-sm text-yellow-700 mb-1">Pending</div>
          <div className="text-3xl font-bold text-yellow-900">{stats.pending}</div>
        </div>
        <div className="bg-green-50 rounded-lg p-6 shadow-sm">
          <div className="text-sm text-green-700 mb-1">Confirmed</div>
          <div className="text-3xl font-bold text-green-900">{stats.confirmed}</div>
        </div>
        <div className="bg-slate-50 rounded-lg p-6 shadow-sm">
          <div className="text-sm text-slate-500 mb-1">Cancelled</div>
          <div className="text-3xl font-bold text-slate-700">{stats.cancelled}</div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="text-left p-4 font-semibold">Customer</th>
              <th className="text-left p-4 font-semibold">Journey</th>
              <th className="text-left p-4 font-semibold">Start Date</th>
              <th className="text-left p-4 font-semibold">Travelers</th>
              <th className="text-left p-4 font-semibold">Total</th>
              <th className="text-left p-4 font-semibold">Status</th>
              <th className="text-left p-4 font-semibold">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {requests.map((request) => (
              <tr key={request.id} className="hover:bg-slate-50">
                <td className="p-4">
                  <div className="font-medium">{request.user.name || "N/A"}</div>
                  <div className="text-sm text-slate-500">{request.user.email}</div>
                  {request.user.phone && (
                    <div className="text-sm text-slate-500">{request.user.phone}</div>
                  )}
                </td>
                <td className="p-4">
                  <div className="font-medium">{request.journeyTemplate.name}</div>
                  <div className="text-sm text-slate-500">
                    {request.journeyTemplate.type}
                  </div>
                </td>
                <td className="p-4">{formatDate(request.startDate)}</td>
                <td className="p-4">{request.travelers}</td>
                <td className="p-4 font-semibold">
                  {formatCurrency(request.totalPrice)}
                </td>
                <td className="p-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      request.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : request.status === "confirmed"
                        ? "bg-green-100 text-green-800"
                        : "bg-slate-100 text-slate-800"
                    }`}
                  >
                    {request.status}
                  </span>
                </td>
                <td className="p-4 text-sm text-slate-500">
                  {formatDate(request.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {requests.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            No booking requests yet
          </div>
        )}
      </div>

      {/* Special Requests */}
      {requests.some((r) => r.specialRequests) && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4">Special Requests</h2>
          <div className="space-y-4">
            {requests
              .filter((r) => r.specialRequests)
              .map((request) => (
                <div key={request.id} className="border-l-4 border-slate-200 pl-4">
                  <div className="text-sm text-slate-500 mb-1">
                    {request.user.name} - {request.journeyTemplate.name}
                  </div>
                  <p className="text-slate-700">{request.specialRequests}</p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
