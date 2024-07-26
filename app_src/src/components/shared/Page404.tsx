import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Page404 = () => {
  const navigate = useNavigate();
  return (
    <div className="d-flex align-items-center justify-content-center p-5">
      <div className="text-center">
        <h1 className="display-1 fw-bold">404</h1>
        <p className="fs-3">
          {" "}
          <span className="text-danger">Ups!</span> Strona nie znaleziona.
        </p>
        <p className="lead">Strona której szukasz prawdopodobnie nie istnieje</p>
        <Button onClick={() => navigate(-1)} className="btn btn-lg btn-danger">
          Powrót
        </Button>
      </div>
    </div>
  );
};

export default Page404;
