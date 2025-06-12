import Razorpay from "razorpay";
import { NextResponse } from "next/server";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || "", 
    key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

// Here make sure to add code for Authenticated users by using getServerSession()

export async function POST(request: Request) {
    try {
        const { amount, currency } = await request.json();

        if (!amount || !currency) {
            return NextResponse.json({ error: "Amount and currency are required" }, { status: 400 });
        }

        const options = {
            amount: amount * 100, // Convert to smallest currency unit
            currency: currency,
            receipt: `receipt_${new Date().getTime()}`,
        };

        const order = await razorpay.orders.create(options);

        return NextResponse.json(order);
    } catch (error) {
        console.error("Error creating order:", error);
        return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }
};
