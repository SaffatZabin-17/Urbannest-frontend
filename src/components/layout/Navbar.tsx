import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, LogOut, User } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/useUser';
import { getPresignedPreviewUrl } from '@/api/endpoints';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const { backendUser } = useUser();
  const navigate = useNavigate();
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

  const handleSignOut = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex items-center justify-center size-8 rounded-lg bg-emerald-600">
            <Building2 className="size-4.5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">UrbanNest</span>
        </Link>

        {/* Profile dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative size-9 rounded-full cursor-pointer"
            >
              <Avatar className="size-9">
                <AvatarImage
                  src={
                    backendUser?.profilePictureUrl
                      ? (avatarUrl ?? undefined)
                      : undefined
                  }
                  referrerPolicy="no-referrer"
                />
                <AvatarFallback className="text-sm">
                  {backendUser?.name?.charAt(0).toUpperCase() ?? '?'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium leading-none">
                  {backendUser?.name ?? 'User'}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {currentUser?.email}
                </p>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => navigate('/profile')}
            >
              <User className="mr-2 size-4" />
              Profile
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="cursor-pointer text-red-600 focus:text-red-600"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 size-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
