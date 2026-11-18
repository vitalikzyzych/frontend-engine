'use client';

import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { applyFieldErrors } from '@/shared/lib/forms/apply-field-errors';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';

import { useCreateMember } from '../api/members.queries';
import { memberFormSchema, type MemberFormValues } from '../schemas/member-form.schema';
import { MEMBER_FORM_FIELDS, MemberFormFields } from './member-form-fields';

const EMPTY_VALUES: MemberFormValues = { name: '', email: '', role: 'member' };

interface MemberInviteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** Small create form in a dialog. Editing has its own page: see `member-edit-view.tsx`. */
export function MemberInviteDialog({ open, onOpenChange }: MemberInviteDialogProps) {
  const t = useTranslations('members.form');
  const createMember = useCreateMember();

  const form = useForm<MemberFormValues>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: EMPTY_VALUES,
  });

  useEffect(() => {
    if (open) form.reset(EMPTY_VALUES);
  }, [open, form]);

  async function onSubmit(values: MemberFormValues) {
    try {
      await createMember.mutateAsync(values);
      toast.success(t('created'));
      onOpenChange(false);
    } catch (error) {
      if (!applyFieldErrors(error, MEMBER_FORM_FIELDS, form.setError)) toast.error(t('saveFailed'));
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="grid gap-6">
          <DialogHeader>
            <DialogTitle>{t('createTitle')}</DialogTitle>
            <DialogDescription>{t('createDescription')}</DialogDescription>
          </DialogHeader>

          <MemberFormFields control={form.control} />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createMember.isPending}
            >
              {t('cancel')}
            </Button>
            <Button type="submit" disabled={createMember.isPending}>
              {t('create')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
