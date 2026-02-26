import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/useUser';
import {
  updateCurrentUser,
  getCurrentUser,
  getUploadUrl,
  getDownloadUrl,
} from '@/api/generated';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import coverImage from '@/assets/logos/img_coverimage.png';
import mapOverlay from '@/assets/logos/img_map.png';
import {
  Calendar,
  Camera,
  CreditCard,
  Eye,
  EyeOff,
  Mail,
  Pencil,
  Phone,
  Save,
  Shield,
  Sparkles,
  UserRound,
  X,
} from 'lucide-react';

function InfoRow({
  icon,
  label,
  children,
  noBorder = false,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
  noBorder?: boolean;
}) {
  return (
    <div className={!noBorder ? 'pb-4' : undefined}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-custom-bg-warm-3 border border-custom-gray-300/40 text-custom-orange">
          {icon}
        </div>
        <div className="min-w-0 flex-1 space-y-1.5">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-custom-gray-600">
            {label}
          </p>
          {children}
        </div>
      </div>
      {!noBorder && <Separator className="mt-4 bg-custom-gray-300/40" />}
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-custom-gray-300/40 bg-white/80 px-4 py-3">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-custom-gray-600">
        {label}
      </p>
      <p className="mt-1 text-lg font-extrabold tracking-tight text-custom-dark">
        {value}
      </p>
    </div>
  );
}

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

    const picUrl = backendUser.profilePictureUrl;

    if (picUrl.startsWith('http')) {
      setAvatarUrl(picUrl);
      return;
    }

    let ignore = false;

    const fetchUrl = () =>
      getDownloadUrl({ key: picUrl })
        .then((res) => {
          if (!ignore) setAvatarUrl(res.data);
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

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

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
        const uploadRes = await getUploadUrl({
          fileName: selectedFile.name,
          contentType: selectedFile.type,
          category: 'profile-pictures',
        });

        await fetch(uploadRes.data.uploadUrl!, {
          method: 'PUT',
          headers: { 'Content-Type': selectedFile.type },
          body: selectedFile,
        });

        payload.profilePictureUrl = uploadRes.data.key!;
      }

      await updateCurrentUser(payload);
      const userRes = await getCurrentUser();
      setBackendUser(userRes.data);

      if (selectedFile && userRes.data.profilePictureUrl) {
        if (userRes.data.profilePictureUrl.startsWith('http')) {
          setAvatarUrl(userRes.data.profilePictureUrl);
        } else {
          const urlRes = await getDownloadUrl({
            key: userRes.data.profilePictureUrl,
          });
          setAvatarUrl(urlRes.data);
        }
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

  const profileImageSrc =
    previewUrl ??
    (backendUser?.profilePictureUrl ? (avatarUrl ?? undefined) : undefined);

  const profileCompletion = Math.round(
    ([
      backendUser?.name,
      backendUser?.email,
      backendUser?.phone,
      backendUser?.nid,
      backendUser?.profilePictureUrl,
    ].filter(Boolean).length /
      5) *
      100
  );

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-custom-bg-warm-1 px-4 py-8 md:px-5 lg:px-30 lg:py-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="relative overflow-hidden rounded-3xl border border-custom-gray-300/50 bg-white shadow-sm">
          <div className="absolute inset-0">
            <img
              src={coverImage}
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover opacity-[0.18]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-custom-bg-warm-2/85" />
          </div>
          <img
            src={mapOverlay}
            alt=""
            aria-hidden="true"
            className="absolute right-0 top-0 h-full w-1/2 object-cover opacity-[0.08]"
          />

          <div className="relative p-5 md:p-7 lg:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="relative shrink-0">
                  <Avatar className="size-24 md:size-28 ring-4 ring-white shadow-lg">
                    <AvatarImage
                      src={profileImageSrc}
                      referrerPolicy="no-referrer"
                    />
                    <AvatarFallback className="bg-custom-bg-warm-3 text-3xl font-bold text-custom-orange">
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
                        className="absolute -bottom-1 -right-1 flex size-9 items-center justify-center rounded-full border-2 border-white bg-custom-orange text-white shadow-md transition-colors hover:bg-custom-orange-deep cursor-pointer"
                        aria-label="Upload profile image"
                      >
                        <Camera className="size-4" />
                      </button>
                    </>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-custom-orange">
                      My Account
                    </p>
                    <h1 className="text-3xl font-extrabold tracking-tight text-custom-dark">
                      {backendUser?.name ?? 'User Profile'}
                    </h1>
                    <p className="text-sm font-semibold text-custom-gray-700">
                      {currentUser?.email ?? 'Email not available'}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className="border border-custom-orange/20 bg-custom-orange/10 px-3 py-1 text-custom-orange">
                      <Shield className="mr-1 size-3.5" />
                      {backendUser?.roleName ?? 'USER'}
                    </Badge>
                    <Badge className="border border-custom-gray-300/50 bg-white text-custom-dark px-3 py-1">
                      <Calendar className="mr-1 size-3.5 text-custom-orange" />
                      Joined {formattedDate}
                    </Badge>
                    <Badge className="border border-custom-gray-300/50 bg-white text-custom-dark px-3 py-1">
                      <Sparkles className="mr-1 size-3.5 text-custom-orange" />
                      {profileCompletion}% profile complete
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {!editing ? (
                  <Button
                    variant="outline"
                    className="h-10 rounded-lg border-custom-gray-300 bg-white cursor-pointer"
                    onClick={startEditing}
                  >
                    <Pencil className="size-4" />
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      className="h-10 rounded-lg border-custom-gray-300 bg-white cursor-pointer"
                      onClick={handleCancelEdit}
                    >
                      <X className="size-4" />
                      Cancel
                    </Button>
                    <Button
                      className="h-10 rounded-lg bg-custom-dark text-white hover:bg-custom-dark/90 cursor-pointer"
                      onClick={handleSave}
                      disabled={saving || !hasChanges}
                    >
                      <Save className="size-4" />
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </>
                )}
              </div>
            </div>

            {error && (
              <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {error}
              </div>
            )}
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
          <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <Card className="rounded-2xl border-custom-gray-300/50 bg-white py-0 shadow-sm overflow-hidden">
              <CardHeader className="px-5 py-5 border-b border-custom-gray-300/40 bg-custom-bg-warm-3/60">
                <CardTitle className="text-lg font-extrabold tracking-tight text-custom-dark">
                  Account Snapshot
                </CardTitle>
                <CardDescription className="text-custom-gray-700">
                  A quick overview of your profile status and sign-in method.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-5 py-5 space-y-3">
                <StatTile
                  label="Provider"
                  value={isPasswordUser ? 'Password' : 'Google'}
                />
                <StatTile
                  label="Phone"
                  value={backendUser?.phone ? 'Added' : 'Missing'}
                />
                <StatTile
                  label="National ID"
                  value={backendUser?.nid ? 'Verified' : 'Not added'}
                />
                <StatTile
                  label="Avatar"
                  value={
                    backendUser?.profilePictureUrl ? 'Uploaded' : 'Default'
                  }
                />
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden rounded-2xl border-custom-gray-300/50 bg-white py-0 shadow-sm">
              <img
                src={mapOverlay}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover opacity-[0.06]"
              />
              <CardHeader className="relative px-5 py-5 border-b border-custom-gray-300/40">
                <CardTitle className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-custom-dark">
                  <div className="flex size-8 items-center justify-center rounded-full bg-custom-orange/12">
                    <Shield className="size-4 text-custom-orange" />
                  </div>
                  Privacy & Security
                </CardTitle>
              </CardHeader>
              <CardContent className="relative px-5 py-5 space-y-3 text-sm text-custom-gray-700 leading-6">
                <p>
                  Your profile updates are sent through the authenticated API
                  and protected by your Firebase session.
                </p>
                <p>
                  National ID is intentionally locked after the first successful
                  save to prevent accidental changes.
                </p>
                {editing && isPasswordUser && (
                  <Badge className="border border-custom-orange/20 bg-custom-orange/10 text-custom-orange px-3 py-1">
                    Password fields are visible below while editing
                  </Badge>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="rounded-2xl border-custom-gray-300/50 bg-white py-0 shadow-sm">
              <CardHeader className="border-b border-custom-gray-300/40 bg-white px-5 py-5 md:px-6">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <CardTitle className="text-xl font-extrabold tracking-tight text-custom-dark">
                      Personal Information
                    </CardTitle>
                    <CardDescription className="mt-1 text-custom-gray-700">
                      Keep your contact and identity details updated for a
                      better UrbanNest experience.
                    </CardDescription>
                  </div>
                  {!editing && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-fit border-custom-gray-300 bg-white cursor-pointer"
                      onClick={startEditing}
                    >
                      <Pencil className="size-3.5" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </CardHeader>

              <CardContent className="px-5 py-5 md:px-6 md:py-6">
                <InfoRow
                  icon={<UserRound className="size-4" />}
                  label="Full Name"
                >
                  <p className="text-base font-semibold text-custom-dark">
                    {backendUser?.name ?? 'User'}
                  </p>
                </InfoRow>

                <InfoRow
                  icon={<Mail className="size-4" />}
                  label="Email Address"
                >
                  {editing ? (
                    <Input
                      value={backendUser?.email ?? ''}
                      disabled
                      className="h-10 border-custom-gray-300 bg-custom-bg-warm-3 text-custom-dark"
                    />
                  ) : (
                    <p className="text-base font-semibold text-custom-dark">
                      {backendUser?.email ?? 'Not provided'}
                    </p>
                  )}
                  <p className="text-xs font-semibold text-custom-gray-600">
                    Email is synced from your authenticated account.
                  </p>
                </InfoRow>

                <InfoRow
                  icon={<Phone className="size-4" />}
                  label="Phone Number"
                >
                  {editing ? (
                    <Input
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      placeholder="Enter your phone number"
                      type="tel"
                      className="h-10 border-custom-gray-300 bg-white"
                    />
                  ) : (
                    <p className="text-base font-semibold text-custom-dark">
                      {backendUser?.phone ?? (
                        <span className="italic font-medium text-custom-gray-600">
                          Not provided
                        </span>
                      )}
                    </p>
                  )}
                </InfoRow>

                <InfoRow
                  icon={<CreditCard className="size-4" />}
                  label="National ID"
                >
                  {editing ? (
                    <div className="space-y-2">
                      <Input
                        value={formNid}
                        onChange={(e) => setFormNid(e.target.value)}
                        placeholder="Enter your NID"
                        disabled={!!backendUser?.nid}
                        className="h-10 border-custom-gray-300 bg-white disabled:bg-custom-bg-warm-3"
                      />
                      {backendUser?.nid && (
                        <p className="text-xs font-semibold text-custom-gray-600">
                          NID cannot be changed once set.
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-base font-semibold text-custom-dark">
                      {backendUser?.nid ?? (
                        <span className="italic font-medium text-custom-gray-600">
                          Not provided
                        </span>
                      )}
                    </p>
                  )}
                </InfoRow>

                <InfoRow
                  icon={<Calendar className="size-4" />}
                  label="Member Since"
                  noBorder
                >
                  <p className="text-base font-semibold text-custom-dark">
                    {formattedDate}
                  </p>
                </InfoRow>
              </CardContent>
            </Card>

            {editing && isPasswordUser && (
              <Card className="rounded-2xl border-custom-gray-300/50 bg-white py-0 shadow-sm">
                <CardHeader className="border-b border-custom-gray-300/40 bg-custom-bg-warm-3/40 px-5 py-5 md:px-6">
                  <CardTitle className="text-xl font-extrabold tracking-tight text-custom-dark">
                    Change Password
                  </CardTitle>
                  <CardDescription className="text-custom-gray-700">
                    Update your password while editing your profile. Passwords
                    are not saved until you confirm changes in your auth flow.
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4 px-5 py-5 md:px-6 md:py-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="current-password"
                      className="text-sm font-semibold text-custom-dark"
                    >
                      Current password
                    </label>
                    <div className="relative">
                      <Input
                        id="current-password"
                        type={showCurrentPassword ? 'text' : 'password'}
                        placeholder="Enter current password"
                        className="h-10 border-custom-gray-300 bg-white pr-10"
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-custom-gray-600 hover:text-custom-dark transition-colors cursor-pointer"
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

                  <div className="space-y-2">
                    <label
                      htmlFor="new-password"
                      className="text-sm font-semibold text-custom-dark"
                    >
                      New password
                    </label>
                    <div className="relative">
                      <Input
                        id="new-password"
                        type={showNewPassword ? 'text' : 'password'}
                        placeholder="Enter new password"
                        className="h-10 border-custom-gray-300 bg-white pr-10"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-custom-gray-600 hover:text-custom-dark transition-colors cursor-pointer"
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

                  <div className="space-y-2">
                    <label
                      htmlFor="confirm-new-password"
                      className="text-sm font-semibold text-custom-dark"
                    >
                      Confirm new password
                    </label>
                    <div className="relative">
                      <Input
                        id="confirm-new-password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm new password"
                        className="h-10 border-custom-gray-300 bg-white pr-10"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-custom-gray-600 hover:text-custom-dark transition-colors cursor-pointer"
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

            {editing && (
              <div className="flex flex-col gap-3 rounded-2xl border border-custom-gray-300/50 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-bold text-custom-dark">
                    Ready to save your updates?
                  </p>
                  <p className="text-xs font-semibold text-custom-gray-600">
                    Changes include contact info, NID (if empty), and profile
                    image.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="border-custom-gray-300 bg-white cursor-pointer"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-custom-dark text-white hover:bg-custom-dark/90 cursor-pointer"
                    onClick={handleSave}
                    disabled={saving || !hasChanges}
                  >
                    <Save className="size-4" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
