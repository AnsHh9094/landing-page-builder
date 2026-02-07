import { motion } from "framer-motion";
import { Quote, Star, Shield, Zap, Globe } from "lucide-react";

const testimonials = [
  {
    quote: "Finally, a VPN solution that just works. No more fighting with configs or troubleshooting connections.",
    author: "Alex Chen",
    role: "DevOps Engineer",
    avatar: "AC",
  },
  {
    quote: "The cross-platform support is incredible. My Windows workstation, Android phone, and Linux servers all connected seamlessly.",
    author: "Maria Rodriguez",
    role: "Systems Administrator",
    avatar: "MR",
  },
  {
    quote: "Self-hosted means I own my data. The zero-config sync is a game changer for managing multiple devices.",
    author: "James Wilson",
    role: "Security Consultant",
    avatar: "JW",
  },
];

const stats = [
  { icon: Shield, value: "99%", label: "Works behind firewalls" },
  { icon: Zap, value: "<50ms", label: "Average latency" },
  { icon: Globe, value: "3", label: "Platforms supported" },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 px-4 relative overflow-hidden" id="testimonials">
      <div className="container max-w-7xl mx-auto relative z-10">
        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-3 gap-4 md:gap-8 mb-20 max-w-3xl mx-auto"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-4 md:p-6 rounded-2xl neu-raised"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full neu-inset flex items-center justify-center mx-auto mb-3">
                <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-foreground/70" />
              </div>
              <div className="text-2xl md:text-4xl font-display font-bold text-foreground mb-1">
                {stat.value}
              </div>
              <div className="text-xs md:text-sm text-muted-foreground">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4 text-foreground">
            Trusted by
            <span className="text-foreground/70"> Security-Minded</span> Professionals
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands who've taken control of their network privacy.
          </p>
        </motion.div>

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="relative"
            >
              <div className="h-full p-6 rounded-2xl neu-raised hover:neu-lg transition-all duration-300 group">
                {/* Quote icon */}
                <div className="w-10 h-10 rounded-full neu-inset flex items-center justify-center mb-4">
                  <Quote className="w-5 h-5 text-foreground/50" />
                </div>
                
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-foreground/30 text-foreground/30" />
                  ))}
                </div>

                {/* Quote text */}
                <p className="text-foreground/80 mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full neu-raised flex items-center justify-center text-sm font-bold text-foreground/70">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}