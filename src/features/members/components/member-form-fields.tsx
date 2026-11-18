'use client';

import { useTranslations } from 'next-intl';
import { Controller, type Control } from 'react-hook-form';

import { Field, FieldError, FieldGroup, FieldLabel } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';

import type { MemberFormValues } from '../schemas/member-form.schema';
import { MEMBER_ROLES } from '../types/member';

export const MEMBER_FORM_FIELDS = ['name', 'email', 'role'] as const;

/**
 * The member fields, shared by the invite dialog and the edit page.
 * The form itself (submit, buttons, layout) stays with each of them.
 */
export function MemberFormFields({ control }: { control: Control<MemberFormValues> }) {
  const t = useTranslations('members.form');
  const tValidation = useTranslations('validation');
  const tRoles = useTranslations('members.roles');

  function translateError(message: string | undefined) {
    if (!message) return undefined;
    return tValidation.has(message as never) ? tValidation(message as never) : message;
  }

  return (
    <FieldGroup>
      <Controller
        name="name"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="member-name">{t('name')}</FieldLabel>
            <Input
              {...field}
              id="member-name"
              autoComplete="name"
              aria-invalid={fieldState.invalid}
            />
            <FieldError>{translateError(fieldState.error?.message)}</FieldError>
          </Field>
        )}
      />
      <Controller
        name="email"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="member-email">{t('email')}</FieldLabel>
            <Input
              {...field}
              id="member-email"
              type="email"
              autoComplete="email"
              aria-invalid={fieldState.invalid}
            />
            <FieldError>{translateError(fieldState.error?.message)}</FieldError>
          </Field>
        )}
      />
      <Controller
        name="role"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="member-role">{t('role')}</FieldLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="member-role" aria-invalid={fieldState.invalid}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MEMBER_ROLES.map((role) => (
                  <SelectItem key={role} value={role}>
                    {tRoles(role)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError>{translateError(fieldState.error?.message)}</FieldError>
          </Field>
        )}
      />
    </FieldGroup>
  );
}
