"use client";

import { useEffect, useRef, useState } from "react";

export default function Skier3D() {
  const [rotateY, setRotateY] = useState(-15);
  const [rotateX, setRotateX] = useState(5);
  const [glideOffset, setGlideOffset] = useState(0);
  const targetY = useRef(-15);
  const targetX = useRef(5);
  const currentY = useRef(-15);
  const currentX = useRef(5);
  const rafRef = useRef<number>(0);
  const startTime = useRef(Date.now());

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      targetY.current = -15 + x * 20;
      targetX.current = 5 - y * 8;
    };

    const animate = () => {
      currentY.current += (targetY.current - currentY.current) * 0.06;
      currentX.current += (targetX.current - currentX.current) * 0.06;
      setRotateY(currentY.current);
      setRotateX(currentX.current);

      const elapsed = (Date.now() - startTime.current) / 1000;
      const glide = Math.sin(elapsed * Math.PI / 2) * 6;
      setGlideOffset(glide);

      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="skier-container w-full flex items-center justify-center py-8">
      <div
        className="skier relative"
        style={{
          width: 180,
          height: 240,
          transform: `rotateY(${rotateY}deg) rotateX(${rotateX}deg) translateY(${glideOffset}px)`,
        }}
      >
        {/* Head */}
        <div
          className="absolute rounded-full"
          style={{
            width: 28,
            height: 28,
            top: 0,
            left: 76,
            background: "linear-gradient(135deg, #2c3e50, #34495e)",
            boxShadow: "inset -3px -2px 4px rgba(0,0,0,0.2), 2px 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          {/* Goggle band */}
          <div
            className="absolute"
            style={{
              width: 32,
              height: 8,
              top: 8,
              left: -2,
              background: "linear-gradient(90deg, #1a1a2e, #16213e)",
              borderRadius: 2,
            }}
          >
            {/* Goggles */}
            <div
              className="absolute"
              style={{
                width: 22,
                height: 7,
                top: 0,
                left: 5,
                background: "linear-gradient(135deg, #f39c12, #e67e22)",
                borderRadius: 3,
                boxShadow: "inset 0 1px 2px rgba(255,255,255,0.3)",
              }}
            />
          </div>
        </div>

        {/* Neck */}
        <div
          className="absolute"
          style={{
            width: 10,
            height: 8,
            top: 26,
            left: 85,
            background: "#2c3e50",
          }}
        />

        {/* Torso */}
        <div
          className="absolute"
          style={{
            width: 36,
            height: 50,
            top: 32,
            left: 68,
            background: "linear-gradient(160deg, #e74c3c, #c0392b)",
            borderRadius: "6px 6px 4px 4px",
            transform: "rotate(-8deg)",
            transformOrigin: "top center",
            boxShadow: "inset -4px 0 8px rgba(0,0,0,0.15), 3px 3px 10px rgba(0,0,0,0.12)",
          }}
        >
          <div
            className="absolute"
            style={{
              width: 2,
              height: 40,
              top: 5,
              left: 17,
              background: "rgba(255,255,255,0.1)",
              borderRadius: 1,
            }}
          />
        </div>

        {/* Left arm */}
        <div
          className="absolute"
          style={{
            width: 8,
            height: 40,
            top: 38,
            left: 58,
            background: "linear-gradient(180deg, #e74c3c, #c0392b)",
            borderRadius: 4,
            transform: "rotate(35deg)",
            transformOrigin: "top center",
            boxShadow: "1px 2px 4px rgba(0,0,0,0.1)",
          }}
        />
        {/* Left pole */}
        <div
          className="absolute"
          style={{
            width: 2,
            height: 55,
            top: 55,
            left: 48,
            background: "linear-gradient(180deg, #95a5a6, #7f8c8d)",
            transform: "rotate(35deg)",
            transformOrigin: "top center",
            borderRadius: 1,
          }}
        />
        <div
          className="absolute"
          style={{
            width: 8,
            height: 3,
            top: 98,
            left: 38,
            background: "#7f8c8d",
            borderRadius: "50%",
            transform: "rotate(35deg)",
          }}
        />

        {/* Right arm */}
        <div
          className="absolute"
          style={{
            width: 8,
            height: 40,
            top: 38,
            left: 106,
            background: "linear-gradient(180deg, #e74c3c, #c0392b)",
            borderRadius: 4,
            transform: "rotate(-25deg)",
            transformOrigin: "top center",
            boxShadow: "1px 2px 4px rgba(0,0,0,0.1)",
          }}
        />
        {/* Right pole */}
        <div
          className="absolute"
          style={{
            width: 2,
            height: 55,
            top: 55,
            left: 118,
            background: "linear-gradient(180deg, #95a5a6, #7f8c8d)",
            transform: "rotate(-25deg)",
            transformOrigin: "top center",
            borderRadius: 1,
          }}
        />
        <div
          className="absolute"
          style={{
            width: 8,
            height: 3,
            top: 98,
            left: 126,
            background: "#7f8c8d",
            borderRadius: "50%",
            transform: "rotate(-25deg)",
          }}
        />

        {/* Left leg */}
        <div
          className="absolute"
          style={{
            width: 12,
            height: 48,
            top: 78,
            left: 72,
            background: "linear-gradient(180deg, #2c3e50, #1a252f)",
            borderRadius: "4px 4px 3px 3px",
            transform: "rotate(5deg)",
            boxShadow: "inset -2px 0 4px rgba(0,0,0,0.2)",
          }}
        />
        {/* Right leg */}
        <div
          className="absolute"
          style={{
            width: 12,
            height: 48,
            top: 78,
            left: 92,
            background: "linear-gradient(180deg, #34495e, #2c3e50)",
            borderRadius: "4px 4px 3px 3px",
            transform: "rotate(-3deg)",
            boxShadow: "inset -2px 0 4px rgba(0,0,0,0.15)",
          }}
        />

        {/* Left boot */}
        <div
          className="absolute"
          style={{
            width: 16,
            height: 12,
            top: 122,
            left: 68,
            background: "linear-gradient(135deg, #1a1a2e, #0f0f1a)",
            borderRadius: "3px 3px 2px 6px",
            boxShadow: "1px 2px 4px rgba(0,0,0,0.2)",
          }}
        />
        {/* Right boot */}
        <div
          className="absolute"
          style={{
            width: 16,
            height: 12,
            top: 122,
            left: 90,
            background: "linear-gradient(135deg, #1a1a2e, #0f0f1a)",
            borderRadius: "3px 3px 6px 2px",
            boxShadow: "1px 2px 4px rgba(0,0,0,0.2)",
          }}
        />

        {/* Left ski */}
        <div
          className="absolute"
          style={{
            width: 110,
            height: 5,
            top: 134,
            left: 30,
            background: "linear-gradient(90deg, #ecf0f1, #bdc3c7, #ecf0f1, #bdc3c7, #ecf0f1)",
            borderRadius: "20px 2px 2px 20px",
            boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
            transform: "rotate(-2deg)",
          }}
        >
          <div
            className="absolute"
            style={{
              width: 12,
              height: 5,
              top: -2,
              left: -6,
              background: "linear-gradient(90deg, #95a5a6, #bdc3c7)",
              borderRadius: "8px 0 0 8px",
              transform: "rotate(-15deg)",
            }}
          />
          <div
            className="absolute"
            style={{
              width: 14,
              height: 8,
              top: -5,
              left: 38,
              background: "linear-gradient(135deg, #e74c3c, #c0392b)",
              borderRadius: 2,
              boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
            }}
          />
        </div>

        {/* Right ski */}
        <div
          className="absolute"
          style={{
            width: 110,
            height: 5,
            top: 134,
            left: 50,
            background: "linear-gradient(90deg, #ecf0f1, #bdc3c7, #ecf0f1, #bdc3c7, #ecf0f1)",
            borderRadius: "2px 20px 20px 2px",
            boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
            transform: "rotate(-2deg)",
          }}
        >
          <div
            className="absolute"
            style={{
              width: 12,
              height: 5,
              top: -2,
              right: -6,
              background: "linear-gradient(90deg, #bdc3c7, #95a5a6)",
              borderRadius: "0 8px 8px 0",
              transform: "rotate(15deg)",
            }}
          />
          <div
            className="absolute"
            style={{
              width: 14,
              height: 8,
              top: -5,
              left: 48,
              background: "linear-gradient(135deg, #e74c3c, #c0392b)",
              borderRadius: 2,
              boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
            }}
          />
        </div>

        {/* Snow spray */}
        <div
          className="absolute"
          style={{
            width: 40,
            height: 12,
            top: 138,
            left: 20,
            background: "radial-gradient(ellipse, rgba(255,255,255,0.6), transparent)",
            borderRadius: "50%",
            filter: "blur(3px)",
          }}
        />
        <div
          className="absolute"
          style={{
            width: 30,
            height: 8,
            top: 140,
            left: 110,
            background: "radial-gradient(ellipse, rgba(255,255,255,0.4), transparent)",
            borderRadius: "50%",
            filter: "blur(4px)",
          }}
        />
      </div>
    </div>
  );
}
