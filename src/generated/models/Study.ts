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
    LocalTime,
} from './';

/**
 * @export
 * @interface Study
 */
export interface Study {
    /**
     * @type {string}
     * @memberof Study
     */
    accessionNumber?: string;
    /**
     * @type {string}
     * @memberof Study
     */
    institutionName?: string;
    /**
     * @type {string}
     * @memberof Study
     */
    referringPhysicianName?: string;
    /**
     * @type {string}
     * @memberof Study
     */
    date?: string;
    /**
     * @type {string}
     * @memberof Study
     */
    time?: string;
    /**
     * @type {string}
     * @memberof Study
     */
    description?: string;
    /**
     * @type {string}
     * @memberof Study
     */
    id?: string;
    /**
     * @type {string}
     * @memberof Study
     */
    instanceUID?: string;
    /**
     * @type {string}
     * @memberof Study
     */
    dateInstance?: string;
    /**
     * @type {LocalTime}
     * @memberof Study
     */
    timeInstance?: LocalTime;
}
