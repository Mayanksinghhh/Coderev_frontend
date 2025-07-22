import { useState } from 'react';
import { apiFetch } from './api';
import {
  Card,
  CardHeader,
  CardBody,
  Input,
  Button,
  Divider,
} from '@nextui-org/react';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem('token', data.token);
      onLogin(data.user); 
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Card className="auth-box">
      <CardHeader className="text-xl font-semibold text-white">
        Login
      </CardHeader>
      <Divider />
      <CardBody>
        <form onSubmit={handleLogin}>
          <Input
            type="email"
            label="Email"
            variant="bordered"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4"
            isRequired
          />
          <Input
            type="password"
            label="Password"
            variant="bordered"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4"
            isRequired
          />
          {error && <p className="error">{error}</p>}
          <Button type="submit" color="primary" fullWidth>
            Login
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}
