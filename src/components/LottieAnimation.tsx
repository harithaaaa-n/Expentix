import React from 'react';
import Lottie from 'react-lottie-player';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LottieAnimationProps {
  animationData: any;
  className?: string;
  loop?: boolean;
  play?: boolean;
  speed?: number;
}

const LottieAnimation: React.FC<LottieAnimationProps> = ({
  animationData,
  className,
  loop = true,
  play = true,
  speed = 1,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className={cn("w-full h-full", className)}
    >
      <Lottie
        loop={loop}
        play={play}
        animationData={animationData}
        speed={speed}
        style={{ width: '100%', height: '100%' }}
      />
    </motion.div>
  );
};

export default LottieAnimation;