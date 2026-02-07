import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Wifi, Zap } from "lucide-react";
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
          toast({ title: "Already on the list!", description: "This email is already registered." });
        } else {
          throw error;
        }
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
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background/40 z-10" />
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      
      {/* World Map as full background */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
          className="w-full h-full flex items-center justify-center"
        >
          <div className="w-full max-w-[1800px] translate-y-[15%]">
            <WorldMap dots={connectionDots} lineColor="hsl(262, 83%, 58%)" />
          </div>
        </motion.div>
      </div>

      {/* Hero Content - Overlaid */}
      <div className="relative z-20 container max-w-4xl mx-auto px-4 pt-20 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6"
          >
            <Shield className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-muted-foreground">Powered by WireGuard®</span>
          </motion.div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-tight mb-4">
            Your Private
            <span className="block gradient-text">Mesh Network</span>
            Made Simple
          </h1>

          {/* Subheadline with animated text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-muted-foreground mb-2"
          >
            Global{" "}
            <span className="gradient-text font-semibold">
              {"Connectivity".split("").map((letter, idx) => (
                <motion.span
                  key={idx}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 + idx * 0.03 }}
                >
                  {letter}
                </motion.span>
              ))}
            </span>
            {" "}— Connect securely from anywhere.
          </motion.p>

          <p className="text-base md:text-lg text-muted-foreground/80 mb-8 max-w-xl mx-auto">
            Zero config, cross-platform, works behind any firewall.
          </p>

          {/* Waitlist form */}
          <form onSubmit={handleWaitlistSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-8">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 bg-background/80 backdrop-blur border-border/50 focus:border-primary"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              size="lg" 
              className="h-12 px-8 gradient-bg hover:opacity-90 transition-opacity glow-sm"
              disabled={isLoading}
            >
              {isLoading ? "Joining..." : "Get Early Access"}
            </Button>
          </form>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap items-center gap-4 md:gap-6 justify-center text-sm"
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              <Wifi className="w-4 h-4 text-accent" />
              <span>Works behind NAT</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Shield className="w-4 h-4 text-primary" />
              <span>Military-grade encryption</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Zap className="w-4 h-4 text-accent" />
              <span>Zero-config setup</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
