/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Currency } from './Currency';
import type { Money } from './Money';
import type { PaymentStatus } from './PaymentStatus';
export type PaymentIntent = {
    paymentId?: string;
    provider?: string;
    providerPaymentId?: string;
    checkoutUrl?: string;
    amount?: Money;
    currency?: Currency;
    status?: PaymentStatus;
};

