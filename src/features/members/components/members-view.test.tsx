import { screen, waitFor, within } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/render';
import { http, HttpResponse } from 'msw';

import { server } from '@/mocks/server';
import { apiUrl } from '@/shared/lib/http/http-client';

import { MembersView } from './members-view';

/** Waits until the table has finished loading and returns its body rows. */
async function findRows() {
  const table = await screen.findByRole('table');
  const body = table.querySelector('tbody');
  await waitFor(() => {
    expect(body).toHaveAttribute('aria-busy', 'false');
  });
  return within(table).getAllByRole('row').slice(1);
}

describe('MembersView', () => {
  it('shows the first page of members', async () => {
    renderWithProviders(<MembersView />);

    expect(await findRows()).toHaveLength(10);
    expect(screen.getByText('42 items')).toBeInTheDocument();
  });

  it('reads filters from the URL', async () => {
    renderWithProviders(<MembersView />, { searchParams: { role: 'owner' } });

    const rows = await findRows();
    expect(rows).toHaveLength(1);
    expect(within(rows[0]!).getByText('Owner')).toBeInTheDocument();
  });

  it('searches members and writes the search to the URL', async () => {
    const onUrlUpdate = vi.fn();
    const { user } = renderWithProviders(<MembersView />, { onUrlUpdate });
    await findRows();

    await user.type(screen.getByRole('searchbox'), 'grace');

    await waitFor(() => {
      expect(onUrlUpdate).toHaveBeenCalledWith(
        expect.objectContaining({ queryString: expect.stringContaining('search=grace') as string }),
      );
    });
  });

  it('shows an empty state when nothing matches', async () => {
    renderWithProviders(<MembersView />, { searchParams: { search: 'nobody-matches-this' } });

    expect(await screen.findByText('No matching members')).toBeInTheDocument();
  });

  it('shows an error state with retry when the request fails', async () => {
    server.use(http.get(apiUrl('members'), () => HttpResponse.json({}, { status: 500 })));
    renderWithProviders(<MembersView />);

    expect(await screen.findByRole('alert')).toHaveTextContent('The server ran into a problem');
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
  });

  it('invites a member and refreshes the list', async () => {
    const { user } = renderWithProviders(<MembersView />);
    await findRows();

    await user.click(screen.getByRole('button', { name: 'Invite member' }));
    const dialog = await screen.findByRole('dialog');
    await user.type(within(dialog).getByLabelText('Name'), 'New Person');
    await user.type(within(dialog).getByLabelText('Email'), 'new.person@example.com');
    await user.click(within(dialog).getByRole('button', { name: 'Send invite' }));

    expect(await screen.findByText('Invitation sent')).toBeInTheDocument();
    expect(await screen.findByText('43 items')).toBeInTheDocument();
  });

  it('shows validation errors from the schema', async () => {
    const { user } = renderWithProviders(<MembersView />);
    await findRows();

    await user.click(screen.getByRole('button', { name: 'Invite member' }));
    const dialog = await screen.findByRole('dialog');
    await user.type(within(dialog).getByLabelText('Name'), 'A');
    await user.click(within(dialog).getByRole('button', { name: 'Send invite' }));

    expect(
      await within(dialog).findByText('Name must be at least 2 characters'),
    ).toBeInTheDocument();
    expect(within(dialog).getByText('Enter a valid email address')).toBeInTheDocument();
  });

  it('maps server field errors onto the form', async () => {
    const { user } = renderWithProviders(<MembersView />);
    const [firstRow] = await findRows();
    const existingEmail = within(firstRow!).getAllByRole('cell')[1]!.textContent;

    await user.click(screen.getByRole('button', { name: 'Invite member' }));
    const dialog = await screen.findByRole('dialog');
    await user.type(within(dialog).getByLabelText('Name'), 'Duplicate Person');
    await user.type(within(dialog).getByLabelText('Email'), existingEmail ?? '');
    await user.click(within(dialog).getByRole('button', { name: 'Send invite' }));

    expect(await within(dialog).findByText('This email is already a member')).toBeInTheDocument();
  });
});
