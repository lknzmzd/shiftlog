import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { headers } from "next/headers";

export async function POST(req: Request) {
  const headerStore = await headers();
  const sig = headerStore.get("stripe-signature");

  if (!sig) {
    return new Response("Missing Stripe signature", { status: 400 });
  }

  const body = await req.text();

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return new Response("Invalid webhook signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    const userId = session.metadata?.user_id;

    if (userId) {
      await supabaseAdmin
        .from("user_subscriptions")
        .upsert({
          user_id: userId,
          plan: "pro",
          reports_limit: 9999,
          reports_used: 0,
        });
    }
  }

  return new Response("ok");
}