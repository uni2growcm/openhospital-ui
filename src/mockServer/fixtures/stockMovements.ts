import { MovementDTO } from "generated";

export const MOVEMENTS: MovementDTO[] = [
  {
    code: 1001,
    medical: {
      code: 1,
      prod_code: "PARA500",
      description: "Paracetamol 500mg tablets",
      type: { code: "DRUG", description: "Pharmaceutical" },
      lots: [
        {
          code: "L2025-01",
          preparationDate: "2025-01-02",
          dueDate: "2027-01-02",
          cost: 0.1,
        }
      ],
      initialqty: 2000,
      pcsperpck: 10,
      inqty: 500,
      outqty: 100,
      minqty: 100,
    },
    type: { code: "IN", description: "Purchase from supplier", type: "IN" },
    supplier: {
      supId: 1,
      supName: "MediHealth Ltd.",
      supAddress: "12 Pharmacy Street, Douala",
      supPhone: "+237 650123456",
    },
    lot: {
      code: "L2025-01",
      preparationDate: "2025-01-02",
      dueDate: "2027-01-02",
      cost: 0.1,
    },
    date: "2025-01-05",
    quantity: 500,
    refNo: "PO-2025-001",
  },
  {
    code: 1002,
    medical: {
      code: 2,
      prod_code: "AMOX500",
      description: "Amoxicillin 500mg capsules",
      type: { code: "DRUG", description: "Antibiotic" },
      lots: [
        {
          code: "L2025-02",
          preparationDate: "2025-01-07",
          dueDate: "2028-01-07",
          cost: 0.1,
        }
      ],
      initialqty: 1000,
    },
    type: { code: "OUT", description: "Dispensed to ward", type: "OUT" },
    date: "2025-01-07",
    quantity: 120,
    refNo: "REQ-001",
  },
  {
    code: 1003,
    medical: {
      code: 3,
      prod_code: "GAUZE01",
      description: "Sterile Gauze Pads",
      type: { code: "SUPPLY", description: "Medical Supply" },
      lots: [
        {
          code: "L2025-08",
          preparationDate: "2025-02-10",
          dueDate: "2028-02-10",
          cost: 0.05,
        }
      ],
      initialqty: 500,
    },
    type: { code: "IN", description: "Supplier delivery", type: "IN" },
    supplier: {
      supId: 2,
      supName: "CarePlus Supplies",
      supPhone: "+237 650888777",
    },
    lot: {
      code: "L2025-02",
      preparationDate: "2025-02-10",
      dueDate: "2028-02-10",
      cost: 0.05,
    },
    date: "2025-02-11",
    quantity: 300,
    refNo: "DEL-2025-045",
  },
  {
    code: 1004,
    medical: {
      code: 1,
      prod_code: "PARA500",
      description: "Paracetamol 500mg tablets",
      lots: [
        {
          code: "L2025-04",
          preparationDate: "2025-02-12",
          dueDate: "2028-02-12",
          cost: 0.1,
        }
      ]
    },
    type: { code: "OUT", description: "Dispensed to pharmacy", type: "OUT" },
    date: "2025-02-12",
    quantity: 200,
    refNo: "ISS-002",
  },
  {
    code: 1005,
    medical: {
      code: 4,
      prod_code: "VITC100",
      description: "Vitamin C 100mg tablets",
      type: { code: "SUPPLEMENT", description: "Vitamin supplement" },
      lots: [
        {
          code: "L2025-04",
          preparationDate: "2025-02-14",
          dueDate: "2028-02-14",
          cost: 0.05,
        }
      ]
    },
    type: { code: "IN", description: "Stock adjustment", type: "IN" },
    date: "2025-02-14",
    quantity: 150,
    refNo: "ADJ-001",
  },
  {
    code: 1006,
    medical: {
      code: 5,
      prod_code: "SALT01",
      description: "Normal Saline 500ml",
      type: { code: "FLUID", description: "Infusion fluid" },
      lots: [
        {
          code: "L2025-05",
          preparationDate: "2025-03-01",
          dueDate: "2028-03-01",
          cost: 0.05,
        }
      ]
    },
    type: { code: "OUT", description: "Used in surgery", type: "OUT" },
    date: "2025-03-01",
    quantity: 50,
    refNo: "SURG-2025-03",
  },
  {
    code: 1007,
    medical: {
      code: 6,
      prod_code: "INS100",
      description: "Insulin 100 IU/ml",
      type: { code: "DRUG", description: "Hormone" },
      lots: [
        {
          code: "L2025-10",
          preparationDate: "2025-03-05",
          dueDate: "2026-03-05",
          cost: 1.5,
        }
      ]
    },
    type: { code: "IN", description: "New stock purchase", type: "IN" },
    supplier: { supId: 3, supName: "BioPharma S.A." },
    lot: {
      code: "L2025-03",
      preparationDate: "2025-03-05",
      dueDate: "2026-03-05",
      cost: 1.5,
    },
    date: "2025-03-06",
    quantity: 100,
    refNo: "PO-2025-045",
  },
  {
    code: 1008,
    medical: {
      code: 2,
      prod_code: "AMOX500",
      description: "Amoxicillin 500mg capsules",
      lots: [
        {
          code: "L2025-03",
          preparationDate: "2025-03-07",
          dueDate: "2028-03-07",
          cost: 0.05,
        }
      ]
    },
    type: { code: "OUT", description: "Dispensed to patient", type: "OUT" },
    date: "2025-03-07",
    quantity: 60,
    refNo: "PAT-023",
  },
  {
    code: 1009,
    medical: {
      code: 7,
      prod_code: "GLOVEXL",
      description: "Latex Gloves (XL)",
      type: { code: "SUPPLY", description: "Disposable" },
      lots: [
        {
          code: "L2025-04",
          preparationDate: "2025-03-10",
          dueDate: "2028-03-10",
          cost: 0.05,
        }
      ]
    },
    type: { code: "IN", description: "Donation received", type: "IN" },
    date: "2025-03-10",
    quantity: 500,
    refNo: "DON-2025-001",
  },
  {
    code: 1010,
    medical: {
      code: 7,
      prod_code: "GLOVEXL",
      description: "Latex Gloves (XL)",
      lots: [
        {
          code: "L2025-05",
          preparationDate: "2025-03-12",
          dueDate: "2028-03-12",
          cost: 0.05,
        }
      ]
    },
    type: { code: "OUT", description: "Distributed to wards", type: "OUT" },
    date: "2025-03-12",
    quantity: 150,
    refNo: "DIST-005",
  },
];
