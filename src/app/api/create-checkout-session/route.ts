import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, addDoc, collection } from 'firebase/firestore';
import { CREDIT_PACKAGES } from '@/lib/pricing';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { packageId, userId } = await req.json();

    // Validate package
    const packageItem = CREDIT_PACKAGES.find(pkg => pkg.id === packageId);
    if (!packageItem) {
      return NextResponse.json({ error: 'Invalid package' }, { status: 400 });
    }

    // Verify user exists
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${packageItem.name} - ${packageItem.credits} Credits`,
              description: `${packageItem.credits} credits for RantBox posts`,
            },
            unit_amount: packageItem.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/buy-credits`,
      metadata: {
        userId,
        packageId,
        credits: packageItem.credits.toString(),
      },
    });

    // Save payment session to database
    await addDoc(collection(db, 'payments'), {
      userId,
      packageId,
      amount: packageItem.price,
      credits: packageItem.credits,
      status: 'pending',
      stripeSessionId: session.id,
      createdAt: Date.now(),
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
