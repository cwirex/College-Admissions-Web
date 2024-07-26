import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/auth/login");
    }, 1500);
  });
  return (
    <div className="alert alert-secondary">
      <h4>Wylogowano pomyślnie!</h4>
    </div>
  );
};

export default Logout;
