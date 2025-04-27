import React, { useEffect, useRef, useState } from "react";
import JXG from "jsxgraph";

interface RouletteProps {
  n?: number;
  size?: number;
  coverColor: string;
}

const Roulette: React.FC<RouletteProps> = ({
  n = 12,
  size = 400,
  coverColor,
}) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [board, setBoard] = useState<JXG.Board | null>(null);
  const animationRef = useRef<number | null>(null);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (!board && boardRef.current) {
      const brd = JXG.JSXGraph.initBoard(boardRef.current, {
        boundingbox: [-size / 2, size / 2, size / 2, -size / 2],
        axis: false,
        showNavigation: false,
        zoom: false,
        showCopyright: false,
      });

      const radius = size / 2 - 10;
      const anglePerSector = (2 * Math.PI) / n;
      brd.create("circle", [[0, 0], radius], {
        strokeColor: coverColor,
        visible: true,
        strokeWidth: 8,
      });

      for (let i = 0; i < n; i++) {
        const startAngle = i * anglePerSector;
        const endAngle = startAngle + anglePerSector;

        const p2 = brd.create(
          "point",
          [radius * Math.cos(startAngle), radius * Math.sin(startAngle)],
          { visible: false }
        );
        const p3 = brd.create(
          "point",
          [radius * Math.cos(endAngle), radius * Math.sin(endAngle)],
          { visible: false }
        );

        brd.create("polygon", [[0, 0], p2, p3], {
          fillColor: i % 2 === 0 ? "#f87171" : "#60a5fa",
          fillOpacity: 0.8,
          strokeWidth: 6,
          strokeColor: "black",
        });

        const textAngle = startAngle + anglePerSector / 2;
        const textRadius = radius * 0.75;

        brd.create(
          "text",
          [
            textRadius * Math.cos(textAngle),
            textRadius * Math.sin(textAngle),
            `${i + 1}`,
          ],
          { fontSize: 16, fontWeight: "bold", fixed: true }
        );
      }

      setBoard(brd);
    }

    return () => {
      if (board) {
        // setBoard(null);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [board, n, size]);

  const spin = () => {
    if (!containerRef.current) return;

    const duration = 3000; // duración en ms (3 segundos)
    const startRotation = rotation;
    const totalRotation = 360 * 2 + Math.random() * 360; // gira 5 vueltas + ángulo aleatorio para variar

    const startTime = performance.now();

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1); // de 0 a 1

      // Función ease-out cúbica para desacelerar suavemente
      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

      const easedProgress = easeOutCubic(progress);

      const currentRotation = startRotation + totalRotation * easedProgress;

      if (containerRef.current) {
        containerRef.current.style.transform = `rotate(${currentRotation}deg)`;
      }

      setRotation(currentRotation);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
        // Aquí puedes disparar evento o callback para sector ganador
      }
      console.log(rotation);
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Contenedor rotatorio */}
      <div
        ref={containerRef}
        style={{
          width: size,
          height: size,
          transition: "transform 0.5s linear",
          willChange: "transform",
        }}
      >
        {/* JSXGraph board */}
        <div
          ref={boardRef}
          id="jxgbox"
          style={{ width: size, height: size }}
        ></div>
      </div>

      {/* Indicador fijo */}

      <button
        onClick={spin}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Girar Ruleta
      </button>
    </div>
  );
};

export default Roulette;
