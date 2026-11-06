'use client';

import { useEffect, useRef } from 'react';

export default function FooterMark({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current!;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add('in');
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <p className="foot-mark" ref={ref} aria-label={text}>
      {text.split('').map((ch, i) => (
        <span key={i} aria-hidden="true" style={{ '--i': i } as React.CSSProperties}>
          {ch === ' ' ? ' ' : ch}
        </span>
      ))}
    </p>
  );
}
