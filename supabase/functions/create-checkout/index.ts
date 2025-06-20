import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { price_id, user_id, success_url, cancel_url, customer_email } =
      await req.json();

    if (!price_id || !user_id || !success_url || !cancel_url) {
      throw new Error("Missing required parameters");
    }

    // Create form data for PICA API
    const params = new URLSearchParams();
    params.append("mode", "subscription");
    params.append("line_items[0][price]", price_id);
    params.append("line_items[0][quantity]", "1");
    params.append("success_url", success_url);
    params.append("cancel_url", cancel_url);
    params.append("automatic_tax[enabled]", "true");

    if (customer_email) {
      params.append("customer_email", customer_email);
    }

    // Add metadata
    params.append("metadata[user_id]", user_id);

    // Call PICA passthrough API
    const response = await fetch(
      "https://api.picaos.com/v1/passthrough/v1/checkout/sessions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "x-pica-secret": Deno.env.get("PICA_SECRET_KEY") || "",
          "x-pica-connection-key":
            Deno.env.get("PICA_STRIPE_CONNECTION_KEY") || "",
          "x-pica-action-id":
            "conn_mod_def::GCmLNSLWawg::Pj6pgAmnQhuqMPzB8fquRg",
        },
        body: params,
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("PICA API error:", errorText);
      throw new Error(`PICA API error: ${response.status} ${errorText}`);
    }

    const session = await response.json();

    return new Response(
      JSON.stringify({ sessionId: session.id, url: session.url }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
