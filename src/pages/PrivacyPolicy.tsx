import React from 'react';
import LandingHeader from "@/components/landing/LandingHeader";
import LandingFooter from "@/components/landing/LandingFooter";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Helmet } from 'react-helmet-async';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      <Helmet>
        <title>Privacy Policy — Expentix</title>
      </Helmet>
      {/* Background Gradient Container */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-tr from-mint-green/30 via-aqua-blue/30 to-lavender-violet/30 dark:from-deep-slate dark:via-gray-900 dark:to-deep-slate" />
      
      <LandingHeader />
      <main className="relative z-10 flex-grow">
        <section className="py-24 px-4 md:px-8 w-full">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-deep-slate dark:text-gray-50 leading-tight">
                Privacy Policy
              </h1>
              <p className="mt-4 text-lg text-muted-grey-blue dark:text-muted-foreground">
                Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="bg-white/20 dark:bg-gray-900/20 border border-white/30 dark:border-gray-700/50 shadow-lg backdrop-blur-md p-6 md:p-8">
                <CardContent className="p-0 space-y-6 text-deep-slate dark:text-gray-300">
                  <p>
                    Welcome to Expentix. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us.
                  </p>
                  
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="text-lg font-semibold text-deep-slate dark:text-primary">1. What information do we collect?</AccordionTrigger>
                      <AccordionContent className="text-base">
                        We collect personal information that you voluntarily provide to us when you register on the application, express an interest in obtaining information about us or our products and services, when you participate in activities on the application or otherwise when you contact us. This includes your email address, name, and any financial data you choose to enter.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger className="text-lg font-semibold text-deep-slate dark:text-primary">2. How do we use your information?</AccordionTrigger>
                      <AccordionContent className="text-base">
                        We use personal information collected via our application for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                      <AccordionTrigger className="text-lg font-semibold text-deep-slate dark:text-primary">3. Will your information be shared with anyone?</AccordionTrigger>
                      <AccordionContent className="text-base">
                        We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. We do not sell your data to third parties.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4">
                      <AccordionTrigger className="text-lg font-semibold text-deep-slate dark:text-primary">4. How do we keep your information safe?</AccordionTrigger>
                      <AccordionContent className="text-base">
                        We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
};

export default PrivacyPolicy;