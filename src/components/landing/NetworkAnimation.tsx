import { motion } from "framer-motion";
import { Monitor, Smartphone, Server, Laptop } from "lucide-react";

export function NetworkAnimation() {
  const devices = [
    { icon: Monitor, label: "Windows", angle: 0 },
    { icon: Smartphone, label: "Android", angle: 72 },
    { icon: Laptop, label: "Linux", angle: 144 },
    { icon: Monitor, label: "PC", angle: 216 },
    { icon: Smartphone, label: "Mobile", angle: 288 },
  ];

  return (
    <div className="relative w-full h-[500px] flex items-center justify-center">
      {/* Outer glow rings */}
      <div className="absolute w-80 h-80 rounded-full border border-primary/20 animate-pulse-glow" />
      <div className="absolute w-96 h-96 rounded-full border border-accent/10" />
      
      {/* Connection lines */}
      {devices.map((_, index) => {
        const angle = (index * 72 * Math.PI) / 180;
        const x2 = Math.cos(angle) * 140;
        const y2 = Math.sin(angle) * 140;
        
        return (
          <motion.div
            key={index}
            className="absolute w-[2px] bg-gradient-to-b from-primary/60 to-accent/60"
            style={{
              height: 140,
              transformOrigin: "top center",
              rotate: `${index * 72 + 90}deg`,
            }}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
          />
        );
      })}

      {/* Central hub */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.8 }}
        className="relative z-10 w-24 h-24 rounded-2xl gradient-bg flex items-center justify-center glow-md"
      >
        <Server className="w-10 h-10 text-primary-foreground" />
        <motion.div
          className="absolute inset-0 rounded-2xl border-2 border-primary"
          animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>

      {/* Orbiting devices */}
      {devices.map((device, index) => {
        const angle = (index * 72 * Math.PI) / 180;
        const x = Math.cos(angle) * 160;
        const y = Math.sin(angle) * 160;
        const Icon = device.icon;

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 + index * 0.15, type: "spring" }}
            className="absolute flex flex-col items-center gap-2"
            style={{
              left: `calc(50% + ${x}px - 28px)`,
              top: `calc(50% + ${y}px - 28px)`,
            }}
          >
            <div className="w-14 h-14 rounded-xl glass flex items-center justify-center hover:scale-110 transition-transform cursor-pointer group">
              <Icon className="w-6 h-6 text-accent group-hover:text-primary transition-colors" />
            </div>
            <span className="text-xs text-muted-foreground font-medium">{device.label}</span>
            
            {/* Data transfer animation */}
            <motion.div
              className="absolute w-2 h-2 rounded-full bg-accent"
              animate={{
                x: [-x * 0.7, 0],
                y: [-y * 0.7, 0],
                opacity: [1, 0],
                scale: [1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.3,
                repeatDelay: 2,
              }}
            />
          </motion.div>
        );
      })}

      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary/40"
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: `${20 + Math.random() * 60}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
}
