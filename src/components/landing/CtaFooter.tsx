import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Github, Lock, Mail } from 'lucide-react';

const CtaFooter: React.FC = () => {
  return (
    <footer id="contact" className="pt-20 pb-8">
      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="p-10 rounded-3xl relative overflow-hidden shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          {/* Glowing Gradient Effect */}
          <div className="absolute inset-0 opacity-30 blur-3xl pointer-events-none">
            <div className="w-1/2 h-1/2 bg-blue-500 rounded-full absolute top-0 left-0 transform -translate-x-1/4 -translate-y-1/4" />
            <div className="w-1/2 h-1/2 bg-purple-500 rounded-full absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4" />
          </div>

          <motion.p
            className="text-2xl md:text-3xl font-light italic text-gray-800 dark:text-gray-200 mb-8 relative z-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            “It’s not about saving more — it’s about spending wisely.”
          </motion.p>

          <Link to="/signup">
            <Button size="lg" className="text-xl px-10 py-7 relative z-10 bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-500/50 transition-all">
              Start Tracking Today
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-gray-200 dark:border-gray-800 pt-8 text-center">
        <div className="flex flex-wrap justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400 mb-4">
          <a href="#" className="hover:text-blue-600 transition-colors flex items-center">
            <Lock className="h-4 w-4 mr-1" /> Privacy Policy
          </a>
          <a href="mailto:contact@homeexpense.com" className="hover:text-blue-600 transition-colors flex items-center">
            <Mail className="h-4 w-4 mr-1" /> Contact
          </a>
          <a href="https://github.com/dyad-sh" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors flex items-center">
            <Github className="h-4 w-4 mr-1" /> GitHub Repo
          </a>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-600">
          &copy; {new Date().getFullYear()} HomeExpense+. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default CtaFooter;