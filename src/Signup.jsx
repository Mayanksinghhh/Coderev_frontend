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

export default function Signup({ onSignup }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await apiFetch('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password, username }),
      });
      onSignup();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Card className="auth-box">
      <CardHeader className="text-xl font-semibold text-white">
        Sign Up
      </CardHeader>
      <Divider />
      <CardBody>
        <form onSubmit={handleSignup}>
          <Input
            type="text"
            label="Username"
            variant="bordered"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mb-4"
            isRequired
          />
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
            Sign Up
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}
