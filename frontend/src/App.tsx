import { Navigate, Route, Routes } from "react-router-dom";
import { Header } from "./components/Header";
import { useIdentity } from "./context/IdentityContext";
import { Landing } from "./pages/Landing";
import { ClientHome } from "./pages/ClientHome";
import { CounsellorDashboard } from "./pages/CounsellorDashboard";
import { SessionRoom } from "./pages/SessionRoom";
import type { Role } from "./api";

function RequireRole({ role, children }: { role: Role; children: React.ReactNode }) {
  const { identity } = useIdentity();
  if (!identity || identity.role !== role) return <Navigate to="/" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <div className="shell">
      <Header />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/client"
          element={
            <RequireRole role="client">
              <ClientHome />
            </RequireRole>
          }
        />
        <Route
          path="/counsellor"
          element={
            <RequireRole role="counsellor">
              <CounsellorDashboard />
            </RequireRole>
          }
        />
        <Route path="/session/:id" element={<SessionRoom />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
