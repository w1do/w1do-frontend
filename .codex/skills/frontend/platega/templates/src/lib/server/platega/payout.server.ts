import {
  createHash,
  createHmac,
  randomUUID,
} from 'node:crypto';

export interface PlategaPayoutConfig {
  merchantId: string;
  payoutSecret: string;
  baseUrl?: string;
  timeoutMs?: number;
  fetchImpl?: typeof fetch;
}

type CardTarget =
  | { cardId: string; cardNumber?: never }
  | { cardId?: never; cardNumber: string };

export type CreateCardPayoutRequest = CardTarget & {
  amountRub: number;
};

export interface CreateCardPayoutResponse {
  withdrawalRecordId: string;
  status: string;
  cardMasked: string;
  amountUsdtDebited: number;
}

export interface SavedCard {
  cardId: string;
  masked: string;
  last4: string;
  brand: string;
  label: string;
  status: string;
}

function sha256Hex(value: string): string {
  return createHash('sha256').update(value, 'utf8').digest('hex');
}

function createSignature(secret: string, stringToSign: string): string {
  return createHmac('sha256', secret)
    .update(stringToSign, 'utf8')
    .digest('base64');
}

function assertServerRuntime(): void {
  if (typeof window !== 'undefined') {
    throw new Error('Platega Payout client is server-only');
  }
}

function assertConfigured(value: string, name: string): string {
  const normalized = value.trim();

  if (!normalized) {
    throw new Error(`${name} is required`);
  }

  return normalized;
}

function createBaseUrl(value: string): string {
  const url = new URL(value);

  if (url.protocol !== 'https:') {
    throw new Error('Platega baseUrl must use HTTPS');
  }

  return url.toString();
}

export function createPayoutIdempotencyKey(): string {
  return randomUUID();
}

export function createPlategaPayoutClient(config: PlategaPayoutConfig) {
  assertServerRuntime();

  const merchantId = assertConfigured(config.merchantId, 'merchantId');
  const payoutSecret = assertConfigured(
    config.payoutSecret,
    'payoutSecret',
  );
  const baseUrl = createBaseUrl(
    config.baseUrl ?? 'https://app.platega.io',
  );
  const timeoutMs = config.timeoutMs ?? 10_000;
  const fetchImpl = config.fetchImpl ?? fetch;

  async function signedRequest<T>(
    method: 'GET' | 'POST',
    path: string,
    options: {
      body?: Record<string, unknown>;
      idempotencyKey?: string;
      query?: URLSearchParams;
    } = {},
  ): Promise<T> {
    const body = options.body ? JSON.stringify(options.body) : '';
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const idempotencyKey = options.idempotencyKey ?? '';
    const stringToSign = [
      method,
      path,
      timestamp,
      idempotencyKey,
      sha256Hex(body),
    ].join('\n');
    const signature = createSignature(payoutSecret, stringToSign);
    const url = new URL(path, baseUrl);

    if (options.query) {
      url.search = options.query.toString();
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetchImpl(url, {
        method,
        headers: {
          Accept: 'application/json',
          Authorization:
            `PG-HMAC kid=${merchantId}, ts=${timestamp}, sig=${signature}`,
          ...(idempotencyKey
            ? { 'Idempotency-Key': idempotencyKey }
            : {}),
          ...(body ? { 'Content-Type': 'application/json' } : {}),
        },
        body: body || undefined,
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Platega Payout failed with HTTP ${response.status}`);
      }

      return (await response.json()) as T;
    } finally {
      clearTimeout(timeout);
    }
  }

  return {
    /**
     * The caller must persist this key before the request and reuse it with
     * identical input when retrying the same logical payout.
     */
    createCardPayout(
      input: CreateCardPayoutRequest,
      idempotencyKey: string,
    ): Promise<CreateCardPayoutResponse> {
      assertConfigured(idempotencyKey, 'idempotencyKey');

      if (
        !Number.isInteger(input.amountRub) ||
        input.amountRub < 1_000 ||
        input.amountRub > 87_500
      ) {
        throw new Error('amountRub must be an integer from 1000 to 87500');
      }

      if (
        (input.cardId === undefined) ===
        (input.cardNumber === undefined)
      ) {
        throw new Error('Provide exactly one of cardId or cardNumber');
      }

      if (input.cardNumber && !/^\d{16}$/.test(input.cardNumber)) {
        throw new Error('cardNumber must contain exactly 16 digits');
      }

      const target =
        input.cardId !== undefined
          ? { cardId: assertConfigured(input.cardId, 'cardId') }
          : { cardNumber: input.cardNumber };

      return signedRequest('POST', '/api/v1/payouts/card-rub', {
        idempotencyKey,
        body: {
          ...target,
          amountRub: input.amountRub,
          payoutMethod: 'CARD',
          currencyRequested: 'RUB',
        },
      });
    },

    listSavedCards(onlyActive = true): Promise<SavedCard[]> {
      return signedRequest('GET', '/api/v1/cards', {
        query: new URLSearchParams({
          onlyActive: String(onlyActive),
        }),
      });
    },
  };
}
