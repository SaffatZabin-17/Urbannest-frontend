import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/useUser';
import { getPresignedPreviewUrl } from '@/api/endpoints';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export default function HomePage() {
  const { loggedIn } = useAuth();
  const { backendUser } = useUser();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!backendUser?.profilePictureUrl) return;

    const picUrl = backendUser.profilePictureUrl;

    if (picUrl.startsWith('http')) {
      setAvatarUrl(picUrl);
      return;
    }

    let ignore = false;

    const fetchUrl = () =>
      getPresignedPreviewUrl(picUrl)
        .then((url) => {
          if (!ignore) setAvatarUrl(url);
        })
        .catch(() => {
          if (!ignore) setAvatarUrl(null);
        });

    fetchUrl();
    const intervalId = setInterval(fetchUrl, 55 * 60 * 1000);

    return () => {
      ignore = true;
      clearInterval(intervalId);
    };
  }, [backendUser?.profilePictureUrl]);

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center bg-background">
      {loggedIn ? (
        <div className="text-center space-y-4">
          <Avatar className="size-20 mx-auto">
            <AvatarImage
              src={
                backendUser?.profilePictureUrl
                  ? (avatarUrl ?? undefined)
                  : undefined
              }
              referrerPolicy="no-referrer"
            />
            <AvatarFallback className="text-2xl">
              {backendUser?.name?.charAt(0).toUpperCase() ?? '?'}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">
              Welcome back, {backendUser?.name ?? 'User'}
            </h1>
            <p className="text-muted-foreground">
              Your dashboard will appear here soon.
            </p>
          </div>
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
