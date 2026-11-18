'use client';

import { useState } from 'react';
import { UserCheckIcon, UserXIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { ConfirmDialog } from '@/shared/components/confirm-dialog';
import { Button } from '@/shared/ui/button';

import { useDeactivateMember, useReactivateMember } from '../api/members.queries';
import type { Member } from '../types/member';

/**
 * Status transitions. Deactivating asks for confirmation because the member loses access;
 * reactivating does not. The owner cannot be deactivated (the mock API also refuses it with 409).
 */
export function MemberStatusActions({ member }: { member: Member }) {
  const t = useTranslations('members.detail');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const deactivate = useDeactivateMember();
  const reactivate = useReactivateMember();

  async function run(action: typeof deactivate, successKey: 'deactivated' | 'reactivated') {
    try {
      await action.mutateAsync(member.id);
      toast.success(t(successKey, { name: member.name }));
      setIsConfirmOpen(false);
    } catch {
      toast.error(t('statusChangeFailed'));
    }
  }

  if (member.status === 'deactivated') {
    return (
      <Button
        variant="outline"
        disabled={reactivate.isPending}
        onClick={() => void run(reactivate, 'reactivated')}
      >
        <UserCheckIcon /> {t('reactivate')}
      </Button>
    );
  }

  return (
    <>
      <Button
        variant="outline"
        disabled={member.role === 'owner'}
        onClick={() => {
          setIsConfirmOpen(true);
        }}
      >
        <UserXIcon /> {t('deactivate')}
      </Button>
      <ConfirmDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title={t('deactivateTitle')}
        description={t('deactivateDescription', { name: member.name })}
        confirmLabel={t('deactivate')}
        onConfirm={() => void run(deactivate, 'deactivated')}
        isPending={deactivate.isPending}
        isDestructive
      />
    </>
  );
}
