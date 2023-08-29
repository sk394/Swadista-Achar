const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const catchAsyncErrors = require('../middleware/catchAsyncErrors');

exports.processPayment = catchAsyncErrors(async (req, res, next) => {
    const myPayment = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: 'usd',
        metadata: { integration_check: 'accept_a_payment', company: 'MERN Shop' },
    });

    res.status(200).json({
        success: true,
        client_secret: myPayment.client_secret,
    });
});

exports.sendStripeApiKey = catchAsyncErrors(async (req, res, next) => {
    res.status(200).json({
        stripeApiKey: process.env.STRIPE_API_KEY,
    });
});