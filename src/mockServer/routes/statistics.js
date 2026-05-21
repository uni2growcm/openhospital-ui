export const statisticsRoutes = (server) => {
  server.namespace("/statistics", () => {
    server.get("/admission").intercept((req, res) => {
      const { fromDate, toDate } = req.query;

      if (fromDate === "fail" || toDate === "fail") {
        res
          .status(400)
          .json({ message: "Fail to generate admission report PDF" });
        return;
      }

      const blob = new Blob(["fake pdf content"], { type: "application/pdf" });
      res.send({ status: 200, body: blob });
    });

    server.get("/death").intercept((req, res) => {
      const { fromDate, toDate } = req.query;

      if (fromDate === "fail" || toDate === "fail") {
        res.status(400).json({ message: "Fail to generate death report PDF" });
        return;
      }

      const blob = new Blob(["fake pdf content"], { type: "application/pdf" });
      res.send({ status: 200, body: blob });
    });

    server.get("/dischargesstatistics").intercept((req, res) => {
      const { fromDate, toDate } = req.query;

      if (fromDate === "fail" || toDate === "fail") {
        res
          .status(400)
          .json({ message: "Fail to generate discharges report PDF" });
        return;
      }

      const blob = new Blob(["fake pdf content"], { type: "application/pdf" });
      res.send({ status: 200, body: blob });
    });

    server.get("/pathologiesbyagegender").intercept((req, res) => {
      const { fromDate, toDate } = req.query;

      if (fromDate === "fail" || toDate === "fail") {
        res.status(400).json({
          message: "Fail to generate pathologies by age/gender report PDF",
        });
        return;
      }

      const blob = new Blob(["fake pdf content"], { type: "application/pdf" });
      res.send({ status: 200, body: blob });
    });

    server.get("/pathologies").intercept((req, res) => {
      const { fromDate, toDate } = req.query;

      if (fromDate === "fail" || toDate === "fail") {
        res
          .status(400)
          .json({ message: "Fail to generate pathologies report PDF" });
        return;
      }

      const blob = new Blob(["fake pdf content"], { type: "application/pdf" });
      res.send({ status: 200, body: blob });
    });
  });
};
