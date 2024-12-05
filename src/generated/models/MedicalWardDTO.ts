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

import {
    MedicalWardIdDTO,
} from './';

/**
 * @export
 * @interface MedicalWardDTO
 */
export interface MedicalWardDTO {
    /**
     * @type {MedicalWardIdDTO}
     * @memberof MedicalWardDTO
     */
    id?: MedicalWardIdDTO;
    /**
     * The in-quantity
     * @type {number}
     * @memberof MedicalWardDTO
     */
    in_quantity?: number;
    /**
     * The out-quantity
     * @type {number}
     * @memberof MedicalWardDTO
     */
    out_quantity?: number;
    /**
     * Lock
     * @type {number}
     * @memberof MedicalWardDTO
     */
    lock?: number;
}
