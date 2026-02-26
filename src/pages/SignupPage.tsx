import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, Building2, Users, Home, Star } from 'lucide-react';
import GoogleIcon from '@/components/icons/GoogleIcon';
import { auth } from '@/config/firebase';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/useUser';
import { useNavigate } from 'react-router-dom';
import { createUser, getCurrentUser } from '@/api/generated';
import { customFetch } from '@/api/custom-fetch';
import type { createUserResponse } from '@/api/generated';

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const { register, googleLogin } = useAuth();
  const { setBackendUser } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const form = e.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement)
      .value;
    const confirmPassword = (
      form.elements.namedItem('confirm-password') as HTMLInputElement
    ).value;

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await register(email, password);

      const name = (form.elements.namedItem('name') as HTMLInputElement).value;
      const phone = (form.elements.namedItem('phone') as HTMLInputElement)
        .value;
      const nid = (form.elements.namedItem('nid') as HTMLInputElement).value;

      try {
        await createUser({ name, email, phone, nid });
      } catch (backendErr) {
        await auth.currentUser?.delete();
        throw backendErr;
      }

      const res = await getCurrentUser();
      setBackendUser(res.data);
      navigate('/');
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      if (code === 'auth/email-already-in-use') {
        setError('An account with this email already exists');
      } else if (code === 'auth/weak-password') {
        setError('Password must be at least 6 characters');
      } else if (err instanceof Error && err.message) {
        setError(err.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      await googleLogin();
      // Google users register with no body — backend reads Firebase token
      await customFetch<createUserResponse>('/users', { method: 'POST' });
      const res = await getCurrentUser();
      setBackendUser(res.data);
      navigate('/');
    } catch (err: unknown) {
      if (err instanceof Error && err.message) {
        setError(err.message);
      } else {
        setError('Google sign-in failed. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left Brand Panel ── */}
      <div className="hidden lg:flex lg:w-[45%] bg-linear-to-br from-teal-700 via-emerald-700 to-emerald-800 p-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-20 -left-20 size-72 rounded-full bg-white/5" />
        <div className="absolute -bottom-28 -right-20 size-80 rounded-full bg-white/5" />
        <div className="absolute top-1/3 left-2/3 size-36 rounded-full bg-white/5" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex items-center justify-center size-10 rounded-lg bg-white/15 backdrop-blur-sm">
            <Building2 className="size-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">
            UrbanNest
          </span>
        </div>

        {/* Hero text */}
        <div className="relative z-10 space-y-8">
          <h1 className="text-4xl xl:text-5xl font-bold leading-tight text-white">
            Start your
            <br />
            journey today
          </h1>
          <p className="text-emerald-100/90 text-lg max-w-sm leading-relaxed">
            Join thousands of homeowners, buyers, and renters who trust
            UrbanNest for their real estate needs.
          </p>

          {/* Stats */}
          <div className="flex gap-8">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Home className="size-5 text-emerald-300" />
                <span className="text-2xl font-bold text-white">10k+</span>
              </div>
              <span className="text-sm text-emerald-200/70">
                Listed properties
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Users className="size-5 text-emerald-300" />
                <span className="text-2xl font-bold text-white">25k+</span>
              </div>
              <span className="text-sm text-emerald-200/70">Active users</span>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Star className="size-5 text-emerald-300" />
                <span className="text-2xl font-bold text-white">4.8</span>
              </div>
              <span className="text-sm text-emerald-200/70">User rating</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="relative z-10 text-emerald-200/60 text-sm">
          &copy; {new Date().getFullYear()} UrbanNest. All rights reserved.
        </p>
      </div>

      {/* ── Right Form Panel ── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-background">
        <Card className="w-full max-w-105 border-0 shadow-none sm:border sm:shadow-sm">
          <CardHeader className="text-center pb-2">
            {/* Mobile logo */}
            <div className="flex items-center justify-center gap-2 lg:hidden mb-6">
              <div className="flex items-center justify-center size-9 rounded-lg bg-emerald-600">
                <Building2 className="size-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                UrbanNest
              </span>
            </div>

            <CardTitle className="text-2xl font-bold">
              Create an account
            </CardTitle>
            <CardDescription>
              Get started with UrbanNest for free
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
              )}

              {/* Google */}
              <Button
                variant="outline"
                className="w-full h-10 cursor-pointer"
                type="button"
                onClick={handleGoogleLogin}
              >
                <GoogleIcon />
                Continue with Google
              </Button>

              {/* Divider */}
              <div className="relative py-1">
                <Separator />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-muted-foreground uppercase tracking-wider">
                  or
                </span>
              </div>

              {/* Full name */}
              <div className="space-y-1.5">
                <label
                  htmlFor="name"
                  className="text-sm font-medium leading-none"
                >
                  Full name
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  autoComplete="name"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="text-sm font-medium leading-none"
                >
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>

              {/* Phone & NID side by side */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label
                    htmlFor="phone"
                    className="text-sm font-medium leading-none"
                  >
                    Phone number
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+880 1XXX-XXXXXX"
                    autoComplete="tel"
                  />
                </div>
                <div className="space-y-1.5">
                  <label
                    htmlFor="nid"
                    className="text-sm font-medium leading-none"
                  >
                    NID
                  </label>
                  <Input
                    id="nid"
                    type="text"
                    placeholder="National ID number"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="text-sm font-medium leading-none"
                >
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="pr-10"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    tabIndex={-1}
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm password */}
              <div className="space-y-1.5">
                <label
                  htmlFor="confirm-password"
                  className="text-sm font-medium leading-none"
                >
                  Confirm password
                </label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="pr-10"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    tabIndex={-1}
                    aria-label={
                      showConfirmPassword ? 'Hide password' : 'Show password'
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-2 pt-1">
                <Checkbox id="terms" className="mt-0.5" />
                <label
                  htmlFor="terms"
                  className="text-sm text-muted-foreground leading-snug cursor-pointer select-none"
                >
                  I agree to the{' '}
                  <Link
                    to="/terms"
                    className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium transition-colors"
                  >
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link
                    to="/privacy"
                    className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full h-10 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
              >
                Create account
              </Button>

              {/* Sign in link */}
              <p className="text-center text-sm text-muted-foreground pt-2">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
