import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: "📊" },
  { name: "Products", href: "/admin/products", icon: "📦" },
  { name: "Orders", href: "/admin/orders", icon: "🛒" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-bg-secondary">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-60 bg-white border-r border-border">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Link href="/admin" className="text-xl font-semibold text-primary">
            Ozozz Admin
          </Link>
        </div>
        <nav className="p-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-text-secondary rounded-md hover:bg-bg-secondary hover:text-primary transition-colors"
                >
                  <span>{item.icon}</span>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="ml-60">
        <header className="h-16 bg-white border-b border-border flex items-center justify-between px-6">
          <div className="text-sm text-text-secondary">
            Welcome, {session.user?.name || "Admin"}
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-text-secondary hover:text-primary"
            >
              View Site
            </Link>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
