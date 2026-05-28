/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Address } from './Address';
import type { CartItem } from './CartItem';
import type { Currency } from './Currency';
import type { SessionStatus } from './SessionStatus';
import type { Totals } from './Totals';
export type CheckoutSession = {
    checkoutSessionId?: string;
    status?: SessionStatus;
    lineItems?: Array<CartItem>;
    totals?: Totals;
    currency?: Currency;
    shippingAddress?: (Address | null);
    expiresAt?: string;
};

