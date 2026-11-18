---
name: forms
description: How to build forms - dialog and full-page forms, React Hook Form with zodResolver, shadcn Field components, translated validation messages and server field errors.
---

# Forms

- Schema in `features/<name>/schemas/`. Error messages are keys of the `validation` namespace (`{ error: 'nameTooShort' }`); add the key to the messages files.
- `useForm<Values>({ resolver: zodResolver(schema), defaultValues })`. Always give full default values.
- Fields live in one `<entity>-form-fields.tsx` that takes `control`, so a dialog and a page can share them. Render each with `Controller` and `Field`, `FieldLabel`, `FieldError` from `@/shared/ui/field`. Set `aria-invalid` and `data-invalid` from `fieldState.invalid`.
- Translate errors: `tValidation.has(key) ? tValidation(key) : key`.
- Submit with `mutateAsync`. On failure, `applyFieldErrors(error, FIELDS, form.setError)` from `@/shared/lib/forms/apply-field-errors`; when it returns false, show `toast.error`.
- Disable submit while the mutation is pending. Show `toast.success` on success.
- Dialog forms (small creates): reset the form when the dialog opens (`useEffect` on `open`), close on success. Reference: `member-invite-dialog.tsx`.
- Page forms (edit, larger forms): mount the form only after the record has loaded, so `defaultValues` are the current values without a reset. Cancel is a link back; on success navigate with `useRouter` from `@/i18n/navigation`. Reference: `member-edit-view.tsx` and `member-edit-form.tsx`.
