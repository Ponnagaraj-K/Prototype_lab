import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import AppHeader from "@/components/AppHeader";
import { CGPAPlanning } from "@/components/CGPAPlanning";

const SGPAPlanningPage = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  if (!user) return <Navigate to="/auth" replace />;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <CGPAPlanning />
    </div>
  );
};

export default SGPAPlanningPage;