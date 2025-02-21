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

/**
 * Class representing a patient consensus
 * @export
 * @interface PatientConsensusDTO
 */
export interface PatientConsensusDTO {
    /**
     * Consensus flag
     * @type {boolean}
     * @memberof PatientConsensusDTO
     */
    consensusFlag?: boolean;
    /**
     * Service flag
     * @type {boolean}
     * @memberof PatientConsensusDTO
     */
    serviceFlag?: boolean;
    /**
     * Patient id
     * @type {number}
     * @memberof PatientConsensusDTO
     */
    patientId: number;
}
