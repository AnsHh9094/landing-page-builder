import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Github, Twitter, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const footerLinks = {
  product: [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Testimonials", href: "#testimonials" },
  ],
  resources: [
    { label: "Documentation", href: "#" },
    { label: "Setup Guide", href: "#" },
    { label: "FAQ", href: "#" },
  ],
  company: [
    { label: "About", href: "#" },
    { label: "Contact", href: "#contact" },
    { label: "Privacy", href: "#" },
  ],
};

export function Footer() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("waitlist")
        .insert({ email: email.trim().toLowerCase() });

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Already on the list!",
            description: "This email is already registered for early access.",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "You're on the list! 🎉",
          description: "We'll notify you when we launch.",
        });
        setEmail("");
      }
    } catch (error) {
      console.error("Waitlist error:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="relative pt-24 pb-8 px-4 overflow-hidden">
      <div className="container max-w-7xl mx-auto relative z-10">
        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-8 md:p-12 rounded-3xl neu-raised mb-16 text-center"
        >
          <h3 className="text-2xl md:text-3xl font-display font-bold mb-4 text-foreground">
            Ready to Take Control of Your <span className="text-foreground/70">Network Privacy</span>?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Join the waitlist and be the first to know when we launch.
          </p>
          <form
            onSubmit={handleWaitlistSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 neu-inset border-0 bg-background focus:ring-2 focus:ring-foreground/20"
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="lg"
              className="h-12 px-6 neu-raised bg-foreground text-background hover:bg-foreground/90 border-0"
              disabled={isLoading}
            >
              {isLoading ? "..." : <><span>Join</span><ArrowRight className="w-4 h-4 ml-2" /></>}
            </Button>
          </form>
        </motion.div>

        {/* Footer grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl neu-raised flex items-center justify-center">
                <Shield className="w-5 h-5 text-foreground" />
              </div>
              <span className="text-xl font-display font-bold text-foreground">VPN Panel</span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Your self-hosted VPN control panel for creating private mesh networks. Simple, secure, and cross-platform.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-xl neu-raised flex items-center justify-center hover:neu-lg transition-all"
              >
                <Github className="w-5 h-5 text-foreground/70" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-xl neu-raised flex items-center justify-center hover:neu-lg transition-all"
              >
                <Twitter className="w-5 h-5 text-foreground/70" />
              </a>
              <a
                href="#contact"
                className="w-10 h-10 rounded-xl neu-raised flex items-center justify-center hover:neu-lg transition-all"
              >
                <Mail className="w-5 h-5 text-foreground/70" />
              </a>
            </div>
          </div>

          {/* Links columns */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-foreground">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-foreground">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 VPN Panel. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Powered by WireGuard® — the most secure VPN protocol.
          </p>
        </div>
      </div>
    </footer>
  );
}