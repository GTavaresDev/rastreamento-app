import { LeftNavBarLayoutContainer } from "./components/LeftNavBarLayoutContainer";
import { requireAuthenticatedUser } from "@/lib/auth";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await requireAuthenticatedUser();

  return (
    <LeftNavBarLayoutContainer user={user}>
      {children}
    </LeftNavBarLayoutContainer>
  );
}
