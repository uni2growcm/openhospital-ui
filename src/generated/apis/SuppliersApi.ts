// tslint:disable
/**
 * Open Hospital API Documentation
 * Open Hospital API Documentation
 *
 * The version of the OpenAPI document: 0.1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { Observable } from 'rxjs';
import { BaseAPI, HttpHeaders, HttpQuery, throwIfNullOrUndefined, encodeURI, OperationOpts, RawAjaxResponse } from '../runtime';
import {
    SupplierDTO,
} from '../models';

export interface DeleteSupplierRequest {
    id: number;
}

export interface GetSuppliersRequest {
    excludeDeleted?: boolean;
}

export interface GetSuppliers1Request {
    id: number;
}

export interface SaveSupplierRequest {
    supplierDTO: SupplierDTO;
}

export interface UpdateSupplierRequest {
    supplierDTO: SupplierDTO;
}

/**
 * no description
 */
export class SuppliersApi extends BaseAPI {

    /**
     */
    deleteSupplier({ id }: DeleteSupplierRequest): Observable<void>
    deleteSupplier({ id }: DeleteSupplierRequest, opts?: OperationOpts): Observable<void | RawAjaxResponse<void>>
    deleteSupplier({ id }: DeleteSupplierRequest, opts?: OperationOpts): Observable<void | RawAjaxResponse<void>> {
        throwIfNullOrUndefined(id, 'id', 'deleteSupplier');

        const headers: HttpHeaders = {
            ...(this.configuration.username != null && this.configuration.password != null ? { Authorization: `Basic ${btoa(this.configuration.username + ':' + this.configuration.password)}` } : undefined),
        };

        return this.request<void>({
            url: '/suppliers/{id}'.replace('{id}', encodeURI(id)),
            method: 'DELETE',
            headers,
        }, opts?.responseOpts);
    };

    /**
     */
    getSuppliers({ excludeDeleted }: GetSuppliersRequest): Observable<Array<SupplierDTO>>
    getSuppliers({ excludeDeleted }: GetSuppliersRequest, opts?: OperationOpts): Observable<RawAjaxResponse<Array<SupplierDTO>>>
    getSuppliers({ excludeDeleted }: GetSuppliersRequest, opts?: OperationOpts): Observable<Array<SupplierDTO> | RawAjaxResponse<Array<SupplierDTO>>> {

        const headers: HttpHeaders = {
            ...(this.configuration.username != null && this.configuration.password != null ? { Authorization: `Basic ${btoa(this.configuration.username + ':' + this.configuration.password)}` } : undefined),
        };

        const query: HttpQuery = {};

        if (excludeDeleted != null) { query['exclude_deleted'] = excludeDeleted; }

        return this.request<Array<SupplierDTO>>({
            url: '/suppliers',
            method: 'GET',
            headers,
            query,
        }, opts?.responseOpts);
    };

    /**
     */
    getSuppliers1({ id }: GetSuppliers1Request): Observable<SupplierDTO>
    getSuppliers1({ id }: GetSuppliers1Request, opts?: OperationOpts): Observable<RawAjaxResponse<SupplierDTO>>
    getSuppliers1({ id }: GetSuppliers1Request, opts?: OperationOpts): Observable<SupplierDTO | RawAjaxResponse<SupplierDTO>> {
        throwIfNullOrUndefined(id, 'id', 'getSuppliers1');

        const headers: HttpHeaders = {
            ...(this.configuration.username != null && this.configuration.password != null ? { Authorization: `Basic ${btoa(this.configuration.username + ':' + this.configuration.password)}` } : undefined),
        };

        return this.request<SupplierDTO>({
            url: '/suppliers/{id}'.replace('{id}', encodeURI(id)),
            method: 'GET',
            headers,
        }, opts?.responseOpts);
    };

    /**
     */
    saveSupplier({ supplierDTO }: SaveSupplierRequest): Observable<SupplierDTO>
    saveSupplier({ supplierDTO }: SaveSupplierRequest, opts?: OperationOpts): Observable<RawAjaxResponse<SupplierDTO>>
    saveSupplier({ supplierDTO }: SaveSupplierRequest, opts?: OperationOpts): Observable<SupplierDTO | RawAjaxResponse<SupplierDTO>> {
        throwIfNullOrUndefined(supplierDTO, 'supplierDTO', 'saveSupplier');

        const headers: HttpHeaders = {
            'Content-Type': 'application/json',
            ...(this.configuration.username != null && this.configuration.password != null ? { Authorization: `Basic ${btoa(this.configuration.username + ':' + this.configuration.password)}` } : undefined),
        };

        return this.request<SupplierDTO>({
            url: '/suppliers',
            method: 'POST',
            headers,
            body: supplierDTO,
        }, opts?.responseOpts);
    };

    /**
     */
    updateSupplier({ supplierDTO }: UpdateSupplierRequest): Observable<SupplierDTO>
    updateSupplier({ supplierDTO }: UpdateSupplierRequest, opts?: OperationOpts): Observable<RawAjaxResponse<SupplierDTO>>
    updateSupplier({ supplierDTO }: UpdateSupplierRequest, opts?: OperationOpts): Observable<SupplierDTO | RawAjaxResponse<SupplierDTO>> {
        throwIfNullOrUndefined(supplierDTO, 'supplierDTO', 'updateSupplier');

        const headers: HttpHeaders = {
            'Content-Type': 'application/json',
            ...(this.configuration.username != null && this.configuration.password != null ? { Authorization: `Basic ${btoa(this.configuration.username + ':' + this.configuration.password)}` } : undefined),
        };

        return this.request<SupplierDTO>({
            url: '/suppliers',
            method: 'PUT',
            headers,
            body: supplierDTO,
        }, opts?.responseOpts);
    };

}
