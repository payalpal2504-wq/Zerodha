const Funds = require("../models/Funds");
const { z } = require("zod");

const depositSchema = z.object({
  amount: z.number().positive("Amount must be greater than 0").max(10000000, "Maximum deposit limit is ₹1,00,00,000"),
});

const withdrawSchema = z.object({
  amount: z.number().positive("Amount must be greater than 0"),
});

exports.getFunds = async (req, res, next) => {
  try {
    let funds = await Funds.findOne({ userId: req.user._id });
    if (!funds) {
      funds = await Funds.create({
        userId: req.user._id,
        availableBalance: 100000.0,
        usedMargin: 0.0,
        collateral: 0.0,
      });
    }

    res.json({
      success: true,
      data: {
        availableBalance: funds.availableBalance,
        usedMargin: funds.usedMargin,
        collateral: funds.collateral,
        totalBalance: Number((funds.availableBalance + funds.usedMargin).toFixed(2)),
        transactions: (funds.transactions || []).slice(-20).reverse(),
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.depositFunds = async (req, res, next) => {
  try {
    const { amount } = req.body;
    let funds = await Funds.findOne({ userId: req.user._id });
    if (!funds) {
      funds = new Funds({ userId: req.user._id, availableBalance: 0 });
    }

    funds.availableBalance = Number((funds.availableBalance + amount).toFixed(2));
    funds.transactions.push({
      type: "DEPOSIT",
      amount,
      description: `Simulated Fund Deposit of ₹${amount.toLocaleString("en-IN")}`,
      balanceAfter: funds.availableBalance,
    });
    await funds.save();

    res.json({
      success: true,
      message: `Successfully deposited ₹${amount.toLocaleString("en-IN")} into trading account!`,
      availableBalance: funds.availableBalance,
    });
  } catch (error) {
    next(error);
  }
};

exports.withdrawFunds = async (req, res, next) => {
  try {
    const { amount } = req.body;
    const funds = await Funds.findOne({ userId: req.user._id });

    if (!funds || funds.availableBalance < amount) {
      return res.status(400).json({
        success: false,
        message: `Insufficient balance for withdrawal. Available: ₹${funds ? funds.availableBalance.toFixed(2) : 0}`,
      });
    }

    funds.availableBalance = Number((funds.availableBalance - amount).toFixed(2));
    funds.transactions.push({
      type: "WITHDRAWAL",
      amount,
      description: `Simulated Fund Withdrawal of ₹${amount.toLocaleString("en-IN")}`,
      balanceAfter: funds.availableBalance,
    });
    await funds.save();

    res.json({
      success: true,
      message: `Successfully processed withdrawal of ₹${amount.toLocaleString("en-IN")}.`,
      availableBalance: funds.availableBalance,
    });
  } catch (error) {
    next(error);
  }
};

exports.depositSchema = depositSchema;
exports.withdrawSchema = withdrawSchema;
