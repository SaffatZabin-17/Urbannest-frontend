import { Link } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Sparkles,
} from 'lucide-react';
import heroBg from '@/assets/logos/img_create_blog_bg.jpg';
import sidePattern from '@/assets/logos/img_map.png';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  BasicInformationSection,
  LocationSection,
  MediaUploadsSection,
  PropertyDetailsSection,
} from '@/components/listing/create/FormSections';
import {
  HeroStats,
  PublishControlsCard,
  SubmissionChecklistCard,
} from '@/components/listing/create/SidebarCards';
import { useListingCreateController } from '@/components/listing/create/useListingCreateController';

export default function ListingCreatePage() {
  const {
    authLoading,
    loggedIn,
    canSubmit,
    fileInputRef,
    form,
    mediaItems,
    submitState,
    validationErrors,
    setTopField,
    setDetailsField,
    setLocationField,
    handleFilesAdded,
    updateMediaCaption,
    removeMediaItem,
    moveMediaItem,
    handleSubmit,
    resetForm,
    coverCandidate,
  } = useListingCreateController();

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-custom-bg-warm-1 px-4 py-8 md:px-5 lg:px-30 lg:py-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="relative overflow-hidden rounded-3xl border border-custom-gray-300/50 bg-white shadow-sm">
          <div className="absolute inset-0">
            <img
              src={heroBg}
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover opacity-[0.14]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-custom-bg-warm-2/90" />
          </div>
          <img
            src={sidePattern}
            alt=""
            aria-hidden="true"
            className="absolute right-0 top-0 h-full w-1/2 object-cover opacity-[0.07]"
          />

          <div className="relative p-5 md:p-7 lg:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-4">
                <Link
                  to="/search"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-custom-gray-700 transition-colors hover:text-custom-orange"
                >
                  <ArrowLeft className="size-4" />
                  Back to Search
                </Link>

                <div className="space-y-3">
                  <Badge className="border border-custom-orange/20 bg-custom-orange/10 px-3 py-1 text-custom-orange">
                    <Sparkles className="mr-1 size-3.5" />
                    Listing Creation
                  </Badge>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-custom-dark">
                    Create a new property listing
                  </h1>
                  <p className="max-w-3xl text-sm md:text-base font-semibold leading-7 text-custom-gray-700">
                    Fill in property details, location, and media. Save as a
                    draft or publish immediately. All submissions use the typed
                    OpenAPI client and authenticated backend endpoints.
                  </p>
                </div>
              </div>

              <HeroStats
                propertyType={form.propertyType ?? ''}
                mediaCount={mediaItems.length}
                submitState={submitState}
                authLoading={authLoading}
                loggedIn={loggedIn}
              />
            </div>
          </div>
        </section>

        {!authLoading && !loggedIn && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-semibold text-amber-800">
            You must be logged in to create a listing. Please{' '}
            <Link to="/login" className="underline underline-offset-2">
              log in
            </Link>{' '}
            first.
          </div>
        )}

        {submitState.message && (
          <div
            className={cn(
              'rounded-2xl border px-5 py-4 text-sm font-semibold',
              submitState.stage === 'success' &&
                'border-emerald-200 bg-emerald-50 text-emerald-800',
              submitState.stage === 'error' &&
                'border-red-200 bg-red-50 text-red-700',
              (submitState.stage === 'uploading' ||
                submitState.stage === 'submitting' ||
                submitState.stage === 'idle') &&
                'border-custom-gray-300/60 bg-white text-custom-dark'
            )}
          >
            <div className="flex items-center gap-2">
              {submitState.stage === 'success' ? (
                <CheckCircle2 className="size-4" />
              ) : submitState.stage === 'error' ? (
                <AlertCircle className="size-4" />
              ) : (
                <Loader2 className="size-4 animate-spin" />
              )}
              <span>{submitState.message}</span>
            </div>
          </div>
        )}

        {validationErrors.length > 0 && (
          <Card className="rounded-2xl border-red-200 bg-red-50/70 py-0 shadow-sm">
            <CardHeader className="border-b border-red-200/70 px-5 py-4">
              <CardTitle className="text-base font-extrabold text-red-700">
                Please fix these issues before submitting
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 py-4">
              <ul className="list-disc space-y-1 pl-5 text-sm font-semibold text-red-700">
                {validationErrors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_330px]">
          <div className="space-y-6">
            <BasicInformationSection
              title={form.title}
              propertyType={form.propertyType}
              pricing={form.pricing}
              description={form.description}
              setTopField={setTopField}
            />
            <PropertyDetailsSection
              details={form.details}
              setDetailsField={setDetailsField}
            />
            <LocationSection
              location={form.location}
              setLocationField={setLocationField}
            />
            <MediaUploadsSection
              mediaItems={mediaItems}
              fileInputRef={fileInputRef}
              onAddFiles={handleFilesAdded}
              onMoveMediaItem={moveMediaItem}
              onRemoveMediaItem={removeMediaItem}
              onUpdateMediaCaption={updateMediaCaption}
            />
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <PublishControlsCard
              canSubmit={canSubmit}
              submitState={submitState}
              onSubmit={handleSubmit}
              onReset={resetForm}
            />
            <SubmissionChecklistCard coverCandidate={coverCandidate} />
          </aside>
        </div>
      </div>
    </div>
  );
}
