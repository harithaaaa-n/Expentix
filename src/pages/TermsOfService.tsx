import React from 'react';
import LandingHeader from "@/components/landing/LandingHeader";
import LandingFooter from "@/components/landing/LandingFooter";
import { motion } from "framer-motion";
import { Card, CardContent } from '@/components/ui/card';
import { 
  FileText, 
  Users, 
  CheckCircle, 
  KeyRound, 
  BarChart3, 
  ShieldCheck, 
  Settings, 
  Copyright, 
  MessageSquare, 
  Scale, 
  BrainCircuit, 
  CalendarOff, 
  RefreshCw 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const Section: React.FC<{ icon: React.ElementType, title: string, children: React.ReactNode, delay: number }> = ({ icon: Icon, title, children, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.7, delay }}
    className="space-y-3"
  >
    <h2 className="flex items-center text-2xl font-bold text-deep-slate dark:text-primary">
      <Icon className="h-6 w-6 mr-3 text-sky-blue" />
      {title}
    </h2>
    <div className="prose prose-lg text-muted-grey-blue dark:text-gray-300 max-w-none">
      {children}
    </div>
  </motion.div>
);

const TermsOfService = () => {
  const effectiveDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      <Helmet>
        <title>Terms of Service — Expentix</title>
      </Helmet>
      {/* Background Gradient Container */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-[#E0F7FA] via-[#E3F2FD] to-[#EDE7F6] dark:from-deep-slate dark:via-gray-900 dark:to-deep-slate" />
      
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
                Terms of Service
              </h1>
              <p className="mt-4 text-lg text-muted-grey-blue dark:text-muted-foreground">
                Effective Date: {effectiveDate}
              </p>
            </motion.div>

            <Card className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-md rounded-2xl shadow-lg p-6 md:p-10">
              <CardContent className="p-0 space-y-10">
                <Section icon={FileText} title="1. Introduction" delay={0.2}>
                  <p>Welcome to Expentix — a mindful expense tracker and lifestyle insight platform. By using our website, mobile application, or any related service, you agree to these Terms of Service (“Terms”).</p>
                  <p>These Terms govern your use of Expentix and ensure transparency between you (“User”) and us (“Expentix Team”).</p>
                  <p>Please read them carefully — by accessing or using Expentix, you agree to comply with these terms in full.</p>
                </Section>

                <Section icon={Users} title="2. Who We Are" delay={0.3}>
                  <p>Expentix (“we,” “our,” or “us”) is a digital platform designed to help users track, analyze, and understand their spending habits.</p>
                  <p>Our mission is simple: to help people spend smarter, live better, and feel more connected to their financial choices.</p>
                </Section>

                <Section icon={CheckCircle} title="3. Eligibility" delay={0.4}>
                  <p>You must be at least 13 years old to use Expentix.</p>
                  <p>By creating an account, you confirm that the information you provide is accurate and that you are authorized to use the platform.</p>
                  <p>If you use Expentix on behalf of a family or group, you agree to ensure all shared users follow these Terms.</p>
                </Section>

                <Section icon={KeyRound} title="4. Account Creation & Security" delay={0.5}>
                  <p>You are responsible for maintaining the confidentiality of your account credentials.</p>
                  <p>You agree to notify us immediately if you suspect unauthorized use of your account.</p>
                  <p>Expentix is not liable for losses arising from compromised credentials unless due to system faults.</p>
                  <div className="bg-sky-blue/10 border-l-4 border-sky-blue text-sky-blue-800 dark:text-sky-blue-200 p-4 rounded-r-lg">
                    <span className="font-bold">💬 Pro Tip:</span> Use a strong password and enable 2FA where available.
                  </div>
                </Section>

                <Section icon={BarChart3} title="5. How Expentix Works" delay={0.6}>
                  <ul className="list-none p-0 space-y-2">
                    <li>🧾 Add, track, and categorize expenses</li>
                    <li>📈 View analytical insights and lifestyle reports</li>
                    <li>👨‍👩‍👧 Collaborate with family or partners</li>
                    <li>🎯 Set goals and monitor mindful spending</li>
                  </ul>
                  <p>We focus on clarity, design, and simplicity — Expentix does not handle direct financial transactions or payments.</p>
                </Section>

                <Section icon={ShieldCheck} title="6. Data Privacy" delay={0.7}>
                  <p>Your privacy matters deeply to us.</p>
                  <p>Our data collection and usage are governed by our <Link to="/privacy" className="text-sky-blue hover:underline">Privacy Policy</Link>, which outlines how we store and protect your data securely.</p>
                  <div className="bg-mint-green/10 border-l-4 border-mint-green text-green-800 dark:text-green-200 p-4 rounded-r-lg">
                    <span className="font-bold">💚 We never sell or share your data without consent.</span>
                  </div>
                </Section>

                <Section icon={Settings} title="7. Acceptable Use" delay={0.8}>
                  <p>By using Expentix, you agree not to:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Upload false or misleading data</li>
                    <li>Use the platform for illegal or harmful activities</li>
                    <li>Attempt to hack, reverse engineer, or misuse system access</li>
                    <li>Interfere with service availability or security</li>
                  </ul>
                  <p>Violations may lead to suspension or permanent account termination.</p>
                </Section>

                <Section icon={Copyright} title="8. Intellectual Property" delay={0.9}>
                  <p>All content, UI designs, and trademarks under Expentix are the property of the Expentix team.</p>
                  <p>You may not copy, modify, or redistribute them without permission.</p>
                  <p>You own the data you input (expenses, notes, etc.), but Expentix retains rights to platform analytics and design IP.</p>
                </Section>

                <Section icon={MessageSquare} title="9. User-Generated Content" delay={1.0}>
                  <p>You may add personal notes, expense categories, and reports for your use.</p>
                  <p>You are responsible for ensuring that your uploaded content complies with laws and does not infringe on others’ rights.</p>
                  <p>We reserve the right to remove inappropriate or harmful content.</p>
                </Section>

                <Section icon={Scale} title="10. Limitation of Liability" delay={1.1}>
                  <p>Expentix is built for personal lifestyle management, not professional financial advice.</p>
                  <p>We are not responsible for:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Any loss caused by incorrect data entry or interpretation.</li>
                    <li>Technical interruptions due to maintenance or updates.</li>
                  </ul>
                  <p>However, we strive to maintain reliability, transparency, and uptime to ensure the best user experience possible.</p>
                </Section>

                <Section icon={BrainCircuit} title="11. Service Changes" delay={1.2}>
                  <p>Expentix may update or improve features over time.</p>
                  <p>Some new features may require additional permissions or updated terms.</p>
                  <p>Users will be notified of major changes via email or in-app notice.</p>
                </Section>

                <Section icon={CalendarOff} title="12. Termination" delay={1.3}>
                  <p>You may delete your account at any time from within the app.</p>
                  <p>We may suspend or terminate access if you violate these Terms or misuse the platform.</p>
                  <p>Upon termination, your stored data will be permanently deleted after a short retention window (see Privacy Policy).</p>
                </Section>

                <Section icon={RefreshCw} title="13. Updates to These Terms" delay={1.4}>
                  <p>Expentix reserves the right to update or modify these Terms periodically.</p>
                  <p>The “Last Updated” date will always appear at the top of this page.</p>
                  <p>Continued use after any update implies acceptance of the revised terms.</p>
                </Section>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
};

export default TermsOfService;