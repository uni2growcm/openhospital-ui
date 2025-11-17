export const AjustQuantityRoute = (server) => {
    server.put("/adjust/:id").intercept((req, res) => {
      const id = req.params.id;
      const quantity = req.query.quantity;

      if (!quantity || isNaN(Number(quantity))) {
        return res.status(400).json({
          message: "Invalid quantity",
        });
      }

      if (id === "0") {
        return res.status(404).json({
          message: "Movement not found",
        });
      }

      return res.status(200).json({
        id,
        quantity: Number(quantity),
        status: "UPDATED",
        updatedAt: new Date().toISOString(),
      });
    });
};
