/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Error según RFC 7807.
 */
export type Problem = {
    type?: string;
    title?: string;
    status?: number;
    detail?: string;
    instance?: string;
    errors?: Array<{
        field?: string;
        issue?: string;
    }>;
};

