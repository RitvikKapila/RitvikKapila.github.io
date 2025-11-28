import { useState } from "react";
import Sidebar from "../components/Sidebar";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const contactFormSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");

  const methods = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

// Use env var first, fall back to example `mwprqrgp` (replace with your id)
const FORM_ID = import.meta.env.VITE_FORMSPREE_ID ?? "mwprqrgp";

  const onSubmit = async (data: ContactFormValues) => {
    setStatus("sending");

    try {
      const formEl = document.getElementById("contactForm") as HTMLFormElement | null;
      const action = formEl?.action ?? `https://formspree.io/f/${FORM_ID}`;

      // Build FormData from the form element so submission matches a native form post
      const formData = formEl ? new FormData(formEl) : new FormData();

      // Ensure reply-to and subject are available to Formspree
      if (data.email) formData.set("_replyto", data.email);
      if (data.subject) formData.set("_subject", data.subject);

      const res = await fetch(action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (res.ok) {
        setStatus("success");
        methods.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="md:flex">
        <aside className="hidden md:block md:fixed md:top-16 md:bottom-0 md:w-1/3 md:overflow-auto">
          <div className="h-full p-6 flex justify-center items-center">
            <Sidebar />
          </div>
        </aside>

        <main className="w-full md:ml-[33.3333%] md:w-2/3">
          <div className="max-w-[680px] mx-auto px-6 py-16 md:py-24">
            <section
              className="mb-12 animate-slide-up"
              style={{ animationDelay: "200ms" }}
            >
              <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-6">
                Contact
              </h2>

              <div className="md:flex gap-10">
                <div className="md:flex-1">
                  <h3 className="text-lg font-semibold mb-4">
                    Send me a message
                  </h3>

                  <Form {...methods}>
                    <form
                      id="contactForm"
                      action={`https://formspree.io/f/${FORM_ID}`}
                      method="POST"
                      onSubmit={methods.handleSubmit(onSubmit)}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={methods.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name (Optional)</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Your name or leave blank"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={methods.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email (Optional)</FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="your.email@example.com"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={methods.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="What's this about?"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={methods.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                              <textarea
                                {...field}
                                rows={6}
                                className={cn(
                                  "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm",
                                  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                                  "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
                                )}
                                placeholder="Your message here..."
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div>
                        <Button type="submit" disabled={status === "sending"}>
                          {status === "sending" ? "Sending…" : "Send Message"}
                        </Button>
                      </div>

                      {status === "success" && (
                        <p className="text-sm text-foreground/90">
                          Thanks — your message has been sent.
                        </p>
                      )}

                      {status === "error" && (
                        <p className="text-sm text-destructive">
                          Something went wrong. Please try again later.
                        </p>
                      )}
                    </form>
                  </Form>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
