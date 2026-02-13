import { motion } from "framer-motion";
import { Quote, Star, Shield, Zap, Globe } from "lucide-react";
import LaserFlow from "@/components/ui/LaserFlow";
import { useRef, MouseEvent } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";

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
  const containerRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    if (!gridRef.current) return;
    const rect = gridRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    gridRef.current.style.setProperty('--mouse-x', `${x}px`);
    gridRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  const handleMouseLeave = () => {
    if (!gridRef.current) return;
    gridRef.current.style.setProperty('--mouse-x', '-9999px');
    gridRef.current.style.setProperty('--mouse-y', '-9999px');
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="py-24 px-4 relative overflow-hidden bg-background cursor-crosshair"
      id="testimonials"
      style={{
        '--mouse-x': '-9999px',
        '--mouse-y': '-9999px',
      } as React.CSSProperties}
    >
      {/* Top gradient fade for smooth transition from previous section */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent z-[5]" />

      {/* LaserFlow Background Effect */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <ErrorBoundary>
          <LaserFlow
            horizontalBeamOffset={0.0}
            verticalBeamOffset={-0.35}
            color="#A78BFA"
            wispDensity={1.2}
            wispSpeed={15}
            wispIntensity={6}
            flowSpeed={0.35}
            flowStrength={0.3}
            fogIntensity={0.5}
            fogScale={0.3}
            decay={1.1}
            falloffStart={1.2}
            verticalSizing={2.2}
            horizontalSizing={0.5}
            fogFallSpeed={0.6}
            mouseSmoothTime={0.05}
          />
        </ErrorBoundary>
      </div>

      {/* Bottom gradient fade for content visibility */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background via-background/80 to-transparent z-[1]" />

      <div className="container max-w-7xl mx-auto relative z-10">

        {/* Visible Header Group - Slightly Opaque */}
        <div className="opacity-90">
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
                className="text-center p-4 md:p-6 rounded-2xl bg-background/80 backdrop-blur-sm border border-border/50"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-foreground/10 border border-border flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-foreground" />
                </div>
                <div className="text-2xl md:text-4xl font-display font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm text-foreground/70">
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
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Join thousands who've taken control of their network privacy.
            </p>
          </motion.div>
        </div>

        {/* Masked Content Container (Grid Only) */}
        <div
          ref={gridRef}
          className="relative py-4"
          style={{
            maskImage: `radial-gradient(circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,1) 0px, rgba(255,255,255,0.95) 80px, rgba(255,255,255,0.6) 150px, rgba(255,255,255,0.25) 220px, rgba(255,255,255,0) 300px)`,
            WebkitMaskImage: `radial-gradient(circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,1) 0px, rgba(255,255,255,0.95) 80px, rgba(255,255,255,0.6) 150px, rgba(255,255,255,0.25) 220px, rgba(255,255,255,0) 300px)`,
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
          }}
        >
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
                <div className="h-full p-6 rounded-2xl bg-background/80 backdrop-blur-sm border border-border/50 hover:shadow-lg transition-all duration-300 group">
                  {/* Quote icon */}
                  <div className="w-10 h-10 rounded-full bg-foreground/10 border border-border flex items-center justify-center mb-4">
                    <Quote className="w-5 h-5 text-foreground" />
                  </div>

                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-foreground text-foreground" />
                    ))}
                  </div>

                  {/* Quote text */}
                  <p className="text-foreground/80 mb-6 leading-relaxed">
                    "{testimonial.quote}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{testimonial.author}</div>
                      <div className="text-sm text-foreground/70">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}