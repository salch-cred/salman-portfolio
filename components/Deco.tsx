'use client';

import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { DECOR } from './decor-art';

export default function Deco({ name }: { name: keyof typeof DECOR }) {
  const ref = useRef<HTMLDivElement>(null);
  const still = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], still ? [0, 0] : [46, -46]);
  const rotate = useTransform(scrollYProgress, [0, 1], still ? [0, 0] : [-3, 3]);
  const art = DECOR[name];

  return (
    <motion.div className="deco" ref={ref} style={{ y, rotate }} aria-hidden="true">
      <svg viewBox={art.box} dangerouslySetInnerHTML={{ __html: art.svg }} />
    </motion.div>
  );
}
