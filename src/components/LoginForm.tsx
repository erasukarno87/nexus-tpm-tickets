
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Eye, EyeOff, User, Lock, LogIn } from 'lucide-react';

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormProps {
  onLoginSuccess: () => void;
}

export const LoginForm = ({ onLoginSuccess }: LoginFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    defaultValues: {
      email: 'admin@tpm.com',
      password: 'admin123'
    }
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    
    try {
      // For demo purposes, using simple validation
      // In production, use proper password hashing
      const { data: adminUser, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', data.email)
        .single();

      if (error || !adminUser) {
        throw new Error('Email atau password salah');
      }

      // Simple password check (in production, use bcrypt)
      if (data.password !== 'admin123') {
        throw new Error('Email atau password salah');
      }

      localStorage.setItem('tpm_admin_logged_in', 'true');
      localStorage.setItem('tpm_admin_user', JSON.stringify(adminUser));
      
      toast({
        title: "Berhasil!",
        description: "Login berhasil. Selamat datang di panel admin TPM.",
      });

      onLoginSuccess();

    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Error",
        description: error.message || "Gagal login. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Particle Background */}
      <div className="particle-bg fixed inset-0 z-0"></div>
      
      <Card className="glass-card border-0 neon-glow w-full max-w-md mx-4 relative z-10">
        <CardHeader className="text-center">
          <div className="mb-4">
            <User className="w-16 h-16 text-blue-400 mx-auto mb-2" />
          </div>
          <CardTitle className="text-3xl font-bold gradient-text mb-2">
            Login Admin TPM
          </CardTitle>
          <p className="text-gray-400">
            Masuk ke panel administrasi sistem TPM
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Email *</span>
              </Label>
              <Input
                {...register('email', { required: 'Email wajib diisi' })}
                type="email"
                className="glass-input text-white h-12"
                placeholder="Masukkan email admin"
              />
              {errors.email && (
                <p className="text-red-400 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white flex items-center space-x-2">
                <Lock className="w-4 h-4" />
                <span>Password *</span>
              </Label>
              <div className="relative">
                <Input
                  {...register('password', { required: 'Password wajib diisi' })}
                  type={showPassword ? 'text' : 'password'}
                  className="glass-input text-white h-12 pr-12"
                  placeholder="Masukkan password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 text-gray-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-sm">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0 font-semibold"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Memproses...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5 mr-2" />
                  Masuk
                </>
              )}
            </Button>

            <div className="text-center text-sm text-gray-400">
              <p>Demo Credentials:</p>
              <p>Email: admin@tpm.com</p>
              <p>Password: admin123</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
