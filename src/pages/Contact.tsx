"use client"

import { useState } from "react"
import { ArrowLeft, Mail, MessageCircle } from "../components/Icons"
import { Link } from "react-router-dom"

import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

const contactFormSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

type ContactFormValues = z.infer<typeof contactFormSchema>

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle")

  const methods = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  })

  const FORM_ID = import.meta.env.VITE_FORMSPREE_ID ?? "mwprqrgp"

  const onSubmit = async (data: ContactFormValues) => {
    setStatus("sending")

    try {
      const formEl = document.getElementById("contactForm") as HTMLFormElement | null
      const action = formEl?.action ?? `https://formspree.io/f/${FORM_ID}`

      const formData = formEl ? new FormData(formEl) : new FormData()

      if (data.email) formData.set("_replyto", data.email)
      if (data.subject) formData.set("_subject", data.subject)

      const res = await fetch(action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      })

      if (res.ok) {
        setStatus("success")
        methods.reset()
      } else {
        setStatus("error")
      }
    } catch {
      setStatus("error")
    }
  }

  return (
    <div className="animate-fade-in">
      <div className="max-w-5xl mx-auto px-6 md:px-8 py-12 md:py-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground transition-colors mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          Back to home
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-20">
          {/* Left: Contact Info */}
          <section className="animate-slide-up">
            <p className="text-xs font-semibold text-foreground/60 uppercase tracking-widest mb-3">Contact</p>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight tracking-tight mb-8">
              Let's connect
            </h1>
            <p className="text-lg text-foreground/70 leading-relaxed mb-10">
              Have a question, idea, or just want to chat? I'd love to hear from you. Drop me a message and I'll get
              back to you as soon as possible.
            </p>

            {/* Contact methods */}
            <div className="space-y-6">
              <a
                href="mailto:ritvik.iitd@gmail.com"
                className="flex items-start gap-4 group p-4 rounded-lg hover:bg-muted/40 transition-colors duration-200"
              >
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0 group-hover:bg-muted/60 transition-colors duration-200">
                  <Mail className="w-5 h-5 text-foreground/70" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground/80">Email</p>
                  <p className="text-xs text-foreground/50">ritvik.iitd@gmail.com</p>
                </div>
              </a>
              <a
                href="https://x.com/RitvikKapila"
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-4 group p-4 rounded-lg hover:bg-muted/40 transition-colors duration-200"
              >
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0 group-hover:bg-muted/60 transition-colors duration-200">
                  <MessageCircle className="w-5 h-5 text-foreground/70" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground/80">X / Twitter</p>
                  <p className="text-xs text-foreground/50">@RitvikKapila</p>
                </div>
              </a>
            </div>
          </section>

          {/* Right: Contact Form */}
          <section className="animate-slide-up" style={{ animationDelay: "50ms" }}>
            <Form {...methods}>
              <form
                id="contactForm"
                action={`https://formspree.io/f/${FORM_ID}`}
                method="POST"
                onSubmit={methods.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={methods.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold">Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} className="bg-muted/30 border-border" />
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
                        <FormLabel className="text-xs font-semibold">Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="your@email.com"
                            {...field}
                            className="bg-muted/30 border-border"
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
                      <FormLabel className="text-xs font-semibold">Subject</FormLabel>
                      <FormControl>
                        <Input placeholder="What's this about?" {...field} className="bg-muted/30 border-border" />
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
                      <FormLabel className="text-xs font-semibold">Message</FormLabel>
                      <FormControl>
                        <textarea
                          {...field}
                          rows={6}
                          className={cn(
                            "file:text-foreground placeholder:text-foreground/40 selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input w-full min-w-0 rounded-md border bg-transparent px-4 py-3 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm",
                            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                          )}
                          placeholder="Your message..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full bg-foreground text-background hover:bg-foreground/90 font-medium text-sm"
                >
                  {status === "sending" ? "Sending…" : "Send Message"}
                </Button>

                {status === "success" && (
                  <p className="text-sm text-foreground/80 font-medium flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    Thanks for reaching out! I'll reply soon.
                  </p>
                )}

                {status === "error" && (
                  <p className="text-sm text-destructive font-medium">Something went wrong. Please try again.</p>
                )}
              </form>
            </Form>
          </section>
        </div>
      </div>
    </div>
  )
}
