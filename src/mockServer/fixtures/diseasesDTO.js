export const diseasesDTO = [
  {
    code: 88,
    description: "Abortions",
    diseaseType: {
      code: "MP",
      description: "3.MATERNAL AND PERINATAL DISEASES",
    },
    opdInclude: true,
    ipdInInclude: true,
    ipdOutInclude: true,
  },
  {
    code: 74,
    description: "Disease DR8",
    diseaseType: {
      code: "CH",
      description: "Disease DR8",
    },
    opdInclude: false,
    ipdInInclude: false,
    ipdOutInclude: false,
  },
  {
    code: 22,
    description: "Fake disease",
    diseaseType: {
      code: "FK",
      description: "4.FAKE DISEASES",
    },
    opdInclude: false,
    ipdInInclude: true,
    ipdOutInclude: false,
  },
  {
    code: 23,
    description: "Something Else",
    diseaseType: {
      code: "FK",
      description: "4.FAKE DISEASES",
    },
    opdInclude: true,
    ipdInInclude: true,
    ipdOutInclude: false,
  },
  {
    code: 30,
    description: "Malaria",
    diseaseType: {
      code: "IN",
      description: "1.INFECTIONS AND PARASITIC DISEASES",
    },
    opdInclude: true,
    ipdInInclude: true,
    ipdOutInclude: true,
  },
  {
    code: 31,
    description: "Pneumonia",
    diseaseType: {
      code: "RE",
      description: "2.RESPIRATORY DISEASES",
    },
    opdInclude: true,
    ipdInInclude: false,
    ipdOutInclude: true,
  },
  {
    code: 32,
    description: "Anemia",
    diseaseType: {
      code: "BL",
      description: "5.BLOOD DISEASES",
    },
    opdInclude: false,
    ipdInInclude: false,
    ipdOutInclude: false,
  },
  {
    code: 33,
    description: "Diarrhea",
    diseaseType: {
      code: "DI",
      description: "6.DIGESTIVE DISEASES",
    },
    opdInclude: true,
    ipdInInclude: true,
    ipdOutInclude: false,
  },
];
