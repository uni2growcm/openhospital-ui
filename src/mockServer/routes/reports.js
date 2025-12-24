export const reportsRoutes = (server) => {
  server.namespace("/reports", () => {
    server.get("/pharmaceuticalAMC").intercept((req, res) => {
      res.status(200).json(new Blob());
    });
    server.get("/pharmaceuticalStockWard").intercept((req, res) => {
      res.status(200).json(new Blob());
    });
    server.get("/pharmaceuticalStock").intercept((req, res) => {
      res.status(200).json(new Blob());
    });
    server.get("/pharmaceuticalStockCard").intercept((req, res) => {
      res.status(200).json(new Blob());
    });
    server.get("/pharmaceuticalExpiration").intercept((req, res) => {
      res.status(200).json(new Blob());
    });
  });
};
