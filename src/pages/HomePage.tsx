import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/useUser';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export default function HomePage() {
  const { loggedIn, currentUser, logout } = useAuth();
  const { backendUser } = useUser();

  console.log(backendUser?.profilePictureUrl);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      {loggedIn ? (
        <div className="text-center space-y-4">
          <Avatar size="lg" className="mx-auto size-16">
            <AvatarImage
              src={backendUser?.profilePictureUrl ?? undefined}
              referrerPolicy="no-referrer"
            />
            <AvatarFallback className="text-lg">
              {backendUser?.name?.charAt(0).toUpperCase() ?? '?'}
            </AvatarFallback>
          </Avatar>
          <h1 className="text-3xl font-bold">
            {backendUser?.name ?? 'You are logged in'}
          </h1>
          <p className="text-muted-foreground">{currentUser?.email}</p>
          <Button onClick={logout} variant="outline" className="cursor-pointer">
            Sign out
          </Button>
        </div>
      ) : (
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">You are not logged in</h1>
          <div className="flex gap-3 justify-center">
            <Button
              asChild
              className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
            >
              <Link to="/login">Sign in</Link>
            </Button>
            <Button asChild variant="outline" className="cursor-pointer">
              <Link to="/signup">Create account</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
