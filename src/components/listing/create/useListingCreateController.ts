import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { createListing, getUploadUrl } from '@/api/generated';
import type { MediaItem } from '@/api/model';
import {
  IDLE_SUBMIT_STATE,
  createInitialListingCreateFormState,
} from './constants';
import type {
  ListingCreateFormState,
  MediaDraft,
  SubmitMode,
  SubmitState,
} from './types';
import { buildListingPayload, revokeMediaPreviews } from './utils';

function createMediaDraft(file: File): MediaDraft {
  return {
    id: crypto.randomUUID(),
    file,
    previewUrl: URL.createObjectURL(file),
    caption: '',
  };
}

export function useListingCreateController() {
  const { loggedIn, loading: authLoading } = useAuth();

  const [form, setForm] = useState<ListingCreateFormState>(() =>
    createInitialListingCreateFormState()
  );
  const [mediaItems, setMediaItems] = useState<MediaDraft[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [submitState, setSubmitState] =
    useState<SubmitState>(IDLE_SUBMIT_STATE);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaItemsRef = useRef<MediaDraft[]>([]);

  useEffect(() => {
    mediaItemsRef.current = mediaItems;
  }, [mediaItems]);

  useEffect(() => {
    return () => {
      revokeMediaPreviews(mediaItemsRef.current);
    };
  }, []);

  const canSubmit =
    !authLoading &&
    loggedIn &&
    submitState.stage !== 'uploading' &&
    submitState.stage !== 'submitting';

  const setTopField = <K extends keyof ListingCreateFormState>(
    key: K,
    value: ListingCreateFormState[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const setDetailsField = <K extends keyof ListingCreateFormState['details']>(
    key: K,
    value: ListingCreateFormState['details'][K]
  ) => {
    setForm((prev) => ({
      ...prev,
      details: { ...prev.details, [key]: value },
    }));
  };

  const setLocationField = <K extends keyof ListingCreateFormState['location']>(
    key: K,
    value: ListingCreateFormState['location'][K]
  ) => {
    setForm((prev) => ({
      ...prev,
      location: { ...prev.location, [key]: value },
    }));
  };

  const handleFilesAdded = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const nextItems = Array.from(files).map(createMediaDraft);
    setMediaItems((prev) => [...prev, ...nextItems]);
    setSubmitState(IDLE_SUBMIT_STATE);
  };

  const updateMediaCaption = (id: string, caption: string) => {
    setMediaItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, caption } : item))
    );
  };

  const removeMediaItem = (id: string) => {
    setMediaItems((prev) => {
      const item = prev.find((m) => m.id === id);
      if (item) URL.revokeObjectURL(item.previewUrl);
      return prev.filter((m) => m.id !== id);
    });
  };

  const moveMediaItem = (id: string, direction: 'up' | 'down') => {
    setMediaItems((prev) => {
      const index = prev.findIndex((item) => item.id === id);
      if (index < 0) return prev;

      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;

      const next = [...prev];
      const [item] = next.splice(index, 1);
      next.splice(targetIndex, 0, item);
      return next;
    });
  };

  const clearFormContent = () => {
    setForm(createInitialListingCreateFormState());
    setValidationErrors([]);
    setMediaItems((prev) => {
      revokeMediaPreviews(prev);
      return [];
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const resetForm = () => {
    clearFormContent();
    setSubmitState(IDLE_SUBMIT_STATE);
  };

  const uploadMedia = async (mode: SubmitMode): Promise<MediaItem[]> => {
    if (mediaItems.length === 0) return [];

    const uploaded: MediaItem[] = [];

    for (let index = 0; index < mediaItems.length; index += 1) {
      const item = mediaItems[index];
      const contentType = item.file.type || 'application/octet-stream';

      setSubmitState({
        mode,
        stage: 'uploading',
        message: `Uploading media ${index + 1} of ${mediaItems.length}...`,
      });

      const uploadRes = await getUploadUrl({
        fileName: item.file.name,
        contentType,
        category: 'listings',
      });

      const uploadUrl = uploadRes.data.uploadUrl;
      const key = uploadRes.data.key;

      if (!uploadUrl || !key) {
        throw new Error('Failed to get a valid upload URL from the server.');
      }

      const putRes = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': contentType },
        body: item.file,
      });

      if (!putRes.ok) {
        throw new Error(`Upload failed for ${item.file.name}.`);
      }

      uploaded.push({
        s3Location: key,
        contentType,
        sortOrder: index,
        byteSize: item.file.size,
        caption: item.caption.trim() || undefined,
      });
    }

    return uploaded;
  };

  const handleSubmit = async (mode: SubmitMode) => {
    setValidationErrors([]);
    setSubmitState({ mode, stage: 'idle', message: null });

    try {
      const preValidation = buildListingPayload(form, [], mode === 'publish');

      if (!preValidation.payload) {
        setValidationErrors(preValidation.errors);
        setSubmitState({
          mode,
          stage: 'error',
          message: 'Please fix the highlighted form issues and try again.',
        });
        return;
      }

      const uploadedMedia = await uploadMedia(mode);
      const { payload, errors } = buildListingPayload(
        form,
        uploadedMedia,
        mode === 'publish'
      );

      if (!payload) {
        setValidationErrors(errors);
        setSubmitState({
          mode,
          stage: 'error',
          message: 'Form validation failed. Please review your inputs.',
        });
        return;
      }

      setSubmitState({
        mode,
        stage: 'submitting',
        message:
          mode === 'publish'
            ? 'Publishing listing...'
            : 'Saving listing as draft...',
      });

      const response = await createListing(payload);
      if (response.data.success === false) {
        throw new Error(
          response.data.message || 'Listing creation failed on the server.'
        );
      }

      const successMessage =
        response.data.message ||
        (mode === 'publish'
          ? 'Listing published successfully.'
          : 'Listing saved as draft successfully.');

      clearFormContent();
      setSubmitState({
        mode,
        stage: 'success',
        message: successMessage,
      });
    } catch (error) {
      setSubmitState({
        mode,
        stage: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Failed to create listing. Please try again.',
      });
    }
  };

  return {
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
    coverCandidate: mediaItems[0],
  };
}
