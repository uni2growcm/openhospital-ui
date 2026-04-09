export type LabbookPatientDTO = {
  id_data: number;
  id_user: number;
  pat_ano: number;
  pat_code: string;
  pat_code_lab: string;
  pat_name: string;
  pat_firstname: string;
  pat_birth: string;
  pat_sex: number;
  pat_address: string;
  pat_zipcode: string;
  pat_city: string;
  pat_phone1: string;
  pat_phone2: string;
  pat_profession: string;
  pat_maiden: string;
  pat_district: string;
  pat_pbox: string;
  pat_birth_approx: number;
  pat_age: number;
  pat_age_unit: number;
  pat_email: string;
  pat_agreement: string;
  pat_midname: string;
  pat_nationality: number;
  pat_resident: string;
  pat_blood_group: number;
  pat_blood_rhesus: number;
};

export type AnalysisItemDTO = {
  id_rec: number;
  type_rec: string;
  date_prescr: string;
  analysis: string;
  rec_num: string;
  variable: string;
  result: string;
};

export type AnalysisDTO = {
  patient: LabbookPatientDTO;
  analyzes: AnalysisItemDTO[];
};

export const analysisDTO: AnalysisDTO = {
    patient: {
      id_data: 1,
      id_user: 12,
      pat_ano: 5,
      pat_code: "4AW68",
      pat_code_lab: "",
      pat_name: "Joane",
      pat_firstname: "Holmes",
      pat_birth: "",
      pat_sex: 2,
      pat_address: "Londre",
      pat_zipcode: "",
      pat_city: "",
      pat_phone1: "+44 7700 900000",
      pat_phone2: "",
      pat_profession: "",
      pat_maiden: "Joane Holmes",
      pat_district: "",
      pat_pbox: "",
      pat_birth_approx: 5,
      pat_age: 23,
      pat_age_unit: 1037,
      pat_email: "",
      pat_agreement: "N",
      pat_midname: "wedwf",
      pat_nationality: 0,
      pat_resident: "Y",
      pat_blood_group: 0,
      pat_blood_rhesus: 0,
    },
    analyzes: [
      {
        id_rec: 4,
        type_rec: "E",
        date_prescr: "2026-04-06",
        analysis:
          "Antibiogramme 1ère ligne des mycobactéries en milieu liquide",
        rec_num: "0004",
        variable: "Ethambutol",
        result: "Sensible",
      },
      {
        id_rec: 5,
        type_rec: "E",
        date_prescr: "2026-04-06",
        analysis: "PCR VIH 1/2",
        rec_num: "0005",
        variable: "Charge virale",
        result: "Indétectable",
      },
      {
        id_rec: 6,
        type_rec: "E",
        date_prescr: "2026-04-07",
        analysis: "Hémogramme complet",
        rec_num: "0006",
        variable: "Hémoglobine",
        result: "13.8",
      },
      {
        id_rec: 7,
        type_rec: "E",
        date_prescr: "2026-04-07",
        analysis: "Bilan hépatique",
        rec_num: "0007",
        variable: "ALAT",
        result: "35",
      },
    ],
  };
