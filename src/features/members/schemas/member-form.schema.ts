import { z } from 'zod';

import { MEMBER_ROLES } from '../types/member';

/**
 * Error messages are translation keys from the `validation` namespace,
 * so the same schema works in every language.
 */
export const memberFormSchema = z.object({
  name: z.string().trim().min(2, { error: 'nameTooShort' }).max(100, { error: 'nameTooLong' }),
  email: z.email({ error: 'emailInvalid' }),
  role: z.enum(MEMBER_ROLES, { error: 'required' }),
});

export type MemberFormValues = z.infer<typeof memberFormSchema>;
