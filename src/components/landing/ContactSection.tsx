import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Mail, MessageSquare, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";
import VaporizeTextCycle, { Tag } from "@/components/ui/vapour-text-effect";

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters"),
  message: z
    .string()
    .trim()
    .min(1, "Message is required")
    .max(1000, "Message must be less than 1000 characters"),
});

type FormState = "idle" | "loading" | "success";

export function ContactSection() {
  const [formState, setFormState] = useState<FormState>("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setFormState("loading");

    try {
      const { error } = await supabase.from("contact_submissions").insert({
        name: result.data.name,
        email: result.data.email,
        message: result.data.message,
      });

      if (error) throw error;

      setFormState("success");

      toast({
        title: "Message sent! ✉️",
        description: "We'll get back to you as soon as possible.",
      });

      // Reset after a delay
      setTimeout(() => {
        setFormState("idle");
        setFormData({ name: "", email: "", message: "" });
      }, 8000);
    } catch (error) {
      console.error("Contact form error:", error);
      setFormState("idle");
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <section
      className="py-24 px-4 relative bg-[#020617]"
      id="contact"
    >
      <div className="container max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4 text-foreground">
            Get In <span className="text-foreground/70">Touch</span>
          </h2>
          <p className="text-lg text-foreground/70 max-w-xl mx-auto">
            Have questions? Want to learn more? We'd love to hear from you.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-lg mx-auto"
        >
          <AnimatePresence mode="wait">
            {formState === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="relative rounded-xl border border-zinc-700/50 bg-zinc-900/80 backdrop-blur-sm p-8"
              >
                {/* Success vapour text */}
                <div className="h-20 flex items-center justify-center mb-4">
                  <VaporizeTextCycle
                    texts={["Message Sent!", "Thank You ✉️", "We'll Reply Soon"]}
                    font={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "32px",
                      fontWeight: 600,
                    }}
                    color="rgb(255, 255, 255)"
                    spread={3}
                    density={7}
                    animation={{
                      vaporizeDuration: 2,
                      fadeInDuration: 1,
                      waitDuration: 1.5,
                    }}
                    direction="left-to-right"
                    alignment="center"
                    tag={Tag.H3}
                  />
                </div>
                <p className="text-center text-zinc-400 text-sm">
                  We appreciate you reaching out. Our team will get back to you shortly.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
                transition={{ duration: 0.5 }}
              >
                <form
                  onSubmit={handleSubmit}
                  className="space-y-5 rounded-xl border border-zinc-700/50 bg-zinc-900/80 backdrop-blur-sm p-6 md:p-8"
                >
                  {/* Name field */}
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="flex items-center gap-2 text-sm font-medium text-zinc-400 mb-2"
                    >
                      <User className="w-3.5 h-3.5" />
                      Name
                    </label>
                    <input
                      type="text"
                      id="contact-name"
                      name="name"
                      autoComplete="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg text-sm text-zinc-50 placeholder-zinc-500 bg-zinc-800/80 border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all ${errors.name ? "ring-1 ring-red-500 border-red-500" : ""
                        }`}
                      disabled={formState === "loading"}
                    />
                    {errors.name && (
                      <p className="text-xs text-red-400 mt-1.5">{errors.name}</p>
                    )}
                  </div>

                  {/* Email field */}
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="flex items-center gap-2 text-sm font-medium text-zinc-400 mb-2"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      Email
                    </label>
                    <input
                      type="email"
                      id="contact-email"
                      name="email"
                      autoComplete="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg text-sm text-zinc-50 placeholder-zinc-500 bg-zinc-800/80 border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all ${errors.email ? "ring-1 ring-red-500 border-red-500" : ""
                        }`}
                      disabled={formState === "loading"}
                    />
                    {errors.email && (
                      <p className="text-xs text-red-400 mt-1.5">{errors.email}</p>
                    )}
                  </div>

                  {/* Message field */}
                  <div>
                    <label
                      htmlFor="contact-message"
                      className="flex items-center gap-2 text-sm font-medium text-zinc-400 mb-2"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      autoComplete="off"
                      placeholder="Tell us what you're thinking..."
                      value={formData.message}
                      onChange={(e) => handleChange("message", e.target.value)}
                      rows={4}
                      className={`w-full px-4 py-3 border rounded-lg text-sm text-zinc-50 placeholder-zinc-500 bg-zinc-800/80 border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all resize-none ${errors.message ? "ring-1 ring-red-500 border-red-500" : ""
                        }`}
                      disabled={formState === "loading"}
                    />
                    {errors.message && (
                      <p className="text-xs text-red-400 mt-1.5">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={formState === "loading"}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-white text-zinc-900 font-medium text-sm hover:bg-zinc-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {formState === "loading" ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}