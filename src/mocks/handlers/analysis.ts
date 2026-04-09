import { HttpResponse } from 'msw';
import type { AdmissionDTO } from '~/generated';
import { admissionDTO } from '../fixtures/admissionDTO';
import { badRequest, http } from '../utils';

const dischargeProps = {
    disDate: '2021-08-27T10:19:44.000Z',
    disType: { code: 'F', description: 'FUGUE' },
};

const admissions = [
    admissionDTO,
    admissionDTO,
    admissionDTO,
    {
        ...admissionDTO,
        ...dischargeProps,
        patient: { ...admissionDTO.patient, sex: 'F', agetype: 'd3' },
    },
    { ...admissionDTO, ...dischargeProps },
    {
        ...admissionDTO,
        patient: { ...admissionDTO.patient, sex: 'F', agetype: 'd2' },
        ...dischargeProps,
    },
    {
        ...admissionDTO,
        ...dischargeProps,
        disType: { code: 'N', description: 'NORMALE' },
    },
];

type AdmissionBody = {
    admDate?: string;
    note?: string;
};

export const analysisHandlers = [
    
    http.get('/labbook/patient/{patientCode}/analysis', ({ params }) => {
        if (params.patientCode === '10000') {
            return HttpResponse.json(badRequest({ message: 'Request failed' }), {
                status: 400,
            });
        }

        if (params.patientCode === '21266') {
            return new HttpResponse(null, { status: 204 });
        }

        return HttpResponse.json(admissions as AdmissionDTO[], { status: 200 });
    }),
];