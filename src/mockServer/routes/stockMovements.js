import { WARD_MEDICALS } from "mockServer/fixtures/wardMedicals";
import { MOVEMENTS } from "../fixtures/stockMovements";
import { WARD_MOVEMENTS } from "../fixtures/stockWardMovements";

export const stockMovementsRoutes = (server) => {
  server.namespace("/stockmovements", () => {
    server.get("/").intercept((_, res) => {
      res.status(200).json(MOVEMENTS);
    });
    server.post("/charge").intercept((req, res) => {
      const body = req.jsonBody();
      switch (body[0].refNo) {
        case "0":
          res.status(400);
          break;
        default:
          res.status(201).json(true);
          break;
      }
    });
    server.post("/discharge").intercept((req, res) => {
      const body = req.jsonBody();
      switch (body[0].refNo) {
        case "0":
          res.status(400);
          break;
        default:
          res.status(201).json(true);
          break;
      }
    });
  });
  server.namespace("/medicalstockward", () => {
    server.get("/:code").intercept((req, res) => {
      const code = req.params.code;
      res
        .status(200)
        .json(WARD_MEDICALS.filter((ward) => ward.id?.ward?.code === code));
    });
  });
  server.namespace("/medicalstockward/movements", () => {
    server.get("/:code").intercept((req, res) => {
      const code = req.params.code;
      res
        .status(200)
        .json(
          WARD_MOVEMENTS.filter((movement) =>
            [movement.ward, movement.wardFrom, movement.wardTo].some(
              (ward) => ward?.code === code
            )
          )
        );
    });
    server.get("/to/:target_ward_code").intercept((req, res) => {
      const targetWardCode = req.params.target_ward_code;
      const from = req.query.from;
      const to = req.query.to;

      const filteredMovements = WARD_MOVEMENTS.filter((movement) => {
        const movementDate = new Date(movement.date);
        const fromDate = new Date(from);
        const toDate = new Date(to);

        return (
          movement.wardTo?.code === targetWardCode &&
          movementDate >= fromDate &&
          movementDate <= toDate
        );
      });

      res.status(200).json(filteredMovements);
    });
  });
  server.post("/medicalstockward/movements").intercept((req, res) => {
    const body = req.jsonBody();
    const description = body.description;
    const isPatient = body.isPatient;
    const medical = body.medical;
    const lot = body.lot;

    const errors = [];

    if (isPatient && (!description || description.trim() === "")) {
      errors.push("please select a patient");
    }

    if (!isPatient && (!description || description.trim() === "")) {
      errors.push("please insert a description for the internal use");
    }

    if (!medical) {
      errors.push("please select a drug");
    }

    if (!lot) {
      errors.push("please select a lot");
    }

    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    const newMovement = { ...body, code: WARD_MOVEMENTS.length + 1 };
    WARD_MOVEMENTS.push(newMovement);

    res.status(201).json(true);
  });

  server.namespace("/medicalstockmovements", () => {
    server.get("/filter/v1").intercept((req, res) => {
      const wardId = req.query.ward_id;
      const from = new Date("2010-12-25T10:30:00Z");
      const to = req.query.to;

      const filteredMovements = WARD_MOVEMENTS.filter((movement) => {
        const movementDate = new Date(movement.date);
        const fromDate = from;
        const toDate = new Date(to);
        const data = (
          (movement.ward?.code === wardId ||
            movement.wardFrom?.code === wardId ||
            movement.wardTo?.code === wardId) &&
          movementDate >= fromDate &&
          movementDate <= toDate
        );
        return data;
      });

      res.status(200).json(filteredMovements);
    });
  });

};
