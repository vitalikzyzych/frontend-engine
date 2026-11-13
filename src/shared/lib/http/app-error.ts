export type AppErrorKind = 'network' | 'http' | 'parse';

interface AppErrorInit {
  kind: AppErrorKind;
  status: number;
  message: string;
  code?: string;
  fieldErrors?: Record<string, string>;
  cause?: unknown;
}

/**
 * The single error type the UI works with. Backend error bodies differ between projects,
 * so `fromResponse` is the one place to adapt when a backend is connected.
 */
export class AppError extends Error {
  readonly kind: AppErrorKind;
  readonly status: number;
  readonly code: string | undefined;
  readonly fieldErrors: Record<string, string>;

  constructor({ kind, status, message, code, fieldErrors = {}, cause }: AppErrorInit) {
    super(message, { cause });
    this.name = 'AppError';
    this.kind = kind;
    this.status = status;
    this.code = code;
    this.fieldErrors = fieldErrors;
  }

  get isUnauthorized() {
    return this.status === 401;
  }

  get isForbidden() {
    return this.status === 403;
  }

  get isNotFound() {
    return this.status === 404;
  }

  get isConflict() {
    return this.status === 409;
  }

  static async fromResponse(response: Response): Promise<AppError> {
    const body = await readBody(response);
    return new AppError({
      kind: 'http',
      status: response.status,
      message:
        pickMessage(body) ?? (response.statusText || `Request failed with ${response.status}`),
      code: pickString(body, 'code'),
      fieldErrors: pickFieldErrors(body),
    });
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

async function readBody(response: Response): Promise<Record<string, unknown>> {
  try {
    const body: unknown = await response.json();
    return isRecord(body) ? body : {};
  } catch {
    return {};
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function pickString(body: Record<string, unknown>, key: string): string | undefined {
  const value = body[key];
  return typeof value === 'string' ? value : undefined;
}

function pickMessage(body: Record<string, unknown>): string | undefined {
  const message = body.message;
  if (Array.isArray(message)) return message.filter((item) => typeof item === 'string').join(', ');
  return pickString(body, 'message') ?? pickString(body, 'detail') ?? pickString(body, 'title');
}

function pickFieldErrors(body: Record<string, unknown>): Record<string, string> {
  const errors = body.fieldErrors ?? body.errors;
  if (!isRecord(errors)) return {};

  const result: Record<string, string> = {};
  for (const [field, value] of Object.entries(errors)) {
    if (typeof value === 'string') result[field] = value;
    else if (Array.isArray(value) && typeof value[0] === 'string') result[field] = value[0];
  }
  return result;
}
