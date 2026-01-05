import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any)?.role !== "admin") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Admin Header */}
      <header className="bg-slate-900 text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-8">
              <Link href="/admin/requests" className="text-xl font-bold">
                Legacy Paths Admin
              </Link>
              <nav className="flex gap-4">
                <Link
                  href="/admin/requests"
                  className="hover:text-slate-300 transition-colors"
                >
                  Booking Requests
                </Link>
                <Link
                  href="/"
                  className="hover:text-slate-300 transition-colors"
                >
                  View Site
                </Link>
              </nav>
            </div>
            <div className="text-sm text-slate-300">
              {session.user?.email}
            </div>
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
