import { useState } from 'react';
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
import {
  Eye,
  EyeOff,
  Building2,
  MapPin,
  TrendingUp,
  Shield,
} from 'lucide-react';
import GoogleIcon from '@/components/icons/GoogleIcon';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/useUser';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '@/api/generated';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { login, googleLogin } = useAuth();
  const { setBackendUser } = useUser();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const form = e.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement)
      .value;

    try {
      await login(email, password);
      const res = await getCurrentUser();
      setBackendUser(res.data);
      navigate('/');
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      setError(
        code === 'auth/invalid-credential'
          ? 'Invalid email or password'
          : 'Something went wrong. Please try again.'
      );
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      await googleLogin();
      const res = await getCurrentUser();
      setBackendUser(res.data);
      navigate('/');
    } catch {
      setError('Google sign-in failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left Brand Panel ── */}
      <div className="hidden lg:flex lg:w-[45%] bg-linear-to-br from-custom-orange via-custom-orange-deep to-custom-orange-dark p-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-24 -right-24 size-64 rounded-full bg-white/5" />
        <div className="absolute -bottom-32 -left-16 size-80 rounded-full bg-white/5" />
        <div className="absolute top-1/2 right-12 size-40 rounded-full bg-white/5" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex items-center justify-center size-10 rounded-lg bg-white/15 backdrop-blur-sm">
            <Building2 className="size-6 text-white" />
          </div>
          <span className="text-2xl font-marko text-white tracking-tight">
            UrbanNest
          </span>
        </div>

        {/* Hero text */}
        <div className="relative z-10 space-y-8">
          <h1 className="text-4xl xl:text-5xl font-bold leading-tight text-white">
            Find your perfect
            <br />
            place to call home
          </h1>
          <p className="text-white/90 text-lg max-w-sm leading-relaxed">
            Browse thousands of properties, connect with sellers, and discover
            your dream home — all in one place.
          </p>

          {/* Feature pills */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 text-white/80">
              <div className="flex items-center justify-center size-8 rounded-full bg-white/10">
                <MapPin className="size-4 text-white" />
              </div>
              <span className="text-sm">Properties across major cities</span>
            </div>
            <div className="flex items-center gap-3 text-white/80">
              <div className="flex items-center justify-center size-8 rounded-full bg-white/10">
                <TrendingUp className="size-4 text-white" />
              </div>
              <span className="text-sm">Real-time market insights</span>
            </div>
            <div className="flex items-center gap-3 text-white/80">
              <div className="flex items-center justify-center size-8 rounded-full bg-white/10">
                <Shield className="size-4 text-white" />
              </div>
              <span className="text-sm">Verified sellers & secure deals</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="relative z-10 text-white/60 text-sm">
          &copy; {new Date().getFullYear()} UrbanNest. All rights reserved.
        </p>
      </div>

      {/* ── Right Form Panel ── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-custom-bg-warm-1">
        <Card className="w-full max-w-105 border-0 shadow-none sm:border sm:shadow-sm">
          <CardHeader className="text-center pb-2">
            {/* Mobile logo */}
            <div className="flex items-center justify-center gap-2 lg:hidden mb-6">
              <div className="flex items-center justify-center size-9 rounded-lg bg-custom-orange">
                <Building2 className="size-5 text-white" />
              </div>
              <span className="text-xl font-marko tracking-tight">
                UrbanNest
              </span>
            </div>

            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
            <CardDescription>
              Sign in to your account to continue
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
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-xs text-muted-foreground uppercase tracking-wider">
                  or
                </span>
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
                    autoComplete="current-password"
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

              {/* Remember me + Forgot password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox id="remember" />
                  <label
                    htmlFor="remember"
                    className="text-sm text-muted-foreground leading-none cursor-pointer select-none"
                  >
                    Remember me
                  </label>
                </div>
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-custom-orange hover:text-custom-orange-deep dark:text-custom-orange-light dark:hover:text-custom-orange transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full h-10 bg-custom-orange hover:bg-custom-orange-deep text-white cursor-pointer"
              >
                Sign in
              </Button>

              {/* Sign up link */}
              <p className="text-center text-sm text-muted-foreground pt-2">
                Don&apos;t have an account?{' '}
                <Link
                  to="/signup"
                  className="font-medium text-custom-orange hover:text-custom-orange-deep dark:text-custom-orange-light dark:hover:text-custom-orange transition-colors"
                >
                  Create one
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
