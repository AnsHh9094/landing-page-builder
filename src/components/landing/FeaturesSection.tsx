import { motion, useMotionValue, useMotionTemplate, animate } from "framer-motion";
import { useEffect } from "react";
import { MagneticText } from "@/components/MagneticText";
import {
  Server,
  LayoutDashboard,
  Monitor,
  RefreshCw,
  Radio,
  ShieldCheck
} from "lucide-react";

const COLORS_TOP = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];

const features = [
  {
    icon: Server,
    title: "Central Hub Architecture",
    description: "All traffic routes through your VPS, ensuring connectivity even behind strict NAT/Firewalls.",
  },
  {
    icon: LayoutDashboard,
    title: "Real-time Dashboard",
    description: "Monitor device status, handshake times, and data transfer instantly with a beautiful interface.",
  },
  {
    icon: Monitor,
    title: "Cross-Platform Support",
    description: "Native clients for Windows, Android, and Linux. Connect any device with ease.",
  },
  {
    icon: RefreshCw,
    title: "Zero-Config Sync",
    description: "Devices added in the dashboard are automatically synced to your VPS WireGuard interface.",
  },
  {
    icon: Radio,
    title: "UDP Relay Fallback",
    description: "Fallback connectivity for the most restrictive networks. Never lose connection.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Defaults",
    description: "Uses WireGuard's state-of-the-art encryption. Security without complexity.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

// CSS-based animated stars
const StarField = () => {
  return (
    <div className="absolute inset-0 overflow-hidden dark:block hidden">
      {[...Array(100)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white animate-pulse"
          style={{
            width: Math.random() * 3 + 1 + "px",
            height: Math.random() * 3 + 1 + "px",
            top: Math.random() * 100 + "%",
            left: Math.random() * 100 + "%",
            opacity: Math.random() * 0.7 + 0.3,
            animationDelay: Math.random() * 3 + "s",
            animationDuration: Math.random() * 3 + 2 + "s",
          }}
        />
      ))}
    </div>
  );
};

export function FeaturesSection() {
  const color = useMotionValue(COLORS_TOP[0]);

  useEffect(() => {
    animate(color, COLORS_TOP, {
      ease: "easeInOut",
      duration: 10,
      repeat: Infinity,
      repeatType: "mirror",
    });
  }, [color]);

  const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%, hsl(var(--background)) 50%, ${color})`;

  return (
    <motion.section
      style={{ backgroundImage }}
      className="py-24 px-4 relative overflow-hidden bg-background"
      id="features"
    >
      {/* Bottom gradient fade for smooth transition to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background via-background/80 to-transparent z-[5]" />

      {/* Animated Stars Background */}
      <StarField />

      <div className="container max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4 text-foreground">
            <MagneticText body="Everything You Need for" as="span" className="block">
              {(tokens) =>
                tokens.map((token, index) => (
                  <MagneticText.Token key={index} body={token} className="inline-block cursor-default whitespace-pre" />
                ))
              }
            </MagneticText>
            <MagneticText body="Private Networking" as="span" className="block text-foreground/60">
              {(tokens) =>
                tokens.map((token, index) => (
                  <MagneticText.Token key={index} body={token} className="inline-block cursor-default whitespace-pre" />
                ))
              }
            </MagneticText>
          </h2>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            Built from the ground up for simplicity, security, and reliability.
          </p>
        </motion.div>

        {/* Features grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative"
            >
              <div className="h-full p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border hover:border-border/80 hover:shadow-lg transition-all duration-300">
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-muted/50 border border-border flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7 text-foreground/70" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-display font-semibold mb-2 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-foreground/60 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}

