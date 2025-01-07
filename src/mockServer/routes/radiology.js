import { instances, preview, series, studies } from "../fixtures/radiology";

export const radiologyRoutes = (server) => {
  server.namespace("/radiology", () => {
    server.get("/patients/:id/studies").intercept((req, res) => {
      const id = req.params.id;
      switch (id) {
        case "1":
          res.status(400);
          break;
        default:
          res.status(200).json(studies);
      }
    });

    server.get("/studies/:id/series").intercept((req, res) => {
      const id = req.params.id;
      switch (id) {
        case "1":
          res.status(400);
          break;
        default:
          res.status(200).json(series);
      }
    });

    server.get("/series/:id/instances").intercept((req, res) => {
      const id = req.params.id;
      switch (id) {
        case "1":
          res.status(400);
          break;
        default:
          res.status(200).json(instances);
      }
    });

    server.get("/instances/:id/preview").intercept((req, res) => {
      const id = req.params.id;
      switch (id) {
        case "1":
          res.status(400);
          break;
        default:
          res.status(200).json(preview);
      }
    });
  });
};
