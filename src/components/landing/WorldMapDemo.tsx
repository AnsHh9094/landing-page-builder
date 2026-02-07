import { motion } from "framer-motion";
import { WorldMap } from "@/components/ui/world-map";

export function WorldMapDemo() {
  // VPN connection routes - showing mesh network connections
  const connectionDots = [
    {
      start: { lat: 40.7128, lng: -74.006, label: "New York" }, // New York
      end: { lat: 51.5074, lng: -0.1278, label: "London" }, // London
    },
    {
      start: { lat: 51.5074, lng: -0.1278, label: "London" }, // London
      end: { lat: 35.6762, lng: 139.6503, label: "Tokyo" }, // Tokyo
    },
    {
      start: { lat: 35.6762, lng: 139.6503, label: "Tokyo" }, // Tokyo
      end: { lat: -33.8688, lng: 151.2093, label: "Sydney" }, // Sydney
    },
    {
      start: { lat: 40.7128, lng: -74.006, label: "New York" }, // New York
      end: { lat: 1.3521, lng: 103.8198, label: "Singapore" }, // Singapore
    },
    {
      start: { lat: 52.52, lng: 13.405, label: "Berlin" }, // Berlin
      end: { lat: 25.2048, lng: 55.2708, label: "Dubai" }, // Dubai
    },
    {
      start: { lat: -23.5505, lng: -46.6333, label: "São Paulo" }, // São Paulo
      end: { lat: 48.8566, lng: 2.3522, label: "Paris" }, // Paris
    },
  ];

  return (
    <div className="py-20 w-full">
      <div className="max-w-7xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="font-bold text-xl md:text-4xl text-foreground"
        >
          Global{" "}
          <span className="gradient-text">
            {"Connectivity".split("").map((letter, idx) => (
              <motion.span
                key={idx}
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.3,
                  delay: idx * 0.04,
                }}
              >
                {letter}
              </motion.span>
            ))}
          </span>
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto py-4"
        >
          Your private mesh network spans the globe. Connect securely from
          anywhere to anywhere, routing through your trusted VPS hub.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <WorldMap dots={connectionDots} lineColor="hsl(262, 83%, 58%)" />
      </motion.div>
    </div>
  );
}
