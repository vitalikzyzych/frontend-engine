---
name: forms
description: How to build forms - React Hook Form with zodResolver, shadcn Field components, translated validation messages and server field errors.
---

# Forms

- Schema in `features/<name>/schemas/`. Error messages are keys of the `validation` namespace (`{ error: 'nameTooShort' }`); add the key to the messages files.
- `useForm<Values>({ resolver: zodResolver(schema), defaultValues })`. Always give full default values.
- Render fields with `Controller` and `Field`, `FieldLabel`, `FieldError` from `@/shared/ui/field`. Set `aria-invalid` and `data-invalid` from `fieldState.invalid`.
- Translate errors: `tValidation.has(key) ? tValidation(key) : key`.
- Submit with `mutateAsync`. On `AppError` with `fieldErrors`, call `form.setError(field, { message })` for known fields; otherwise show `toast.error`.
- Disable submit while the mutation is pending. Show `toast.success` and close dialogs on success.
- Reset the form when a dialog opens (`useEffect` on `open`).
- Reference: `src/features/members/components/member-form-dialog.tsx`.
