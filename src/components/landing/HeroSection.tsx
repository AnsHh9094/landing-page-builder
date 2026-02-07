import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Wifi, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { WorldMap } from "@/components/ui/world-map";

// VPN connection routes - showing mesh network connections
const connectionDots = [
  {
    start: { lat: 40.7128, lng: -74.006, label: "New York" },
    end: { lat: 51.5074, lng: -0.1278, label: "London" },
  },
  {
    start: { lat: 51.5074, lng: -0.1278, label: "London" },
    end: { lat: 35.6762, lng: 139.6503, label: "Tokyo" },
  },
  {
    start: { lat: 35.6762, lng: 139.6503, label: "Tokyo" },
    end: { lat: -33.8688, lng: 151.2093, label: "Sydney" },
  },
  {
    start: { lat: 40.7128, lng: -74.006, label: "New York" },
    end: { lat: 1.3521, lng: 103.8198, label: "Singapore" },
  },
  {
    start: { lat: 52.52, lng: 13.405, label: "Berlin" },
    end: { lat: 25.2048, lng: 55.2708, label: "Dubai" },
  },
  {
    start: { lat: -23.5505, lng: -46.6333, label: "São Paulo" },
    end: { lat: 48.8566, lng: 2.3522, label: "Paris" },
  },
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
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-20 px-4">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-accent/5" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      
      {/* World Map Background */}
      <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
        <div className="w-full max-w-6xl">
          <WorldMap dots={connectionDots} lineColor="hsl(262, 83%, 58%)" />
        </div>
      </div>

      <div className="container relative z-10 max-w-7xl mx-auto">
        {/* Hero Content - Centered */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
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

          {/* Main headline */}
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-display font-bold leading-tight mb-6">
            Your Private
            <span className="block gradient-text">Mesh Network</span>
            Made Simple
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Connect all your devices securely through your own VPS. 
            Zero config, cross-platform, and works behind any firewall.
          </p>

          {/* Waitlist form */}
          <form onSubmit={handleWaitlistSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-8">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 bg-secondary/50 border-border/50 focus:border-primary"
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
            transition={{ delay: 0.6 }}
            className="flex flex-wrap items-center gap-6 justify-center"
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Wifi className="w-4 h-4 text-accent" />
              <span>Works behind NAT</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="w-4 h-4 text-primary" />
              <span>Military-grade encryption</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Zap className="w-4 h-4 text-accent" />
              <span>Zero-config setup</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Global Connectivity text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <p className="font-bold text-xl md:text-3xl text-foreground">
            Global{" "}
            <span className="gradient-text">
              {"Connectivity".split("").map((letter, idx) => (
                <motion.span
                  key={idx}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: 1 + idx * 0.04,
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </span>
          </p>
          <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto mt-2">
            Your private mesh network spans the globe. Connect securely from anywhere.
          </p>
        </motion.div>
      </div>

      {/* Bottom World Map - Full width visible */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="relative z-10 mt-8 max-w-7xl mx-auto w-full"
      >
        <WorldMap dots={connectionDots} lineColor="hsl(262, 83%, 58%)" />
      </motion.div>
    </section>
  );
}
