import { screen, waitFor, within } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/render';
import { http, HttpResponse } from 'msw';

import { server } from '@/mocks/server';
import { apiUrl } from '@/shared/lib/http/http-client';

import { MemberDetailView } from './member-detail-view';

// Seed data: mem_001 is Ada Lovelace, the owner. mem_002 is Grace Hopper, an active member.
// mem_006 is Linus Hamilton, deactivated, with three events.

/** The value next to a label in the details list. */
function detailValue(label: string) {
  return screen.getByText(label, { selector: 'dt' }).nextElementSibling;
}

describe('MemberDetailView', () => {
  it("shows the member's details", async () => {
    renderWithProviders(<MemberDetailView id="mem_001" />);

    expect(await screen.findByRole('heading', { name: 'Ada Lovelace' })).toBeInTheDocument();
    expect(detailValue('Email')).toHaveTextContent('ada.lovelace1@example.com');
    expect(detailValue('Role')).toHaveTextContent('Owner');
    expect(detailValue('Status')).toHaveTextContent('Active');
    expect(detailValue('Joined')).toHaveTextContent('Jan 1, 2026');
    expect(screen.getByRole('link', { name: 'Members' })).toHaveAttribute('href', '/members');
    expect(screen.getByRole('link', { name: 'Edit' })).toHaveAttribute(
      'href',
      '/members/mem_001/edit',
    );
  });

  it('opens the tab from the URL and writes tab changes to the URL', async () => {
    const onUrlUpdate = vi.fn();
    const { user } = renderWithProviders(<MemberDetailView id="mem_002" />, {
      searchParams: { tab: 'activity' },
      onUrlUpdate,
    });

    expect(await screen.findByRole('tab', { name: 'Activity' })).toHaveAttribute(
      'aria-selected',
      'true',
    );

    await user.click(screen.getByRole('tab', { name: 'Overview' }));
    await user.click(screen.getByRole('tab', { name: 'Activity' }));

    await waitFor(() => {
      expect(onUrlUpdate).toHaveBeenLastCalledWith(
        expect.objectContaining({ queryString: '?tab=activity' }),
      );
    });
  });

  it('lists activity newest first', async () => {
    renderWithProviders(<MemberDetailView id="mem_006" />, { searchParams: { tab: 'activity' } });

    const list = await screen.findByRole('list', { name: 'Activity' });
    const items = within(list).getAllByRole('listitem');
    expect(items.map((item) => item.firstElementChild?.textContent)).toEqual([
      'Deactivated',
      'Joined',
      'Invited',
    ]);
    expect(items[0]).toHaveTextContent('Jan 9, 2026, 9:30 AM');
  });

  it('shows a not-found state for an unknown member', async () => {
    renderWithProviders(<MemberDetailView id="mem_999" />);

    expect(await screen.findByText('Member not found')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to members' })).toHaveAttribute(
      'href',
      '/members',
    );
  });

  it('shows an error state with retry when the request fails', async () => {
    server.use(http.get(apiUrl('members/:id'), () => HttpResponse.json({}, { status: 500 })));
    renderWithProviders(<MemberDetailView id="mem_002" />);

    expect(await screen.findByRole('alert')).toHaveTextContent('The server ran into a problem');
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
  });

  it('deactivates a member after confirmation and reactivates them', async () => {
    const { user } = renderWithProviders(<MemberDetailView id="mem_002" />);
    await screen.findByRole('heading', { name: 'Grace Hopper' });

    await user.click(screen.getByRole('button', { name: 'Deactivate' }));
    const confirm = await screen.findByRole('alertdialog', { name: 'Deactivate member?' });
    await user.click(within(confirm).getByRole('button', { name: 'Deactivate' }));

    expect(await screen.findByText('Grace Hopper was deactivated')).toBeInTheDocument();
    await waitFor(() => {
      expect(detailValue('Status')).toHaveTextContent('Deactivated');
    });

    await user.click(screen.getByRole('button', { name: 'Reactivate' }));

    expect(await screen.findByText('Grace Hopper was reactivated')).toBeInTheDocument();
    await waitFor(() => {
      expect(detailValue('Status')).toHaveTextContent('Active');
    });
  });

  it('does not allow deactivating the owner', async () => {
    renderWithProviders(<MemberDetailView id="mem_001" />);
    await screen.findByRole('heading', { name: 'Ada Lovelace' });

    expect(screen.getByRole('button', { name: 'Deactivate' })).toBeDisabled();
  });
});
