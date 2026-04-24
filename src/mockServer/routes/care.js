import { careDTO } from "mockServer/fixtures/careDTO";

export const careRoutes = (server) => {
  server.namespace("/cares", () => {
    server.post("/").intercept((req, res) => {
      const body = req.jsonBody();
      switch (body.note) {
        case "fail":
          res.status(400);
          break;
        default:
          res.status(201).json(body);
          break;
      }
    });
    server.put("/:id").intercept((req, res) => {
      const body = req.jsonBody();
      switch (body.note) {
        case "fail":
          res.status(400);
          break;
        default:
          res.status(200).json(body);
          break;
      }
    });
    server.get("/:patientCode").intercept((req, res) => {
      const code = req.query.patientCode;
      switch (code) {
        case "10000":
          res.status(400);
          break;
        case "21266":
          res.status(204);
          res.body = null;
          break;
        default:
          res.status(200).json(careDTO);
      }
    });
  });
};
