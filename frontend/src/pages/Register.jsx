import React, { useState, useContext } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { Package } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [university, setUniversity] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await api.post('/api/users/register', { name, email, password, university });
      login(response.data);
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-row-reverse">
      {/* Right Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-primary mb-2">Create an Account</h2>
            <p className="text-muted-foreground">Join thousands of students sharing equipment.</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-semibold border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={submitHandler} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-primary">Full Name</label>
              <Input type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-primary">University / Campus</label>
              <Input type="text" placeholder="State University" value={university} onChange={(e) => setUniversity(e.target.value)} required />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-primary">College Email (.edu)</label>
              <Input type="email" placeholder="student@college.edu" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-primary">Password</label>
              <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            
            <Button type="submit" disabled={loading} className="w-full h-12 text-base mt-4">
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-accent font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* Left Graphic Side */}
      <div className="hidden lg:flex w-1/2 bg-accent p-12 items-center justify-center relative overflow-hidden rounded-br-3xl">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-accent to-accent"></div>
        <div className="relative z-10 text-center max-w-md">
          <div className="bg-white text-accent w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
            <Package size={40} strokeWidth={2.5} />
          </div>
          <h2 className="text-4xl font-extrabold text-white mb-6">Build a sustainable campus.</h2>
          <p className="text-white/90 text-lg leading-relaxed">
            By joining BorrowHub, you're helping reduce e-waste and making education more accessible for everyone.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
