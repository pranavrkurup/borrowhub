import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Leaf, Wallet } from 'lucide-react';

const Home = () => {
  return (
    <div className="w-full pb-24">
      
      {/* Hero Section */}
      <section className="pt-24 pb-20 px-6 max-w-4xl mx-auto text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center rounded-full border border-border bg-white px-3 py-1 text-sm font-medium text-muted-foreground mb-8 shadow-sm"
        >
          <span className="flex h-2 w-2 rounded-full bg-status-available mr-2 animate-pulse"></span>
          Over 8,000 items currently shared on campus
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight text-primary mb-6 leading-tight"
        >
          Borrow what you need. <br />
          <span className="text-accent relative whitespace-nowrap">
            Share what you have.
            <svg className="absolute w-full h-3 -bottom-1 left-0 text-accent/30" viewBox="0 0 100 10" preserveAspectRatio="none">
              <path d="M0 5 Q 50 15 100 5" fill="transparent" stroke="currentColor" strokeWidth="4" />
            </svg>
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed"
        >
          The frictionless college peer-to-peer equipment sharing platform. Access calculators, textbooks, IoT kits, and DSLR cameras directly from verified students.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Button size="lg" asChild className="text-base h-14 px-8 rounded-full">
            <Link to="/feed">Browse Inventory</Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="text-base h-14 px-8 rounded-full bg-white">
            <Link to="/register">Join as Student</Link>
          </Button>
        </motion.div>
      </section>

      {/* Bento Grid Value Props */}
      <section className="max-w-6xl mx-auto px-6 mt-10">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          
          <div className="glass-panel p-8 flex flex-col items-start text-left hover:-translate-y-1 transition-transform duration-300">
            <div className="bg-accent/10 p-3 rounded-2xl mb-5 text-accent">
              <ShieldCheck size={32} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">Verified Peers</h3>
            <p className="text-muted-foreground leading-relaxed">
              Every user is authenticated with a valid .edu email address from your campus.
            </p>
          </div>

          <div className="glass-panel p-8 flex flex-col items-start text-left hover:-translate-y-1 transition-transform duration-300">
            <div className="bg-blue-500/10 p-3 rounded-2xl mb-5 text-blue-600">
              <Zap size={32} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">Instant Requests</h3>
            <p className="text-muted-foreground leading-relaxed">
              Find what you need with ⌘K search and send a request in seconds.
            </p>
          </div>

          <div className="glass-panel p-8 flex flex-col items-start text-left hover:-translate-y-1 transition-transform duration-300">
            <div className="bg-green-500/10 p-3 rounded-2xl mb-5 text-green-600">
              <Leaf size={32} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">Sustainable</h3>
            <p className="text-muted-foreground leading-relaxed">
              Share resources instead of buying new. Reduce campus e-waste together.
            </p>
          </div>

          <div className="glass-panel p-8 flex flex-col items-start text-left hover:-translate-y-1 transition-transform duration-300">
            <div className="bg-purple-500/10 p-3 rounded-2xl mb-5 text-purple-600">
              <Wallet size={32} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">Save Money</h3>
            <p className="text-muted-foreground leading-relaxed">
              Why buy a $150 calculator for one exam when you can borrow it for free?
            </p>
          </div>

        </motion.div>
      </section>

    </div>
  );
};

export default Home;
