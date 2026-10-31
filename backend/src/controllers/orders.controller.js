const Order = require("../models/Order");
const Holding = require("../models/Holding");
const Position = require("../models/Position");
const Funds = require("../models/Funds");
const marketService = require("../services/market.service");
const { z } = require("zod");

const orderSchema = z.object({
  symbol: z.string().min(1).toUpperCase(),
  qty: z.number().int().positive("Quantity must be at least 1"),
  price: z.number().positive().optional(),
  type: z.enum(["BUY", "SELL"]),
  product: z.enum(["CNC", "MIS"]).default("CNC"),
  orderType: z.enum(["MARKET", "LIMIT"]).default("MARKET"),
});

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

exports.placeOrder = async (req, res, next) => {
  try {
    const { symbol, qty, price: requestedPrice, type, product, orderType } = req.body;
    const userId = req.user._id;

    // Get current verified market price
    const quote = marketService.getQuote(symbol);
    const executionPrice = orderType === "LIMIT" && requestedPrice ? requestedPrice : quote.price;
    const totalOrderCost = Number((qty * executionPrice).toFixed(2));
    const orderId = `ORD-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

    // Retrieve user's funds
    let funds = await Funds.findOne({ userId });
    if (!funds) {
      funds = await Funds.create({ userId, availableBalance: 100000.0 });
    }

    // Process BUY order
    if (type === "BUY") {
      if (funds.availableBalance < totalOrderCost) {
        // Record rejected order
        const rejectedOrder = await Order.create({
          userId,
          orderId,
          symbol,
          name: quote.name,
          qty,
          price: executionPrice,
          type,
          product,
          orderType,
          status: "REJECTED",
          rejectionReason: `Insufficient funds. Required: ₹${totalOrderCost.toLocaleString("en-IN")}, Available: ₹${funds.availableBalance.toLocaleString("en-IN")}`,
        });

        return res.status(400).json({
          success: false,
          message: `Insufficient funds to place order. Required: ₹${totalOrderCost.toFixed(2)}, Available: ₹${funds.availableBalance.toFixed(2)}`,
          order: rejectedOrder,
        });
      }

      // Deduct funds
      funds.availableBalance = Number((funds.availableBalance - totalOrderCost).toFixed(2));
      funds.transactions.push({
        type: "ORDER_BUY",
        amount: totalOrderCost,
        description: `Bought ${qty} ${symbol} @ ₹${executionPrice} (${product})`,
        balanceAfter: funds.availableBalance,
      });
      await funds.save();

      // Update CNC Holdings or MIS Positions
      if (product === "CNC") {
        const existingHolding = await Holding.findOne({ userId, symbol });
        if (existingHolding) {
          const newQty = existingHolding.qty + qty;
          const newAvg = Number(
            (
              (existingHolding.qty * existingHolding.avgPrice + totalOrderCost) /
              newQty
            ).toFixed(2)
          );
          existingHolding.qty = newQty;
          existingHolding.avgPrice = newAvg;
          await existingHolding.save();
        } else {
          await Holding.create({
            userId,
            symbol,
            name: quote.name,
            qty,
            avgPrice: executionPrice,
          });
        }
      } else {
        // MIS Position
        const existingPosition = await Position.findOne({ userId, symbol, product });
        if (existingPosition) {
          const newQty = existingPosition.qty + qty;
          const newAvg = Number(
            (
              (existingPosition.qty * existingPosition.avgPrice + totalOrderCost) /
              newQty
            ).toFixed(2)
          );
          existingPosition.qty = newQty;
          existingPosition.avgPrice = newAvg;
          await existingPosition.save();
        } else {
          await Position.create({
            userId,
            symbol,
            name: quote.name,
            product,
            qty,
            avgPrice: executionPrice,
          });
        }
      }
    }

    // Process SELL order
    if (type === "SELL") {
      if (product === "CNC") {
        const holding = await Holding.findOne({ userId, symbol });
        if (!holding || holding.qty < qty) {
          const currentQty = holding ? holding.qty : 0;
          const rejectedOrder = await Order.create({
            userId,
            orderId,
            symbol,
            name: quote.name,
            qty,
            price: executionPrice,
            type,
            product,
            orderType,
            status: "REJECTED",
            rejectionReason: `Insufficient holdings. You own ${currentQty} qty of ${symbol}, cannot sell ${qty}.`,
          });

          return res.status(400).json({
            success: false,
            message: `Insufficient holdings. You own ${currentQty} shares of ${symbol}, cannot sell ${qty}.`,
            order: rejectedOrder,
          });
        }

        // Reduce or remove holding
        if (holding.qty === qty) {
          await Holding.deleteOne({ _id: holding._id });
        } else {
          holding.qty -= qty;
          await holding.save();
        }
      } else {
        // MIS sell
        const position = await Position.findOne({ userId, symbol, product });
        if (position) {
          position.qty -= qty;
          if (position.qty === 0) {
            await Position.deleteOne({ _id: position._id });
          } else {
            await position.save();
          }
        }
      }

      // Credit proceeds back to funds
      funds.availableBalance = Number((funds.availableBalance + totalOrderCost).toFixed(2));
      funds.transactions.push({
        type: "ORDER_SELL",
        amount: totalOrderCost,
        description: `Sold ${qty} ${symbol} @ ₹${executionPrice} (${product})`,
        balanceAfter: funds.availableBalance,
      });
      await funds.save();
    }

    // Record complete order
    const order = await Order.create({
      userId,
      orderId,
      symbol,
      name: quote.name,
      qty,
      price: executionPrice,
      type,
      product,
      orderType,
      status: "COMPLETE",
    });

    res.status(201).json({
      success: true,
      message: `Successfully executed ${type} order for ${qty} ${symbol}!`,
      order,
      availableFunds: funds.availableBalance,
    });
  } catch (error) {
    next(error);
  }
};

exports.orderSchema = orderSchema;
