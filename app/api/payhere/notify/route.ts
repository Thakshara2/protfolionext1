import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Verify the payment status
    const {
      merchant_id,
      order_id,
      payment_id,
      payhere_amount,
      payhere_currency,
      status_code,
      md5sig,
    } = body;

    // Verify the MD5 hash
    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET!;
    const expectedHash = generateHash({
      merchantId: merchant_id,
      orderId: order_id,
      amount: payhere_amount,
      currency: payhere_currency,
      statusCode: status_code,
      merchantSecret,
    });

    if (md5sig !== expectedHash) {
      throw new Error('Invalid hash');
    }

    // Handle different status codes
    switch (status_code) {
      case 2: // Success
        // Update your database
        await updatePaymentStatus(order_id, 'success', payment_id);
        break;
      case -2: // Failed
        await updatePaymentStatus(order_id, 'failed', payment_id);
        break;
      case -3: // Charged Back
        await updatePaymentStatus(order_id, 'charged_back', payment_id);
        break;
      default:
        console.log('Unknown status code:', status_code);
    }

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Notification handling failed:', error);
    return NextResponse.json(
      { error: 'Notification handling failed' },
      { status: 500 }
    );
  }
}

function generateHash({
  merchantId,
  orderId,
  amount,
  currency,
  statusCode,
  merchantSecret,
}: {
  merchantId: string;
  orderId: string;
  amount: string;
  currency: string;
  statusCode: number;
  merchantSecret: string;
}) {
  const md5 = require('crypto');
  
  // Format should be: merchantId + orderId + amount + currency + statusCode + merchantSecret uppercase MD5
  const string = `${merchantId}${orderId}${amount}${currency}${statusCode}${merchantSecret}`;
  
  return md5
    .createHash('md5')
    .update(string)
    .digest('hex')
    .toUpperCase();
}

async function updatePaymentStatus(
  orderId: string,
  status: 'success' | 'failed' | 'charged_back',
  paymentId: string
) {
  // Implement your database update logic here
  console.log(`Payment ${paymentId} for order ${orderId} is ${status}`);
} 