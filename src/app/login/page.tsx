'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { FiMail, FiLock } from 'react-icons/fi';

interface LoginFormData {
  email: string;
  password: string;
}

type User = {
  name: string;
  email: string;
  role: string;
  token: string;
};

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  const router = useRouter();

  const onSubmit = async (data: LoginFormData) => {
    // API_Add_Here: Replace with actual login API call
    // This mock user should come from your API response
    const mockUser: User = {
      name: "Test User",
      email: data.email,
      role: "user", // This should come from API response
      token: 'mock-token'
    };

    // For demo purpose - hardcode admin user
    if (data.email === 'admin@example.com') {
      mockUser.role = 'admin';
    }
    
    localStorage.setItem('user', JSON.stringify(mockUser));
    
    if (mockUser.role === 'admin') {
      router.push('/dashboard');
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-zinc-900">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

        <div className="mb-4">
          <label className="flex items-center mb-2">
            <FiMail className="mr-2" /> Email
          </label>
          <input 
            type="email" 
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })} 
            className="w-full p-2 border rounded"
          />
          {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
        </div>

        <div className="mb-6">
          <label className="flex items-center mb-2">
            <FiLock className="mr-2" /> Password
          </label>
          <input 
            type="password" 
            {...register('password', { 
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters'
              }
            })} 
            className="w-full p-2 border rounded"
          />
          {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
        </div>

        <button 
          type="submit" 
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
        >
          Login
        </button>

        <p className="mt-4 text-center">
          Don't have an account?{' '}
          <button 
            type="button"
            onClick={() => router.push('/signup')}
            className="text-blue-500 hover:underline"
          >
            Sign up here
          </button>
        </p>
      </form>
    </div>
  );
}