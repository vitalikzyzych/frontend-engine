import { screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/render';
import { routerMock } from '@tests/utils/router';

import { MemberEditView } from './member-edit-view';

// Seed data: mem_001 is Ada Lovelace (ada.lovelace1@example.com), mem_002 is Grace Hopper.

describe('MemberEditView', () => {
  it('fills the form with the current values and saves', async () => {
    const { user } = renderWithProviders(<MemberEditView id="mem_002" />);

    const nameInput = await screen.findByLabelText('Name');
    expect(nameInput).toHaveValue('Grace Hopper');
    expect(screen.getByLabelText('Email')).toHaveValue('grace.hopper2@example.com');
    expect(screen.getByRole('link', { name: 'Cancel' })).toHaveAttribute(
      'href',
      '/members/mem_002',
    );

    await user.clear(nameInput);
    await user.type(nameInput, 'Grace B. Hopper');
    await user.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(await screen.findByText('Member updated')).toBeInTheDocument();
    expect(routerMock.push).toHaveBeenCalledWith('/members/mem_002');
  });

  it('maps server field errors onto the form', async () => {
    const { user } = renderWithProviders(<MemberEditView id="mem_002" />);

    const emailInput = await screen.findByLabelText('Email');
    await user.clear(emailInput);
    await user.type(emailInput, 'ada.lovelace1@example.com');
    await user.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(await screen.findByText('This email is already a member')).toBeInTheDocument();
    expect(routerMock.push).not.toHaveBeenCalled();
  });

  it('shows a not-found state for an unknown member', async () => {
    renderWithProviders(<MemberEditView id="mem_999" />);

    expect(await screen.findByText('Member not found')).toBeInTheDocument();
  });
});
