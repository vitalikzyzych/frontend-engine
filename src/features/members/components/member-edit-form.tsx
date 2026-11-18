'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Link, useRouter } from '@/i18n/navigation';
import { applyFieldErrors } from '@/shared/lib/forms/apply-field-errors';
import { Button } from '@/shared/ui/button';

import { useUpdateMember } from '../api/members.queries';
import { memberFormSchema, type MemberFormValues } from '../schemas/member-form.schema';
import type { Member } from '../types/member';
import { MEMBER_FORM_FIELDS, MemberFormFields } from './member-form-fields';

/** Rendered only once the member is loaded, so default values never need a reset. */
export function MemberEditForm({ member }: { member: Member }) {
  const t = useTranslations('members.form');
  const router = useRouter();
  const updateMember = useUpdateMember();
  const memberHref = `/members/${member.id}`;

  const form = useForm<MemberFormValues>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: { name: member.name, email: member.email, role: member.role },
  });

  async function onSubmit(values: MemberFormValues) {
    try {
      await updateMember.mutateAsync({ id: member.id, input: values });
      toast.success(t('updated'));
      router.push(memberHref);
    } catch (error) {
      if (!applyFieldErrors(error, MEMBER_FORM_FIELDS, form.setError)) toast.error(t('saveFailed'));
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      noValidate
      className="grid max-w-xl gap-6 rounded-lg border p-6"
    >
      <MemberFormFields control={form.control} />
      <div className="flex justify-end gap-2">
        <Button variant="outline" asChild>
          <Link href={memberHref}>{t('cancel')}</Link>
        </Button>
        <Button type="submit" disabled={updateMember.isPending}>
          {t('save')}
        </Button>
      </div>
    </form>
  );
}
