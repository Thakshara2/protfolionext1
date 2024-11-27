import { NextResponse } from 'next/server';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

const MERCHANT_ID = "1228851";
const MERCHANT_SECRET = process.env.PAYHERE_MERCHANT_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, orderId, itemName, currency } = body;

    // First, hash the merchant secret
    const hashedSecret = crypto
      .createHash('md5')
      .update(MERCHANT_SECRET)
      .digest('hex')
      .toUpperCase();

    // Format amount to 2 decimal places without commas
    const amountFormatted = parseFloat(amount)
      .toLocaleString('en-us', { minimumFractionDigits: 2 })
      .replace(/,/g, '');

    // Create payment data
    const paymentData = {
      merchant_id: MERCHANT_ID,
      return_url: 'http://localhost:3000/payment/success',
      cancel_url: 'http://localhost:3000/payment/cancel',
      notify_url: 'http://localhost:3000/api/payhere/notify',
      order_id: orderId,
      items: itemName,
      currency: currency,
      amount: amountFormatted,
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      phone: '0771234567',
      address: 'No.1, Galle Road',
      city: 'Colombo',
      country: 'Sri Lanka',
    };

    // Generate hash using hashed secret
    const hashString = `${MERCHANT_ID}${orderId}${amountFormatted}${currency}${hashedSecret}`;
    
    const hash = crypto
      .createHash('md5')
      .update(hashString)
      .digest('hex')
      .toUpperCase();

    // For debugging
    console.log('Hash Generation:', {
      merchantId: MERCHANT_ID,
      orderId,
      amountFormatted,
      currency,
      hashedSecret,
      finalHash: hash
    });

    return NextResponse.json({
      ...paymentData,
      hash
    });
  } catch (error) {
    console.error('Payment creation failed:', error);
    return NextResponse.json(
      { error: 'Payment creation failed' },
      { status: 500 }
    );
  }
} 