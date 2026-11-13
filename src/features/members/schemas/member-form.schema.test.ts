import { memberFormSchema } from './member-form.schema';

describe('memberFormSchema', () => {
  it('accepts a valid member and trims the name', () => {
    const result = memberFormSchema.parse({
      name: '  Ada Lovelace ',
      email: 'ada@example.com',
      role: 'admin',
    });
    expect(result.name).toBe('Ada Lovelace');
  });

  it('returns translation keys as error messages', () => {
    const result = memberFormSchema.safeParse({ name: 'A', email: 'not-an-email', role: 'admin' });
    expect(result.success).toBe(false);
    const messages = result.error?.issues.map((issue) => issue.message);
    expect(messages).toEqual(['nameTooShort', 'emailInvalid']);
  });
});
