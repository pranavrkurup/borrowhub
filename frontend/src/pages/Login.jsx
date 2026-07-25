import React, { useState, useContext } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await api.post('/api/users/login', { email, password });
      login(response.data);
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      {/* Left Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-primary mb-2">Welcome Back</h2>
            <p className="text-muted-foreground">Sign in to your campus account to continue.</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-semibold border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={submitHandler} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-primary">College Email</label>
              <Input 
                type="email" 
                placeholder="student@college.edu"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                className="h-12"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-primary">Password</label>
              <Input 
                type="password" 
                placeholder="••••••••"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className="h-12"
              />
            </div>
            
            <Button type="submit" disabled={loading} className="w-full h-12 text-base mt-2">
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Don't have an account yet?{' '}
            <Link to="/register" className="text-accent font-bold hover:underline">
              Create an Account
            </Link>
          </p>
        </div>
      </div>

      {/* Right Graphic Side */}
      <div className="hidden lg:flex w-1/2 bg-primary p-12 items-center justify-center relative overflow-hidden rounded-bl-3xl">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent via-primary to-primary"></div>
        <Card className="relative z-10 max-w-md p-10 bg-white/5 border-white/10 backdrop-blur-md shadow-2xl">
          <div className="flex gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center font-bold text-xl">"</div>
          </div>
          <p className="text-2xl text-white font-medium leading-relaxed mb-6">
            BorrowHub completely changed how I handle labs. I didn't have to buy a $200 oscilloscope for a one-week project.
          </p>
          <div>
            <p className="text-white font-bold">— Sarah Jenkins</p>
            <p className="text-white/60 text-sm">Engineering Student</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
