import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, increment, query, where, collection, getDocs, writeBatch } from 'firebase/firestore';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      const { userId, packageId, credits } = session.metadata!;
      
      // Update user credits
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        credits: increment(parseInt(credits))
      });

      // Update payment status
      const paymentsQuery = query(
        collection(db, 'payments'),
        where('stripeSessionId', '==', session.id)
      );
      
      const paymentDocs = await getDocs(paymentsQuery);
      const batch = writeBatch(db);
      
      paymentDocs.forEach((doc) => {
        batch.update(doc.ref, {
          status: 'completed',
          completedAt: Date.now()
        });
      });
      
      await batch.commit();

      console.log(`Credits added to user ${userId}: +${credits} credits`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
