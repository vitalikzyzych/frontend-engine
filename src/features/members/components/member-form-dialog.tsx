'use client';

import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { isAppError } from '@/shared/lib/http/app-error';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';

import { useCreateMember, useUpdateMember } from '../api/members.queries';
import { memberFormSchema, type MemberFormValues } from '../schemas/member-form.schema';
import { MEMBER_ROLES, type Member } from '../types/member';

const EMPTY_VALUES: MemberFormValues = { name: '', email: '', role: 'member' };

interface MemberFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Edit mode when a member is given, create mode otherwise. */
  member?: Member | null;
}

export function MemberFormDialog({ open, onOpenChange, member }: MemberFormDialogProps) {
  const t = useTranslations('members.form');
  const tValidation = useTranslations('validation');
  const tRoles = useTranslations('members.roles');
  const isEdit = Boolean(member);
  const createMember = useCreateMember();
  const updateMember = useUpdateMember();
  const isPending = createMember.isPending || updateMember.isPending;

  const form = useForm<MemberFormValues>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: EMPTY_VALUES,
  });

  useEffect(() => {
    if (open) {
      form.reset(
        member ? { name: member.name, email: member.email, role: member.role } : EMPTY_VALUES,
      );
    }
  }, [open, member, form]);

  async function onSubmit(values: MemberFormValues) {
    try {
      if (member) await updateMember.mutateAsync({ id: member.id, input: values });
      else await createMember.mutateAsync(values);
      toast.success(t(isEdit ? 'updated' : 'created'));
      onOpenChange(false);
    } catch (error) {
      const fieldErrors = isAppError(error) ? error.fieldErrors : {};
      const fields = Object.keys(fieldErrors).filter(
        (field): field is keyof MemberFormValues => field in EMPTY_VALUES,
      );
      for (const field of fields) {
        form.setError(field, { message: fieldErrors[field] });
      }
      if (fields.length === 0) toast.error(t('saveFailed'));
    }
  }

  function translateError(message: string | undefined) {
    if (!message) return undefined;
    return tValidation.has(message as never) ? tValidation(message as never) : message;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="grid gap-6">
          <DialogHeader>
            <DialogTitle>{t(isEdit ? 'editTitle' : 'createTitle')}</DialogTitle>
            <DialogDescription>
              {t(isEdit ? 'editDescription' : 'createDescription')}
            </DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
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
              control={form.control}
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
              control={form.control}
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

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              {t('cancel')}
            </Button>
            <Button type="submit" disabled={isPending}>
              {t(isEdit ? 'save' : 'create')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
