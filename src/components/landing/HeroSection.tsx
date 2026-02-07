import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Wifi, Zap, ArrowDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { WorldMap } from "@/components/ui/world-map";

const connectionDots = [
  { start: { lat: 40.7128, lng: -74.006 }, end: { lat: 51.5074, lng: -0.1278 } },
  { start: { lat: 51.5074, lng: -0.1278 }, end: { lat: 35.6762, lng: 139.6503 } },
  { start: { lat: 35.6762, lng: 139.6503 }, end: { lat: -33.8688, lng: 151.2093 } },
  { start: { lat: 40.7128, lng: -74.006 }, end: { lat: 1.3521, lng: 103.8198 } },
  { start: { lat: 52.52, lng: 13.405 }, end: { lat: 25.2048, lng: 55.2708 } },
  { start: { lat: -23.5505, lng: -46.6333 }, end: { lat: 48.8566, lng: 2.3522 } },
];

export function HeroSection() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      toast({ title: "Invalid email", description: "Please enter a valid email address.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await supabase.from("waitlist").insert({ email: email.trim().toLowerCase() });

      if (error) {
        if (error.code === "23505") {
          toast({ title: "Already on the list!", description: "This email is already registered." });
        } else throw error;
      } else {
        toast({ title: "You're on the list! 🎉", description: "We'll notify you when we launch." });
        setEmail("");
      }
    } catch (error) {
      console.error("Waitlist error:", error);
      toast({ title: "Something went wrong", description: "Please try again later.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden pt-16">
      {/* World Map - Full Section Background */}
      <div className="absolute inset-0 flex items-start justify-center pt-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
          className="w-full max-w-[2000px] px-4"
        >
          <WorldMap dots={connectionDots} lineColor="hsl(220, 15%, 45%)" />
        </motion.div>
      </div>

      {/* Content Overlay - Centered on Map */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-background border border-border mb-8"
          >
            <Sparkles className="w-4 h-4 text-foreground" />
            <span className="text-sm font-medium text-foreground">Powered by WireGuard®</span>
          </motion.div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-tight mb-6 text-foreground">
            Global <span className="text-foreground/70">Mesh Network</span>
          </h1>

          <p className="text-foreground/70 text-lg md:text-xl max-w-xl mx-auto mb-10">
            Connect all your devices securely through your VPS. Zero config, works everywhere.
          </p>

          {/* Waitlist form */}
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onSubmit={handleWaitlistSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-10"
          >
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 bg-muted border-border focus:ring-2 focus:ring-foreground/20"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              size="lg" 
              className="h-12 px-8 bg-foreground text-background hover:bg-foreground/90 border-0" 
              disabled={isLoading}
            >
              {isLoading ? "..." : "Join Waitlist"}
            </Button>
          </motion.form>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border text-foreground">
              <Wifi className="w-4 h-4" />
              <span className="text-sm">Works behind NAT</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border text-foreground">
              <Shield className="w-4 h-4" />
              <span className="text-sm">Encrypted</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border text-foreground">
              <Zap className="w-4 h-4" />
              <span className="text-sm">Zero-config</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center"
          >
            <ArrowDown className="w-4 h-4 text-foreground" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}