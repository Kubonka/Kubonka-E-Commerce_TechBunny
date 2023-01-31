const { Router } = require("express");
const controller = require("./controller.js");

const router = Router();

router.get("/auto", async (req, res) => {
  try {
    res.status(200).json({ status: controller.getAutoStatus() });
  } catch (error) {
    res.sendStatus(400);
  }
});
router.post("/auto", (req, res) => {
  try {
    res.status(200).json({ status: controller.setAutoStatus() });
  } catch (error) {
    res.sendStatus(400);
  }
});

//$ Setea el nombre de la categoria en true o en false para activarla/desactivarla
//$ Setea el nombre de la categoria "name" con valor "discountAmmount"
router.put("/", async (req, res) => {
  try {
    const { name, discountAmmount, isOnSale } = req.query;
    if (isOnSale) {
      res.status(200).json({ status: await controller.setIsOnSale(isOnSale) });
    } else {
      if (name && discountAmmount) {
        res.status(200).json({
          status: await controller.setDiscount(name, discountAmmount),
        });
      } else {
        res.sendStatus(400);
      }
    }
  } catch (error) {
    res.sendStatus(400);
  }
});

module.exports = router;
