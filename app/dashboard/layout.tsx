import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { LogoutButton } from "@/components/auth/logout-button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardShell logoutSlot={<LogoutButton />}>{children}</DashboardShell>
  );
}
