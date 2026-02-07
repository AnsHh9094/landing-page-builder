import { motion } from "framer-motion";
import { Cloud, MonitorSmartphone, Globe, ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Cloud,
    title: "Deploy to Your VPS",
    description: "One-click deployment to any VPS. Your server, your data, your rules.",
  },
  {
    number: "02",
    icon: MonitorSmartphone,
    title: "Add Your Devices",
    description: "Use the dashboard to add devices. Windows, Android, Linux - all supported.",
  },
  {
    number: "03",
    icon: Globe,
    title: "Connect Securely",
    description: "Your private mesh network is ready. Connect from anywhere, securely.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-24 px-4 relative overflow-hidden" id="how-it-works">
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
            <span className="text-foreground/70"> 3 Simple Steps</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            No complex configurations. No networking expertise required.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-border transform -translate-y-1/2" />
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative"
              >
                {/* Step card */}
                <div className="relative p-8 rounded-2xl neu-raised hover:neu-lg transition-all duration-300 group">
                  {/* Step number */}
                  <div className="absolute -top-4 left-8 px-4 py-1.5 rounded-full neu-raised bg-foreground text-background text-sm font-bold">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 rounded-2xl neu-inset flex items-center justify-center mb-6 group-hover:neu-pressed transition-all">
                    <step.icon className="w-8 h-8 text-foreground/70" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-display font-semibold mb-3 text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {step.description}
                  </p>
                </div>

                {/* Arrow connector (hidden on last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:flex absolute top-1/2 -right-6 lg:-right-8 transform -translate-y-1/2 z-10">
                    <div className="w-8 h-8 rounded-full neu-sm flex items-center justify-center bg-background">
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}