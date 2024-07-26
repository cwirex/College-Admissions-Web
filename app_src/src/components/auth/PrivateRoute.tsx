import { Navigate, useLocation } from "react-router-dom";
import { ERoles } from "../../interfaces";

const PrivateRoute = ({
  children,
  auth,
  role,
}: {
  children: JSX.Element;
  auth: boolean;
  role: ERoles;
}) => {
  const location = useLocation();
  if (!auth && !location.pathname.startsWith("/auth")) {
    return <Navigate to={"/auth/login"} state={{ from: location }} />;
  } else if (auth) {
    if (role === ERoles.None) {
      return <h4>Invalid path for assigned role</h4>;
    } else if (role === ERoles.Student && !location.pathname.startsWith("/student")) {
      return <Navigate to={"/student"} state={{ from: location }} />;
    } else if (role === ERoles.College && !location.pathname.startsWith("/college")) {
      return <Navigate to={"/college"} state={{ from: location }} />;
    }
  }
  return children;
};

export default PrivateRoute;
