const express = require("express");
const router = express.Router();
const fundsController = require("../controllers/funds.controller");
const authMiddleware = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");

router.use(authMiddleware);

router.get("/", fundsController.getFunds);
router.post(
  "/deposit",
  validate(fundsController.depositSchema),
  fundsController.depositFunds
);
router.post(
  "/withdraw",
  validate(fundsController.withdrawSchema),
  fundsController.withdrawFunds
);

module.exports = router;
