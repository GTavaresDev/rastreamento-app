import { LeftNavBarLayoutContainer } from "./components/LeftNavBarLayoutContainer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <LeftNavBarLayoutContainer>{children}</LeftNavBarLayoutContainer>;
}
