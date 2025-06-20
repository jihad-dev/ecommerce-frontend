import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../Redux/hooks";

interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[]; // optional: কোন রোল অ্যাক্সেস পাবে
}

const PrivateRoute = ({ children, allowedRoles = ["admin", "user"] }: PrivateRouteProps) => {
  const user = useAppSelector((state) => state.auth.user);
  const location = useLocation();
  if (!user) {
    // 🔒 লগইন করা না থাকলে login page এ পাঠাও
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // ❌ ইউজার রোল মেলে না → unauthorized page এ পাঠাও
    return <Navigate to="/unauthorized" replace />;
  }

  // ✅ সব ঠিক থাকলে চাইল্ড রেন্ডার করো
  return <>{children}</>;
};

export default PrivateRoute;
