import { motion } from "framer-motion";
import DatabaseWithRestApi from "@/components/ui/database-with-rest-api";

export function HowItWorksSection() {
  return (
    <section className="py-24 px-4 relative overflow-hidden bg-background" id="how-it-works">
      {/* Bottom gradient fade for smooth transition to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent z-[5]" />

      <div className="container max-w-6xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4 text-foreground">
            Up and Running in
            <span className="text-foreground/60"> 3 Simple Steps</span>
          </h2>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            No complex configurations. No networking expertise required.
          </p>
        </motion.div>

        {/* Database REST API Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex justify-center"
        >
          <DatabaseWithRestApi
            circleText="VPN"
            title="Secure mesh network through your VPS"
            badgeTexts={{
              first: "Deploy",
              second: "Config",
              third: "Connect",
              fourth: "Secure"
            }}
            buttonTexts={{
              first: "WhaleScale",
              second: "mesh_network"
            }}
            lightColor="#10B981"
            className="w-full max-w-[800px]"
          />
        </motion.div>

        {/* Steps description below */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 grid md:grid-cols-3 gap-8 text-center"
        >
          <div className="p-6">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mb-4">
              <span className="text-emerald-400 font-bold">01</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Deploy to Your VPS</h3>
            <p className="text-foreground/60 text-sm">One-click deployment to any VPS. Your server, your data, your rules.</p>
          </div>

          <div className="p-6">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mb-4">
              <span className="text-emerald-400 font-bold">02</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Add Your Devices</h3>
            <p className="text-foreground/60 text-sm">Use the dashboard to add devices. Windows, Android, Linux - all supported.</p>
          </div>

          <div className="p-6">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mb-4">
              <span className="text-emerald-400 font-bold">03</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Connect Securely</h3>
            <p className="text-foreground/60 text-sm">Your private mesh network is ready. Connect from anywhere, securely.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}