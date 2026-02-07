import { motion } from "framer-motion";
import { 
  Server, 
  LayoutDashboard, 
  Monitor, 
  RefreshCw, 
  Radio, 
  ShieldCheck 
} from "lucide-react";

const features = [
  {
    icon: Server,
    title: "Central Hub Architecture",
    description: "All traffic routes through your VPS, ensuring connectivity even behind strict NAT/Firewalls.",
    gradient: "from-primary to-primary/60",
  },
  {
    icon: LayoutDashboard,
    title: "Real-time Dashboard",
    description: "Monitor device status, handshake times, and data transfer instantly with a beautiful interface.",
    gradient: "from-accent to-accent/60",
  },
  {
    icon: Monitor,
    title: "Cross-Platform Support",
    description: "Native clients for Windows, Android, and Linux. Connect any device with ease.",
    gradient: "from-cyber-blue to-primary",
  },
  {
    icon: RefreshCw,
    title: "Zero-Config Sync",
    description: "Devices added in the dashboard are automatically synced to your VPS WireGuard interface.",
    gradient: "from-accent to-cyber-blue",
  },
  {
    icon: Radio,
    title: "UDP Relay Fallback",
    description: "Fallback connectivity for the most restrictive networks. Never lose connection.",
    gradient: "from-primary to-accent",
  },
  {
    icon: ShieldCheck,
    title: "Secure Defaults",
    description: "Uses WireGuard's state-of-the-art encryption. Security without complexity.",
    gradient: "from-accent/80 to-primary/80",
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

export function FeaturesSection() {
  return (
    <section className="py-24 px-4 relative overflow-hidden" id="features">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="container max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4">
            Everything You Need for
            <span className="block gradient-text">Private Networking</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
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
              <div className="h-full p-6 rounded-2xl glass hover:bg-card/90 transition-all duration-300 hover:scale-[1.02] hover:glow-sm">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7 text-primary-foreground" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-display font-semibold mb-2 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover gradient line */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
