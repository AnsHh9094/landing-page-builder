import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Wifi, Zap, ArrowDown } from "lucide-react";
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
    <section className="relative min-h-screen overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px]" />
      
      {/* Content Container */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Top: Hero Text */}
        <div className="pt-24 pb-8 px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4"
          >
            <Shield className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-muted-foreground">Powered by WireGuard®</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight mb-3"
          >
            Global <span className="gradient-text">Mesh Network</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-base md:text-lg max-w-lg mx-auto mb-6"
          >
            Connect all your devices securely through your VPS. Zero config, works everywhere.
          </motion.p>

          {/* Waitlist form */}
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onSubmit={handleWaitlistSubmit}
            className="flex flex-col sm:flex-row gap-2 max-w-sm mx-auto"
          >
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 bg-background/60 backdrop-blur border-border/50"
              disabled={isLoading}
            />
            <Button type="submit" className="h-11 px-6 gradient-bg glow-sm" disabled={isLoading}>
              {isLoading ? "..." : "Join Waitlist"}
            </Button>
          </motion.form>
        </div>

        {/* Center: World Map */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="flex-1 flex items-center justify-center px-4 -mt-4"
        >
          <div className="w-full max-w-5xl">
            <WorldMap dots={connectionDots} lineColor="hsl(262, 83%, 58%)" />
          </div>
        </motion.div>

        {/* Bottom: Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="pb-8 px-4"
        >
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 text-accent" />
              <span>Works behind NAT</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <span>Military-grade encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-accent" />
              <span>Zero-config setup</span>
            </div>
          </div>
          
          {/* Scroll indicator */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex justify-center mt-6"
          >
            <ArrowDown className="w-5 h-5 text-muted-foreground/50" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
