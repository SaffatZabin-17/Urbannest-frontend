import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/useUser';
import {
  updateUser,
  getPresignedUploadUrl,
  getPresignedPreviewUrl,
} from '@/api/endpoints';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Camera,
  Eye,
  EyeOff,
  Mail,
  Phone,
  CreditCard,
  Calendar,
  Pencil,
  Shield,
} from 'lucide-react';

export default function ProfilePage() {
  const { currentUser } = useAuth();
  const { backendUser, setBackendUser } = useUser();

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [formPhone, setFormPhone] = useState('');
  const [formNid, setFormNid] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const phoneChanged = formPhone !== (backendUser?.phone ?? '');
  const nidChanged = !backendUser?.nid && formNid !== (backendUser?.nid ?? '');
  const hasChanges = phoneChanged || nidChanged || !!selectedFile;

  useEffect(() => {
    if (!backendUser?.profilePictureUrl) return;

    let ignore = false;
    const key = backendUser.profilePictureUrl;

    console.log(key);

    const fetchUrl = () =>
      getPresignedPreviewUrl(key)
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

  const isPasswordUser = currentUser?.providerData.some(
    (p) => p.providerId === 'password'
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const startEditing = () => {
    setFormPhone(backendUser?.phone ?? '');
    setFormNid(backendUser?.nid ?? '');
    setEditing(true);
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleSave = async () => {
    setError('');
    setSaving(true);

    try {
      const payload: Record<string, string> = {};

      if (phoneChanged && formPhone) {
        payload.phone = formPhone;
      }
      if (nidChanged && formNid) {
        payload.nid = formNid;
      }

      if (selectedFile) {
        const { uploadUrl, key } = await getPresignedUploadUrl({
          fileName: selectedFile.name,
          contentType: selectedFile.type,
          category: 'profile-pictures',
        });

        await fetch(uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': selectedFile.type },
          body: selectedFile,
        });

        payload.profilePictureUrl = key;
      }

      const data = await updateUser(payload);
      setBackendUser(data);

      if (selectedFile && data.profilePictureUrl) {
        const url = await getPresignedPreviewUrl(data.profilePictureUrl);
        setAvatarUrl(url);
      }

      setEditing(false);
      setSelectedFile(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    } catch {
      setError('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const formattedDate = backendUser?.createdAt
    ? new Date(backendUser.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Unknown';

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-background py-8 px-4">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* ── Profile Header ── */}
        <div className="flex flex-col items-center gap-4">
          {/* Avatar */}
          <div className="relative">
            <Avatar className="size-24">
              <AvatarImage
                src={
                  previewUrl ??
                  (backendUser?.profilePictureUrl
                    ? (avatarUrl ?? undefined)
                    : undefined)
                }
                referrerPolicy="no-referrer"
              />
              <AvatarFallback className="text-2xl">
                {backendUser?.name?.charAt(0).toUpperCase() ?? '?'}
              </AvatarFallback>
            </Avatar>

            {editing && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 flex items-center justify-center size-8 rounded-full bg-emerald-600 text-white shadow-md hover:bg-emerald-700 transition-colors cursor-pointer"
                >
                  <Camera className="size-4" />
                </button>
              </>
            )}
          </div>

          {/* Name & role */}
          <div className="text-center space-y-1.5">
            <h1 className="text-2xl font-bold">
              {backendUser?.name ?? 'User'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {currentUser?.email}
            </p>
            <Badge variant="secondary" className="mt-1">
              <Shield className="mr-1 size-3" />
              {backendUser?.roleName ?? 'USER'}
            </Badge>
          </div>
        </div>

        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

        {/* ── User Info Card ── */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg">Personal Information</CardTitle>
            {!editing && (
              <Button
                variant="outline"
                size="sm"
                className="cursor-pointer"
                onClick={startEditing}
              >
                <Pencil className="mr-1.5 size-3.5" />
                Edit Profile
              </Button>
            )}
          </CardHeader>

          <CardContent className="space-y-5">
            {/* Email — always read-only */}
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center size-9 rounded-lg bg-muted">
                <Mail className="size-4 text-muted-foreground" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Email
                </p>
                {editing ? (
                  <Input
                    value={backendUser?.email ?? ''}
                    disabled
                    className="bg-muted/50"
                  />
                ) : (
                  <p className="text-sm">
                    {backendUser?.email ?? 'Not provided'}
                  </p>
                )}
              </div>
            </div>

            <Separator />

            {/* Phone */}
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center size-9 rounded-lg bg-muted">
                <Phone className="size-4 text-muted-foreground" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Phone
                </p>
                {editing ? (
                  <Input
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    type="tel"
                  />
                ) : (
                  <p className="text-sm">
                    {backendUser?.phone ?? (
                      <span className="text-muted-foreground italic">
                        Not provided
                      </span>
                    )}
                  </p>
                )}
              </div>
            </div>

            <Separator />

            {/* NID */}
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center size-9 rounded-lg bg-muted">
                <CreditCard className="size-4 text-muted-foreground" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  National ID
                </p>
                {editing ? (
                  <div>
                    <Input
                      value={formNid}
                      onChange={(e) => setFormNid(e.target.value)}
                      placeholder="Enter your NID"
                      disabled={!!backendUser?.nid}
                    />
                    {backendUser?.nid && (
                      <p className="text-xs text-muted-foreground mt-1">
                        NID cannot be changed once set.
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm">
                    {backendUser?.nid ?? (
                      <span className="text-muted-foreground italic">
                        Not provided
                      </span>
                    )}
                  </p>
                )}
              </div>
            </div>

            <Separator />

            {/* Member since */}
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center size-9 rounded-lg bg-muted">
                <Calendar className="size-4 text-muted-foreground" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Member since
                </p>
                <p className="text-sm">{formattedDate}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Change Password Card (email/password users only) ── */}
        {editing && isPasswordUser && (
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Change Password</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Current password */}
              <div className="space-y-1.5">
                <label
                  htmlFor="current-password"
                  className="text-sm font-medium leading-none"
                >
                  Current password
                </label>
                <div className="relative">
                  <Input
                    id="current-password"
                    type={showCurrentPassword ? 'text' : 'password'}
                    placeholder="Enter current password"
                    className="pr-10"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    tabIndex={-1}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* New password */}
              <div className="space-y-1.5">
                <label
                  htmlFor="new-password"
                  className="text-sm font-medium leading-none"
                >
                  New password
                </label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="Enter new password"
                    className="pr-10"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    tabIndex={-1}
                  >
                    {showNewPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm new password */}
              <div className="space-y-1.5">
                <label
                  htmlFor="confirm-new-password"
                  className="text-sm font-medium leading-none"
                >
                  Confirm new password
                </label>
                <div className="relative">
                  <Input
                    id="confirm-new-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm new password"
                    className="pr-10"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── Action Buttons (edit mode) ── */}
        {editing && (
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={handleCancelEdit}
            >
              Cancel
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
              onClick={handleSave}
              disabled={saving || !hasChanges}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
