export type KnownPaymentStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'CANCELED'
  | 'CHARGEBACKED';

export type PaymentStatus = KnownPaymentStatus | (string & {});

export type KnownSubscriptionCallbackStatus =
  | 'SUBSCRIPTION_ACTIVATED'
  | 'SUBSCRIPTION_CANCELLED';

export type SubscriptionCallbackStatus =
  | KnownSubscriptionCallbackStatus
  | (string & {});

export interface Money {
  amount: number;
  currency: string;
}

export interface PaymentMetadata {
  userId: string;
  userName?: string;
  [key: string]: unknown;
}

export interface BaseCreatePaymentRequest {
  paymentDetails: Money;
  description: string;
  return: string;
  failedUrl: string;
  payload: string;
  metadata?: PaymentMetadata;
}

export interface CreatePaymentWithMethodRequest
  extends BaseCreatePaymentRequest {
  paymentMethod: number;
}

export type CreatePaymentChoiceRequest = BaseCreatePaymentRequest;

export interface CreatePaymentWithMethodResponse {
  paymentMethod: string;
  transactionId: string;
  redirect: string;
  return?: string;
  paymentDetails?: string;
  status: PaymentStatus;
  expiresIn?: string;
  merchantId: string;
  usdtRate?: number;
}

export interface CreatePaymentChoiceResponse {
  transactionId: string;
  status: PaymentStatus;
  url: string;
  expiresIn?: string;
  rate?: number;
}

export interface CreateSubscriptionRequest {
  amount: number;
  currency: string;
  interval: number;
  description: string;
}

export interface CreateSubscriptionResponse {
  paymentMethod: 'Subscription' | (string & {});
  /**
   * Platega calls this transactionId, but its subscription documentation says
   * no monetary transaction exists at creation time. Persist it as the
   * provider subscription ID in this context.
   */
  transactionId: string;
  redirect: string;
  status: PaymentStatus;
  merchantId: string;
}

export interface TransactionStatusResponse {
  id: string;
  status: PaymentStatus;
  paymentDetails: Money;
  merchantName?: string;
  /** Wire spelling from the provider response. Normalize after parsing. */
  mechantId?: string;
  /** Wire spelling from the provider response. Normalize after parsing. */
  comission?: number;
  paymentMethod?: string;
  expiresIn?: string;
  return?: string;
  comissionUsdt?: number;
  amountUsdt?: number;
  qr?: string;
  payformSuccessUrl?: string;
  payload?: string;
  comissionType?: number;
  externalId?: string;
  description?: string;
}

export interface SubscriptionChargeMetrics {
  chargesTotal: number;
  chargesSuccess: number;
  chargesFailed: number;
  totalAmount: number;
  lastChargeAt: string | null;
  nextChargeAt: string | null;
}

export interface SubscriptionDetailsResponse {
  id: string;
  status: string;
  amount: number;
  currencyCode: string;
  intervalUnit: string | number;
  intervalCount: number;
  startAt: string | null;
  nextChargeAt: string | null;
  lastChargeAt: string | null;
  description: string;
  createdAt: string;
  customerEmail: string | null;
  chargeMetrics?: SubscriptionChargeMetrics;
}

export interface SubscriptionListQuery {
  status?: string | number;
  from?: string;
  to?: string;
  page?: number;
  size?: number;
}

export interface SubscriptionListItem {
  id: string;
  status: string | number;
  amount: number;
  currencyCode: string;
  intervalUnit: string | number;
  intervalCount: number;
  nextChargeAt: string | null;
  lastChargeAt: string | null;
  customerEmail: string | null;
  description: string;
  chargesCount: number;
  createdAt: string;
}

export interface SubscriptionListResponse {
  items: SubscriptionListItem[];
  total: number;
  page: number;
  size: number;
}

export interface CancelSubscriptionResponse {
  subscriptionId: string;
  status: string;
}

export interface Balance {
  amount: number;
  currency: string;
  frozenBalance?: number;
}

export interface CancelSupportedResponse {
  supported: boolean;
  totalDeductUsdt: number | null;
  penaltyNativeAmount: number | null;
  penaltyNativeCurrency: string | null;
  penaltyUsdt: number | null;
  penaltyConversionRate: number | null;
  blockReason: string | null;
}

export interface CancelTransactionResponse {
  transactionId: string;
  accepted: boolean;
  manualControlRequired: boolean;
  message: string;
}

export interface H2HResponse {
  amount: number;
  qr: string;
}

export interface NormalizedPaymentCallback {
  transactionId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: number;
}

export interface NormalizedSubscriptionChargeCallback {
  chargeTransactionId: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: number;
  payload: string;
  nextChargeAt: string | null;
}

export interface NormalizedSubscriptionStatusCallback {
  subscriptionId: string;
  amount: number;
  currency: string;
  status: SubscriptionCallbackStatus;
  paymentMethod: number;
  payload: string;
  nextChargeAt: string | null;
}

