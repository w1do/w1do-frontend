import type {
  Balance,
  CancelSubscriptionResponse,
  CancelSupportedResponse,
  CancelTransactionResponse,
  CreatePaymentChoiceRequest,
  CreatePaymentChoiceResponse,
  CreatePaymentWithMethodRequest,
  CreatePaymentWithMethodResponse,
  CreateSubscriptionRequest,
  CreateSubscriptionResponse,
  H2HResponse,
  SubscriptionDetailsResponse,
  SubscriptionListQuery,
  SubscriptionListResponse,
  TransactionStatusResponse,
} from './types';

/**
 * Server transport template. TypeScript DTOs do not validate remote JSON.
 * Add the project's runtime schemas before using a response in business logic.
 */
export interface PlategaClientConfig {
  merchantId: string;
  secret: string;
  baseUrl?: string;
  timeoutMs?: number;
  fetchImpl?: typeof fetch;
}

export class PlategaApiError extends Error {
  readonly status: number;
  readonly providerMessage: string | null;

  constructor(status: number, providerMessage: string | null) {
    super(`Platega request failed with HTTP ${status}`);
    this.name = 'PlategaApiError';
    this.status = status;
    this.providerMessage = providerMessage;
  }
}

function assertServerRuntime(): void {
  if (typeof window !== 'undefined') {
    throw new Error('Platega client is server-only');
  }
}

function assertConfigured(value: string, name: string): string {
  const normalized = value.trim();

  if (!normalized) {
    throw new Error(`${name} is required`);
  }

  return normalized;
}

function assertPositiveAmount(amount: number): void {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error('Payment amount must be a positive finite number');
  }
}

function assertHttpsUrl(value: string, name: string): void {
  const url = new URL(value);

  if (url.protocol !== 'https:') {
    throw new Error(`${name} must use HTTPS`);
  }
}

function createBaseUrl(value: string): string {
  const url = new URL(value);

  if (url.protocol !== 'https:') {
    throw new Error('Platega baseUrl must use HTTPS');
  }

  return url.toString();
}

function encodeId(value: string, name: string): string {
  return encodeURIComponent(assertConfigured(value, name));
}

function getSafeProviderMessage(value: unknown): string | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const message = Reflect.get(value, 'message');
  return typeof message === 'string' ? message.slice(0, 500) : null;
}

export function createPlategaClient(config: PlategaClientConfig) {
  assertServerRuntime();

  const merchantId = assertConfigured(config.merchantId, 'merchantId');
  const secret = assertConfigured(config.secret, 'secret');
  const baseUrl = createBaseUrl(
    config.baseUrl ?? 'https://app.platega.io',
  );
  const timeoutMs = config.timeoutMs ?? 10_000;
  const fetchImpl = config.fetchImpl ?? fetch;

  async function request<T>(
    path: string,
    init: {
      method: 'GET' | 'POST';
      body?: unknown;
    },
  ): Promise<T> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    const body = init.body === undefined ? undefined : JSON.stringify(init.body);

    try {
      const response = await fetchImpl(new URL(path, baseUrl), {
        method: init.method,
        headers: {
          Accept: 'application/json',
          'X-MerchantId': merchantId,
          'X-Secret': secret,
          ...(body === undefined
            ? {}
            : { 'Content-Type': 'application/json' }),
        },
        body,
        signal: controller.signal,
      });

      const responseText = await response.text();
      let responseBody: unknown = null;

      if (responseText) {
        try {
          responseBody = JSON.parse(responseText);
        } catch {
          responseBody = null;
        }
      }

      if (!response.ok) {
        throw new PlategaApiError(
          response.status,
          getSafeProviderMessage(responseBody),
        );
      }

      return responseBody as T;
    } finally {
      clearTimeout(timeout);
    }
  }

  function validatePaymentRequest(
    value: CreatePaymentChoiceRequest,
  ): void {
    assertPositiveAmount(value.paymentDetails.amount);
    assertConfigured(value.paymentDetails.currency, 'currency');
    assertConfigured(value.description, 'description');
    assertConfigured(value.payload, 'payload');
    assertHttpsUrl(value.return, 'return');
    assertHttpsUrl(value.failedUrl, 'failedUrl');
  }

  return {
    async createPaymentWithMethod(
      input: CreatePaymentWithMethodRequest,
    ): Promise<CreatePaymentWithMethodResponse> {
      validatePaymentRequest(input);

      if (!Number.isInteger(input.paymentMethod) || input.paymentMethod <= 0) {
        throw new Error('paymentMethod must be a positive integer');
      }

      // Do not add an id field and do not automatically retry this request.
      return request('/transaction/process', {
        method: 'POST',
        body: input,
      });
    },

    async createPaymentChoice(
      input: CreatePaymentChoiceRequest,
    ): Promise<CreatePaymentChoiceResponse> {
      validatePaymentRequest(input);

      // Do not add an id field and do not automatically retry this request.
      return request('/v2/transaction/process', {
        method: 'POST',
        body: input,
      });
    },

    async createSubscription(
      input: CreateSubscriptionRequest,
    ): Promise<CreateSubscriptionResponse> {
      assertPositiveAmount(input.amount);
      assertConfigured(input.currency, 'currency');
      assertConfigured(input.description, 'description');

      if (!Number.isInteger(input.interval) || input.interval <= 0) {
        throw new Error('Subscription interval must be a positive integer');
      }

      return request('/transaction/process', {
        method: 'POST',
        body: {
          paymentMethod: 6,
          paymentDetails: {
            amount: input.amount,
            currency: input.currency,
            interval: input.interval,
          },
          description: input.description,
        },
      });
    },

    getTransaction(id: string): Promise<TransactionStatusResponse> {
      return request(`/transaction/${encodeId(id, 'transactionId')}`, {
        method: 'GET',
      });
    },

    getH2H(id: string): Promise<H2HResponse> {
      return request(`/h2h/${encodeId(id, 'transactionId')}`, {
        method: 'GET',
      });
    },

    getSubscription(id: string): Promise<SubscriptionDetailsResponse> {
      return request(`/subscription/${encodeId(id, 'subscriptionId')}`, {
        method: 'GET',
      });
    },

    listSubscriptions(
      query: SubscriptionListQuery = {},
    ): Promise<SubscriptionListResponse> {
      const search = new URLSearchParams();

      for (const [key, value] of Object.entries(query)) {
        if (value !== undefined) {
          search.set(key, String(value));
        }
      }

      const suffix = search.size > 0 ? `?${search.toString()}` : '';
      return request(`/subscription${suffix}`, { method: 'GET' });
    },

    cancelSubscription(id: string): Promise<CancelSubscriptionResponse> {
      return request(
        `/subscription/${encodeId(id, 'subscriptionId')}/cancel`,
        { method: 'POST' },
      );
    },

    getBalances(): Promise<Balance[]> {
      return request('/balance/all', { method: 'GET' });
    },

    getCancelSupported(id: string): Promise<CancelSupportedResponse> {
      return request(
        `/transaction/${encodeId(id, 'transactionId')}/cancel-supported`,
        { method: 'GET' },
      );
    },

    cancelTransaction(id: string): Promise<CancelTransactionResponse> {
      return request(`/transaction/${encodeId(id, 'transactionId')}/cancel`, {
        method: 'POST',
      });
    },
  };
}
