import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChefHat, TrendingUp, Layers, Zap, ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>KitchenOS - Cloud Kitchen Management</title>
        <meta name="description" content="Professional operations platform for multi-brand cloud kitchens." />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <header className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-50">
          <div className="container max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-primary p-1.5 rounded-lg">
                <ChefHat className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight">KitchenOS</span>
            </div>
            <Link to="/login">
              <Button className="font-semibold">Partner Login</Button>
            </Link>
          </div>
        </header>

        <main className="flex-1">
          <section className="relative pt-24 pb-32 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background -z-10"></div>
            <div className="container max-w-7xl mx-auto px-4">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="space-y-8"
                >
                  <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 px-3 py-1 text-sm font-semibold">
                    <Zap className="h-3.5 w-3.5 mr-1" />
                    New: AI Batch Optimization
                  </Badge>
                  <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight text-balance" style={{letterSpacing: '-0.03em'}}>
                    Master the rush hour with precision.
                  </h1>
                  <p className="text-lg text-muted-foreground leading-relaxed max-w-[50ch]">
                    KitchenOS unifies Swiggy, Zomato, and Direct orders into a single, intelligent flow. Automate batching, track station loads, and reduce prep time by up to 25%.
                  </p>
                  <div className="flex items-center gap-4 pt-4">
                    <Link to="/login">
                      <Button size="lg" className="font-bold px-8 h-14 text-lg gap-2 shadow-lg shadow-primary/20">
                        Launch Dashboard
                        <ArrowRight className="h-5 w-5" />
                      </Button>
                    </Link>
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <ShieldCheck className="h-5 w-5 text-status-on-track" />
                      Partner Verified
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-3xl blur-3xl -z-10 transform translate-x-4 translate-y-4"></div>
                  <img
                    src="https://images.unsplash.com/photo-1625479280870-21ae3c0a5ef8"
                    alt="Chefs in a professional cloud kitchen"
                    className="w-full aspect-[4/3] object-cover rounded-3xl shadow-2xl border border-border/50"
                  />
                  <div className="absolute -bottom-6 -left-6 bg-card border rounded-2xl p-5 shadow-xl flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-status-on-track/10 flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-status-on-track" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Prep Time Saved</div>
                      <div className="text-2xl font-bold font-mono-nums">-18.4%</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          <section className="py-24 bg-secondary/50 border-y">
            <div className="container max-w-7xl mx-auto px-4">
              <div className="mb-16 max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Built for scale and speed</h2>
                <p className="text-lg text-muted-foreground">Everything you need to run a high-volume cloud kitchen without the chaos.</p>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="md:col-span-2 border-none shadow-md bg-card">
                  <CardHeader>
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                      <Layers className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">Real-time Order Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">View all incoming orders from all platforms in one unified queue. Automatically prioritize based on delivery deadlines, VIP status, and prep complexity.</p>
                  </CardContent>
                </Card>
                <Card className="border-none shadow-md bg-card">
                  <CardHeader>
                    <div className="h-10 w-10 rounded-lg bg-status-on-track/10 flex items-center justify-center mb-2">
                      <Zap className="h-5 w-5 text-status-on-track" />
                    </div>
                    <CardTitle className="text-xl">Batch Optimization</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">AI detects similar orders and suggests batches to cook simultaneously, drastically cutting down on overall prep time.</p>
                  </CardContent>
                </Card>
                <Card className="border-none shadow-md bg-card">
                  <CardHeader>
                    <div className="h-10 w-10 rounded-lg bg-status-normal/10 flex items-center justify-center mb-2">
                      <Clock className="h-5 w-5 text-status-normal" />
                    </div>
                    <CardTitle className="text-xl">Station Tracking</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">Monitor Hot, Grill, Assembly, and Packing stations. Identify bottlenecks before they delay deliveries.</p>
                  </CardContent>
                </Card>
                <Card className="md:col-span-2 border-none shadow-md bg-card">
                  <CardHeader>
                    <div className="h-10 w-10 rounded-lg bg-accent/50 flex items-center justify-center mb-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">Kitchen Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">Deep dive into operational metrics. Track on-time percentages, late order reasons, and brand-specific performance to continuously improve your kitchen.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </main>

        <footer className="bg-foreground text-background py-12">
          <div className="container max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8 mb-8 border-b border-white/10 pb-8">
              <div className="col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  <ChefHat className="h-6 w-6 text-primary" />
                  <span className="font-bold text-xl tracking-tight">KitchenOS</span>
                </div>
                <p className="text-background/70 max-w-sm">The professional operating system for modern, high-volume cloud kitchens.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-white">Product</h4>
                <ul className="space-y-2 text-sm text-background/70"><li>Features</li><li>Integrations</li><li>Pricing</li></ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-white">Legal</h4>
                <ul className="space-y-2 text-sm text-background/70"><li>Privacy Policy</li><li>Terms of Service</li><li>Contact</li></ul>
              </div>
            </div>
            <div className="text-sm text-background/50 flex justify-between items-center">
              <span>© 2026 KitchenOS Inc. All rights reserved.</span>
              <span>v2.4.1</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default HomePage;
