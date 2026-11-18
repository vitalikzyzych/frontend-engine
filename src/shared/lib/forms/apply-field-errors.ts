import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';

import { isAppError } from '@/shared/lib/http/app-error';

/**
 * Puts server field errors (`AppError.fieldErrors`) on the matching form fields.
 * Returns false when nothing was set, so the caller can show a general error instead.
 */
export function applyFieldErrors<TValues extends FieldValues>(
  error: unknown,
  fields: readonly Path<TValues>[],
  setError: UseFormSetError<TValues>,
): boolean {
  if (!isAppError(error)) return false;

  let isApplied = false;
  for (const field of fields) {
    const message = error.fieldErrors[field];
    if (message) {
      setError(field, { message });
      isApplied = true;
    }
  }
  return isApplied;
}
