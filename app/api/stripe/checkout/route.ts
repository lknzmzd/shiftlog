import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { requireUser } from "@/lib/supabaseServer";

export async function POST() {
  try {
    const { user, error: authError } = await requireUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: authError || "Unauthorized. Login first." },
        { status: 401 }
      );
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { success: false, error: "Missing STRIPE_SECRET_KEY" },
        { status: 500 }
      );
    }

    if (!process.env.STRIPE_PRICE_ID) {
      return NextResponse.json(
        { success: false, error: "Missing STRIPE_PRICE_ID" },
        { status: 500 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/dashboard`,
      cancel_url: `${baseUrl}/pricing`,
      metadata: {
        user_id: user.id,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        url: session.url,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err?.message || "Stripe checkout failed",
      },
      { status: 500 }
    );
  }
}