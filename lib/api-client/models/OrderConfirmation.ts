/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type OrderConfirmation = {
    orderId?: string;
    shipmentId?: string;
    status?: string;
    /**
     * Token de seguimiento opaco. Solo presente en pedidos guest (POST /checkout/guest).
     */
    trackingToken?: string;
};

