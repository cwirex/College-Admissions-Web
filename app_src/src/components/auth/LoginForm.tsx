import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const LoginForm = ({ onLogin }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      alert("Password must be at least 6 characters");
    } else {
      onLogin({ email, password });
    }
  };
  return (
    <div>
      <div className="d-flex justify-content-center">
        <Form onSubmit={handleSubmit} className="LoginForm w-50">
          <Form.Label className="p-3">
            <h2>Logowanie kandydatów</h2>
          </Form.Label>

          <Form.Group className="mb-3" controlId="LoginForm_Email">
            <Form.Control
              type="email"
              placeholder="Wprowadź email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="LoginForm_Password">
            <Form.Control
              type="password"
              placeholder="Wprowadź Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Zaloguj
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default LoginForm;
