// supabase/functions/create-checkout-session.ts

import { serve } from 'https://deno.land/std@0.178.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@14.1.0?target=deno'; // Use esm.sh to import Stripe for Deno

// Initialize Stripe with your Secret Key from environment variables
// Make sure STRIPE_SECRET_KEY is set in your Supabase project's Edge Functions env vars.
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2024-04-10', // Use a recent Stripe API version
  httpClient: Stripe.HttpClient.Fetch,
});

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { items, successUrl, cancelUrl } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid items in request body.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const line_items = items.map((item: any) => ({
      price_data: {
        currency: item.currency || 'usd', // Default to USD if not provided
        product_data: {
          name: item.name,
          // You can add more product details like description, images here
        },
        unit_amount: item.unit_amount, // Price in cents
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'], // Add other types as needed, e.g., 'link', 'paypal'
      line_items: line_items,
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      // You can add more options here, like customer_email, metadata, etc.
    });

    return new Response(JSON.stringify({ id: session.id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Stripe Checkout Session creation failed:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});