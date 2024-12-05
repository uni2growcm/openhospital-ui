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
    Patient,
    Study,
} from './';

/**
 * @export
 * @interface StudyResponse
 */
export interface StudyResponse {
    /**
     * @type {string}
     * @memberof StudyResponse
     */
    id?: string;
    /**
     * @type {string}
     * @memberof StudyResponse
     */
    objectType?: string;
    /**
     * @type {Array<string>}
     * @memberof StudyResponse
     */
    labels?: Array<string>;
    /**
     * @type {string}
     * @memberof StudyResponse
     */
    lastUpdate?: string;
    /**
     * @type {Study}
     * @memberof StudyResponse
     */
    study?: Study;
    /**
     * @type {string}
     * @memberof StudyResponse
     */
    parentPatientId?: string;
    /**
     * @type {Patient}
     * @memberof StudyResponse
     */
    patient?: Patient;
    /**
     * @type {Array<string>}
     * @memberof StudyResponse
     */
    seriesIds?: Array<string>;
    /**
     * @type {string}
     * @memberof StudyResponse
     */
    lastUpdateInstance?: string;
    /**
     * @type {boolean}
     * @memberof StudyResponse
     */
    stable?: boolean;
}
