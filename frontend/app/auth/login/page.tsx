'use client';

// TODO: Import hooks and components
// import { useAuth } from '@/hooks/useAuth';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { loginSchema } from '@/lib/validations/auth';

export default function LoginPage() {
  // TODO: Implement login form
  // const { login, isLoading } = useAuth();
  // const { register, handleSubmit, formState: { errors } } = useForm({
  //   resolver: zodResolver(loginSchema),
  // });

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6">Connexion</h1>
        <p className="text-gray-600 mb-4">TODO: Implement login form</p>
        {/* TODO: Add login form */}
      </div>
    </div>
  );
}

