import { supabase } from "@/lib/supabase/client";

export type ContactFormInput = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type SendResult = { ok: true } | { ok: false; error: string };

export async function sendContactMessage(input: ContactFormInput): Promise<SendResult> {
  if (!supabase) {
    return { ok: false, error: "Contact form is not configured right now." };
  }

  const { data, error } = await supabase.functions.invoke("send-contact-email", {
    body: input,
  });

  if (error) {
    console.error("Error sending contact message:", error);
    return { ok: false, error: "Something went wrong. Please try again or email us directly." };
  }

  if (data?.error) {
    return { ok: false, error: data.error as string };
  }

  return { ok: true };
}