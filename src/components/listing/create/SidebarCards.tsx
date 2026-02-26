import { CheckCircle2, Loader2, Save } from 'lucide-react';
import sidePattern from '@/assets/logos/img_map.png';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatPill } from './shared';
import type { MediaDraft, SubmitMode, SubmitState } from './types';
import { formatLabel } from './utils';

type PublishControlsCardProps = {
  canSubmit: boolean;
  submitState: SubmitState;
  onSubmit: (mode: SubmitMode) => void;
  onReset: () => void;
};

export function PublishControlsCard({
  canSubmit,
  submitState,
  onSubmit,
  onReset,
}: PublishControlsCardProps) {
  const isSubmittingDraft =
    submitState.mode === 'draft' &&
    (submitState.stage === 'uploading' || submitState.stage === 'submitting');
  const isSubmittingPublish =
    submitState.mode === 'publish' &&
    (submitState.stage === 'uploading' || submitState.stage === 'submitting');
  const isBusy =
    submitState.stage === 'uploading' || submitState.stage === 'submitting';

  return (
    <Card className="rounded-2xl border-custom-gray-300/50 bg-white py-0 shadow-sm overflow-hidden">
      <CardHeader className="border-b border-custom-gray-300/40 bg-custom-bg-warm-3/70 px-5 py-5">
        <CardTitle className="text-lg font-extrabold tracking-tight text-custom-dark">
          Publish Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 px-5 py-5">
        <div className="rounded-xl border border-custom-gray-300/40 bg-white p-4">
          <p className="text-sm font-extrabold text-custom-dark">
            Save as draft
          </p>
          <p className="mt-1 text-xs font-semibold leading-5 text-custom-gray-700">
            Stores the listing without publishing it publicly.
          </p>
          <Button
            type="button"
            className="mt-4 w-full border border-custom-gray-300 bg-white text-custom-dark hover:bg-custom-bg-warm-3 cursor-pointer"
            onClick={() => onSubmit('draft')}
            disabled={!canSubmit}
          >
            {isSubmittingDraft && <Loader2 className="size-4 animate-spin" />}
            <Save className="size-4" />
            Save Draft
          </Button>
        </div>

        <div className="rounded-xl border border-custom-orange/20 bg-custom-orange/8 p-4">
          <p className="text-sm font-extrabold text-custom-dark">
            Publish listing
          </p>
          <p className="mt-1 text-xs font-semibold leading-5 text-custom-gray-700">
            Creates the listing and marks it as published immediately.
          </p>
          <Button
            type="button"
            className="mt-4 w-full bg-custom-dark text-white hover:bg-custom-dark/90 cursor-pointer"
            onClick={() => onSubmit('publish')}
            disabled={!canSubmit}
          >
            {isSubmittingPublish && <Loader2 className="size-4 animate-spin" />}
            <CheckCircle2 className="size-4" />
            Publish Now
          </Button>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full border-custom-gray-300 bg-white cursor-pointer"
          onClick={onReset}
          disabled={isBusy}
        >
          Reset Form
        </Button>
      </CardContent>
    </Card>
  );
}

type SubmissionChecklistCardProps = {
  coverCandidate?: MediaDraft;
};

export function SubmissionChecklistCard({
  coverCandidate,
}: SubmissionChecklistCardProps) {
  return (
    <Card className="relative overflow-hidden rounded-2xl border-custom-gray-300/50 bg-white py-0 shadow-sm">
      <img
        src={sidePattern}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover opacity-[0.06]"
      />
      <CardHeader className="relative border-b border-custom-gray-300/40 px-5 py-5">
        <CardTitle className="text-lg font-extrabold tracking-tight text-custom-dark">
          Submission Checklist
        </CardTitle>
      </CardHeader>
      <CardContent className="relative space-y-3 px-5 py-5 text-sm font-semibold text-custom-gray-700">
        <p>• Title, property type, price, and required details are filled.</p>
        <p>• Address and geo coordinates are valid.</p>
        <p>• Media files are ordered correctly (cover first).</p>
        <p>• You are logged in with an authorized account.</p>
        <p>• Choose draft or publish based on workflow.</p>
        {coverCandidate && (
          <div className="mt-2 rounded-xl border border-custom-gray-300/40 bg-white p-3">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-custom-gray-600">
              Cover Preview File
            </p>
            <p className="mt-1 truncate text-sm font-extrabold text-custom-dark">
              {coverCandidate.file.name}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

type HeroStatsProps = {
  propertyType: string;
  mediaCount: number;
  submitState: SubmitState;
  authLoading: boolean;
  loggedIn: boolean;
};

export function HeroStats({
  propertyType,
  mediaCount,
  submitState,
  authLoading,
  loggedIn,
}: HeroStatsProps) {
  const items = [
    {
      label: 'Property Type',
      value: propertyType ? formatLabel(propertyType) : 'Unset',
    },
    {
      label: 'Media',
      value: `${mediaCount} file${mediaCount === 1 ? '' : 's'}`,
    },
    {
      label: 'Mode',
      value: submitState.mode ? formatLabel(submitState.mode) : 'Draft/Publish',
    },
    {
      label: 'Auth',
      value: authLoading ? 'Checking' : loggedIn ? 'Ready' : 'Login required',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:w-[430px]">
      {items.map((item) => (
        <StatPill key={item.label} label={item.label} value={item.value} />
      ))}
    </div>
  );
}
