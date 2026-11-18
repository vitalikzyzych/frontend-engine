import { AppError } from '@/shared/lib/http/app-error';

import { applyFieldErrors } from './apply-field-errors';

const FIELDS = ['name', 'email'] as const;

function conflict(fieldErrors: Record<string, string>) {
  return new AppError({ kind: 'http', status: 409, message: 'Conflict', fieldErrors });
}

describe('applyFieldErrors', () => {
  it('sets server errors on known fields and reports that it did', () => {
    const setError = vi.fn();

    const isApplied = applyFieldErrors(conflict({ email: 'emailTaken' }), FIELDS, setError);

    expect(isApplied).toBe(true);
    expect(setError).toHaveBeenCalledWith('email', { message: 'emailTaken' });
  });

  it('ignores errors for fields the form does not have', () => {
    const setError = vi.fn();

    const isApplied = applyFieldErrors(conflict({ unknown: 'x' }), FIELDS, setError);

    expect(isApplied).toBe(false);
    expect(setError).not.toHaveBeenCalled();
  });

  it('does nothing for errors that are not AppError', () => {
    const setError = vi.fn();

    expect(applyFieldErrors(new Error('boom'), FIELDS, setError)).toBe(false);
    expect(setError).not.toHaveBeenCalled();
  });
});
