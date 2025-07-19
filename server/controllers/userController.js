import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Razorpay from "razorpay";
import crypto from "crypto";
import transactionModel from "../models/transactionModel.js";

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userModel.create({ name, email, password: hashedPassword });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      success: true,
      token,
      user: { name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email?.trim() || !password?.trim()) {
      return res.status(400).json({ success: false, message: "Email and password required" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      success: true,
      token,
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


const userCredits = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({
      success: true,
      credits: user.creditBalance || 0,
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Credit Fetch Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


const paymentRazorpay = async (req, res) => {
  try {
    const { planId } = req.body;
    const userId = req.userId;

    const plans = {
      Basic: { credits: 100, amount: 10 },
      Advanced: { credits: 500, amount: 50 },
      Business: { credits: 5000, amount: 250 },
    };

    const plan = plans[planId];
    if (!plan) {
      return res.status(400).json({ success: false, message: "Invalid plan selected" });
    }

    const transaction = await transactionModel.create({
      userId,
      plan: planId,
      credits: plan.credits,
      amount: plan.amount,
      date: Date.now(),
      payment: false,
    });

    const order = await razorpayInstance.orders.create({
      amount: plan.amount * 100,
      currency: "INR",
      receipt: transaction._id.toString(),
    });

    res.json({ success: true, order });
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


const verifyRazorpay = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    const transaction = await transactionModel.findOne({ _id: razorpay_order_id }) || 
      await transactionModel.findOne({ receipt: razorpay_order_id }); // fallback

    if (!transaction || transaction.payment) {
      return res.status(400).json({ success: false, message: "Invalid or completed transaction" });
    }

    await userModel.findByIdAndUpdate(transaction.userId, {
      $inc: { creditBalance: transaction.credits },
    });

    await transactionModel.findByIdAndUpdate(transaction._id, {
      payment: true,
      paymentId: razorpay_payment_id,
    });

    res.json({ success: true, message: "Payment verified, credits added" });
  } catch (error) {
    console.error("Razorpay Verify Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  registerUser,
  loginUser,
  userCredits,
  paymentRazorpay,
  verifyRazorpay,
};
