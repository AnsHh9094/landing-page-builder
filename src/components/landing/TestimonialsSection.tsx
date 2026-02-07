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
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent" />
      
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
              className="text-center p-4 md:p-6 rounded-2xl glass"
            >
              <stat.icon className="w-6 h-6 md:w-8 md:h-8 text-accent mx-auto mb-2" />
              <div className="text-2xl md:text-4xl font-display font-bold gradient-text mb-1">
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
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4">
            Trusted by
            <span className="gradient-text"> Security-Minded</span> Professionals
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
              <div className="h-full p-6 rounded-2xl glass hover:bg-card/90 transition-all duration-300 group">
                {/* Quote icon */}
                <Quote className="w-8 h-8 text-primary/30 mb-4" />
                
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>

                {/* Quote text */}
                <p className="text-foreground/90 mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-bold text-primary-foreground">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.author}</div>
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
