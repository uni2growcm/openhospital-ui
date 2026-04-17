import { ethnicsDTO } from "mockServer/fixtures/ethnicDTO";

const ethnics = ethnicsDTO;

export const ethnicRoutes = (server) => {
  server.namespace("/ethnics", () => {
    server.get("/").intercept((req, res) => {
      res.status(200).json(ethnics);
    });
    server.get("/:id").intercept((req, res) => {
      const id = req.query.id;
      if (id == "10000") {
        res.status(404);
      }

      res.status(200).json(ethnics[0]);
    });
    server.put("/:id").intercept((req, res) => {
      const body = req.jsonBody();
      switch (body.name) {
        case "FAIL":
          res.status(400);
          break;
        default:
          res.status(200).json(body);
          break;
      }
    });
    server.post("/").intercept((req, res) => {
      const body = req.jsonBody();
      switch (body.name) {
        case "Fail":
          res.status(400);
          break;
        default:
          res.status(201).json(body);
          break;
      }
    });
    server.delete("/:id").intercept((req, res) => {
      const id = req.query.id;
      switch (id) {
        case "1000":
          res.status(400);
          break;
        default:
          res.status(200).json(null);
          break;
      }
    });
  })
};