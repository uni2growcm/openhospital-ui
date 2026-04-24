import patientDTO, { patientDTO2 } from "./patientDTO";

export const careDTO = [
  {
    id: 1,
    team: ["Dr. Ndzi", "Infirmier Paul"],
    observation: "Patient stable, légère fièvre",
    plannedCare: "Administration de paracétamol",
    note: "Surveillance toutes les 4h",
    careDate: "2026-04-20",
    patient: patientDTO2,
  },
  {
    id: 2,
    team: ["Dr. Ndzi", "Infirmière Marie"],
    observation: "Tension artérielle élevée",
    plannedCare: "Prescription antihypertenseur",
    note: "Réévaluation dans 24h",
    careDate: "2026-04-21",
    patient: patientDTO,
  },
  {
    id: 3,
    team: ["Dr. Mbarga", "Infirmier Alain"],
    observation: "Douleurs abdominales",
    plannedCare: "Scanner abdominal",
    note: "À jeun avant examen",
    careDate: "2026-04-22",
    patient: patientDTO,
  },
  {
    id: 4,
    team: ["Dr. Essomba", "Infirmière Claire"],
    observation: "Amélioration générale",
    plannedCare: "Sortie prévue",
    note: "Contrôle dans une semaine",
    careDate: "2026-04-23",
    patient: patientDTO2,
  },
];