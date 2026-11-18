import { type PropsWithChildren, type ReactElement } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, type RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import { NuqsTestingAdapter, type OnUrlUpdateFunction } from 'nuqs/adapters/testing';

import { formats } from '@/i18n/formats';
import messages from '@/i18n/messages/en.json';
import { Toaster } from '@/shared/ui/sonner';
import { TooltipProvider } from '@/shared/ui/tooltip';

interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
  /** Initial URL search params, for components that read state from the URL. */
  searchParams?: string | Record<string, string>;
  onUrlUpdate?: OnUrlUpdateFunction;
}

/** Renders a component with the same providers the app uses, minus the real network. */
export function renderWithProviders(
  ui: ReactElement,
  { searchParams, onUrlUpdate, ...options }: RenderWithProvidersOptions = {},
) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  function Wrapper({ children }: PropsWithChildren) {
    return (
      <NextIntlClientProvider locale="en" messages={messages} formats={formats} timeZone="UTC">
        <QueryClientProvider client={queryClient}>
          <NuqsTestingAdapter searchParams={searchParams} onUrlUpdate={onUrlUpdate} hasMemory>
            <TooltipProvider>
              {children}
              <Toaster />
            </TooltipProvider>
          </NuqsTestingAdapter>
        </QueryClientProvider>
      </NextIntlClientProvider>
    );
  }

  return {
    user: userEvent.setup(),
    queryClient,
    ...render(ui, { wrapper: Wrapper, ...options }),
  };
}
