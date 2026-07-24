import { createHash, timingSafeEqual } from 'node:crypto';

import type {
  NormalizedPaymentCallback,
  NormalizedSubscriptionChargeCallback,
  NormalizedSubscriptionStatusCallback,
} from './types';

type HeaderSource = Headers | Record<string, string | undefined>;

export interface PlategaCallbackAuth {
  merchantId: string;
  secret: string;
}

function getHeader(headers: HeaderSource, name: string): string | null {
  if (headers instanceof Headers) {
    return headers.get(name);
  }

  const target = name.toLowerCase();

  for (const [key, value] of Object.entries(headers)) {
    if (key.toLowerCase() === target && typeof value === 'string') {
      return value;
    }
  }

  return null;
}

function constantTimeEqual(actual: string, expected: string): boolean {
  const actualHash = createHash('sha256').update(actual).digest();
  const expectedHash = createHash('sha256').update(expected).digest();
  return timingSafeEqual(actualHash, expectedHash);
}

export function verifyPlategaCallbackAuth(
  headers: HeaderSource,
  expected: PlategaCallbackAuth,
): boolean {
  const merchantId = getHeader(headers, 'X-MerchantId');
  const secret = getHeader(headers, 'X-Secret');

  if (!merchantId || !secret) {
    return false;
  }

  return (
    constantTimeEqual(merchantId, expected.merchantId) &&
    constantTimeEqual(secret, expected.secret)
  );
}

function asObject(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new TypeError('Callback body must be a JSON object');
  }

  return value as Record<string, unknown>;
}

function read(
  value: Record<string, unknown>,
  ...names: string[]
): unknown {
  let matched = false;
  let result: unknown;

  for (const name of names) {
    if (Object.hasOwn(value, name)) {
      const current = value[name];

      if (matched && !Object.is(result, current)) {
        throw new TypeError(`Conflicting callback fields: ${names.join(', ')}`);
      }

      matched = true;
      result = current;
    }
  }

  return result;
}

function requiredString(value: unknown, name: string): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new TypeError(`${name} must be a non-empty string`);
  }

  return value;
}

function optionalString(value: unknown, name: string): string {
  if (value === undefined || value === null) {
    return '';
  }

  if (typeof value !== 'string') {
    throw new TypeError(`${name} must be a string`);
  }

  return value;
}

function nullableString(value: unknown, name: string): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value !== 'string') {
    throw new TypeError(`${name} must be a string or null`);
  }

  return value;
}

function requiredNumber(value: unknown, name: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new TypeError(`${name} must be a finite number`);
  }

  return value;
}

export function parsePaymentCallback(
  body: unknown,
): NormalizedPaymentCallback {
  const value = asObject(body);

  return {
    transactionId: requiredString(read(value, 'id', 'Id'), 'id'),
    amount: requiredNumber(read(value, 'amount', 'Amount'), 'amount'),
    currency: requiredString(
      read(value, 'currency', 'Currency'),
      'currency',
    ),
    status: requiredString(read(value, 'status', 'Status'), 'status'),
    paymentMethod: requiredNumber(
      read(value, 'paymentMethod', 'PaymentMethod'),
      'paymentMethod',
    ),
  };
}

export function parseSubscriptionChargeCallback(
  body: unknown,
): NormalizedSubscriptionChargeCallback {
  const value = asObject(body);

  return {
    chargeTransactionId: requiredString(read(value, 'Id', 'id'), 'Id'),
    subscriptionId: requiredString(
      read(value, 'SubscriptionId', 'subscriptionId'),
      'SubscriptionId',
    ),
    amount: requiredNumber(read(value, 'Amount', 'amount'), 'Amount'),
    currency: requiredString(
      read(value, 'Currency', 'currency'),
      'Currency',
    ),
    status: requiredString(read(value, 'Status', 'status'), 'Status'),
    paymentMethod: requiredNumber(
      read(value, 'PaymentMethod', 'paymentMethod'),
      'PaymentMethod',
    ),
    payload: optionalString(read(value, 'Payload', 'payload'), 'Payload'),
    nextChargeAt: nullableString(
      read(value, 'NextChargeAt', 'nextChargeAt'),
      'NextChargeAt',
    ),
  };
}

export function parseSubscriptionStatusCallback(
  body: unknown,
): NormalizedSubscriptionStatusCallback {
  const value = asObject(body);
  const id = requiredString(read(value, 'Id', 'id'), 'Id');
  const explicitSubscriptionId = read(
    value,
    'SubscriptionId',
    'subscriptionId',
  );

  if (
    explicitSubscriptionId !== undefined &&
    requiredString(explicitSubscriptionId, 'SubscriptionId') !== id
  ) {
    throw new TypeError('Id and SubscriptionId must identify one subscription');
  }

  return {
    subscriptionId: id,
    amount: requiredNumber(read(value, 'Amount', 'amount'), 'Amount'),
    currency: requiredString(
      read(value, 'Currency', 'currency'),
      'Currency',
    ),
    status: requiredString(read(value, 'Status', 'status'), 'Status'),
    paymentMethod: requiredNumber(
      read(value, 'PaymentMethod', 'paymentMethod'),
      'PaymentMethod',
    ),
    payload: optionalString(read(value, 'Payload', 'payload'), 'Payload'),
    nextChargeAt: nullableString(
      read(value, 'NextChargeAt', 'nextChargeAt'),
      'NextChargeAt',
    ),
  };
}
