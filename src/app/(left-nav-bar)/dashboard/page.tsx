import { requireAuthenticatedUser } from "@/lib/auth";
import { DashboardContent } from "./_components/DashboardContent";

export default async function DashboardPage() {
  const user = await requireAuthenticatedUser();

  return <DashboardContent useMockData={user.permission === 1} />;
}
