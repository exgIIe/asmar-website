"use client";

import { useEffect, useState } from "react";

interface Snowflake {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  driftX: number;
  swayAmplitude: number;
  swayDuration: number;
}

export default function Snowfall() {
  const [flakes, setFlakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    const generated: Snowflake[] = Array.from({ length: 55 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 3 + 1.5,
      duration: Math.random() * 14 + 10,
      delay: Math.random() * 20,
      opacity: Math.random() * 0.35 + 0.15,
      driftX: Math.random() * 100 - 50,
      swayAmplitude: Math.random() * 20 + 5,
      swayDuration: Math.random() * 4 + 3,
    }));
    setFlakes(generated);
  }, []);

  return (
    <div className="snowfall">
      {flakes.map((f) => (
        <div
          key={f.id}
          className="snowflake"
          style={{
            left: `${f.left}%`,
            width: `${f.size}px`,
            height: `${f.size}px`,
            opacity: f.opacity,
            animationDuration: `${f.duration}s`,
            animationDelay: `${f.delay}s`,
            filter: `blur(${f.size > 3 ? 0.5 : 0}px)`,
            "--drift-x": `${f.driftX}px`,
            "--sway-amp": `${f.swayAmplitude}px`,
            "--sway-dur": `${f.swayDuration}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
