import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Leaf, Wallet } from 'lucide-react';

const Home = () => {
  return (
    <div className="w-full" style={{ paddingBottom: 'var(--space-page-bottom)' }}>
      
      {/* Hero Section */}
      <section 
        className="max-w-4xl mx-auto text-center flex flex-col items-center"
        style={{ 
          paddingTop: 'clamp(0.75rem, 3vw, 3rem)',
          paddingBottom: 'clamp(2rem, 5vw, 5rem)',
          paddingLeft: 'var(--space-page-x)',
          paddingRight: 'var(--space-page-x)',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center rounded-full border border-border bg-white px-2.5 sm:px-3 py-1 text-xs sm:text-sm font-medium text-muted-foreground shadow-sm"
          style={{ marginBottom: 'clamp(1rem, 3vw, 2rem)' }}
        >
          <span className="flex h-2 w-2 rounded-full bg-status-available mr-2 animate-pulse"></span>
          Over 8,000 items currently shared on campus
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="hero-heading font-extrabold tracking-tight text-primary leading-[1.1] sm:leading-tight"
          style={{ marginBottom: 'clamp(0.75rem, 2vw, 1.5rem)' }}
        >
          <span className="block">Borrow what you need.</span>
          <span className="text-accent relative inline-block">
            Share what you have.
            <svg className="absolute w-full h-2 sm:h-3 -bottom-0.5 sm:-bottom-1 left-0 text-accent/30" viewBox="0 0 100 10" preserveAspectRatio="none">
              <path d="M0 5 Q 50 15 100 5" fill="transparent" stroke="currentColor" strokeWidth="4" />
            </svg>
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="hero-subheading text-muted-foreground max-w-2xl leading-relaxed"
          style={{ marginBottom: 'clamp(1.5rem, 4vw, 2.5rem)' }}
        >
          The frictionless college peer-to-peer equipment sharing platform. Access calculators, textbooks, IoT kits, and DSLR cameras directly from verified students.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto"
        >
          <Button size="lg" asChild className="hero-cta-btn rounded-full w-full sm:w-auto">
            <Link to="/feed">Browse Inventory</Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="hero-cta-btn rounded-full bg-white w-full sm:w-auto">
            <Link to="/register">Join as Student</Link>
          </Button>
        </motion.div>
      </section>

      {/* Bento Grid Value Props */}
      <section 
        className="max-w-6xl mx-auto"
        style={{
          paddingLeft: 'var(--space-page-x)',
          paddingRight: 'var(--space-page-x)',
          marginTop: 'clamp(0.5rem, 2vw, 2.5rem)',
        }}
      >
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
        >
          
          <div className="glass-panel p-5 sm:p-6 md:p-8 flex flex-col items-start text-left hover:-translate-y-1 transition-transform duration-300">
            <div className="bg-accent/10 p-2.5 sm:p-3 rounded-2xl mb-3 sm:mb-4 md:mb-5 text-accent">
              <ShieldCheck size={24} strokeWidth={1.5} className="sm:w-7 sm:h-7 md:w-8 md:h-8" />
            </div>
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-primary mb-1.5 sm:mb-2">Verified Peers</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Every user is authenticated with a valid .edu email address from your campus.
            </p>
          </div>

          <div className="glass-panel p-5 sm:p-6 md:p-8 flex flex-col items-start text-left hover:-translate-y-1 transition-transform duration-300">
            <div className="bg-blue-500/10 p-2.5 sm:p-3 rounded-2xl mb-3 sm:mb-4 md:mb-5 text-blue-600">
              <Zap size={24} strokeWidth={1.5} className="sm:w-7 sm:h-7 md:w-8 md:h-8" />
            </div>
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-primary mb-1.5 sm:mb-2">Instant Requests</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Find what you need with ⌘K search and send a request in seconds.
            </p>
          </div>

          <div className="glass-panel p-5 sm:p-6 md:p-8 flex flex-col items-start text-left hover:-translate-y-1 transition-transform duration-300">
            <div className="bg-green-500/10 p-2.5 sm:p-3 rounded-2xl mb-3 sm:mb-4 md:mb-5 text-green-600">
              <Leaf size={24} strokeWidth={1.5} className="sm:w-7 sm:h-7 md:w-8 md:h-8" />
            </div>
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-primary mb-1.5 sm:mb-2">Sustainable</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Share resources instead of buying new. Reduce campus e-waste together.
            </p>
          </div>

          <div className="glass-panel p-5 sm:p-6 md:p-8 flex flex-col items-start text-left hover:-translate-y-1 transition-transform duration-300">
            <div className="bg-purple-500/10 p-2.5 sm:p-3 rounded-2xl mb-3 sm:mb-4 md:mb-5 text-purple-600">
              <Wallet size={24} strokeWidth={1.5} className="sm:w-7 sm:h-7 md:w-8 md:h-8" />
            </div>
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-primary mb-1.5 sm:mb-2">Save Money</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Why buy a $150 calculator for one exam when you can borrow it for free?
            </p>
          </div>

        </motion.div>
      </section>

    </div>
  );
};

export default Home;
