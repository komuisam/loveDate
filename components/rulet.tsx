import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface WheelProps {
  onSpinComplete: (result: number | null) => void;
  totalNumbers?: number;
  spinDuration?: number;
  extraRotations?: number;
  coverColor: string;
}

const Wheel: React.FC<WheelProps> = ({
  // ({ coverColor = "red" }: { coverColor: string })
  coverColor = "red",
  onSpinComplete,
  totalNumbers = 50,
  spinDuration = 5,
  extraRotations = 5,
}) => {
  const COLORS = [
    "#FFB6C1", // Light Pink - Rosado claro suave
    "#FFD1DC", // Pastel Pink - Rosado pastel
    "#FFECF1", // Soft Pink - Rosado muy suave
    "#F8C8DC", // Cherry Blossom - Flor de cerezo
    "#FF9BB3", // Watermelon Pink - Rosado melón
    "#FDCEDF", // Fairy Tale - Cuento de hadas
    "#FFDFD3", // Peach Pink - Durazno rosado
    "#F4C2C2", // Baby Pink - Rosado bebé
    "#E0BBE4", // Lavender Pink - Lavanda rosada
    "#D8BFD8", // Thistle - Cardo suave
  ];
  const radius = 230;

  const currentRotation = useRef<number>(0);
  const spinBtnRef = useRef<SVGTextElement>(null);
  const spinHear = useRef<SVGPathElement>(null);

  const numbersContainerRef = useRef<SVGGElement>(null);
  const wheelRef = useRef<SVGSVGElement>(null);

  // Create wheel numbers with fixed orientation
  const createWheelNumbers = () => {
    if (!numbersContainerRef.current) return;

    const angleStep = 360 / totalNumbers;
    const numbersContainer = numbersContainerRef.current;

    // Clear previous numbers
    while (numbersContainer.firstChild) {
      numbersContainer.removeChild(numbersContainer.firstChild);
    }

    for (let i = 0; i < totalNumbers; i++) {
      const newLine = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );
      newLine.setAttribute("stroke", COLORS[i % COLORS.length]);
      newLine.setAttribute("style", "stroke-width:4;");
      newLine.setAttribute("y2", "8%");
      newLine.setAttribute("x2", "50%");
      newLine.setAttribute("y1", "36%");
      newLine.setAttribute("x1", "50%");
      newLine.classList.add("wheel-line", "no-opacity");

      const angle = i * angleStep;
      const radian = ((angle - 90) * Math.PI) / 180;
      const x = 250 + radius * Math.cos(radian);
      const y = 250 + radius * Math.sin(radian);

      // Group for each number (with inverse rotation to maintain orientation)
      const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
      group.classList.add("number");
      group.setAttribute("data-number", (i + 1).toString());

      // Transformation for position and rotation compensation
      group.setAttribute("transform", `rotate(${angle}, 250, 250)`);

      // Background circle
      const circle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );
      circle.setAttribute("cx", "250");
      circle.setAttribute("cy", (250 - radius + 20).toString());
      circle.setAttribute("r", "13");
      circle.setAttribute("fill", COLORS[i % COLORS.length]);

      // Text (with inverse transformation to maintain orientation)
      const text = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );
      text.setAttribute("x", "250");
      text.setAttribute("y", (250 - radius + 35).toString());
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("position", "absolute");
      text.setAttribute("font-size", "14");
      text.setAttribute("font-weight", "bold");
      text.textContent = (i + 1).toString();

      // Inner group to compensate text rotation
      const textGroup = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "g"
      );
      textGroup.setAttribute(
        "transform",
        `rotate(${180}, 250, ${250 - radius + 25})`
      );
      textGroup.appendChild(text);

      group.appendChild(newLine);
      group.appendChild(circle);
      group.appendChild(textGroup);

      numbersContainer.appendChild(group);
    }
  };

  // Spin the wheel and stop with the target number at the arrow
  const spinWheel = (targetNumber: number) => {
    if (!numbersContainerRef.current || !spinBtnRef.current) return;

    // Angle per number
    const angleStep = 360 / totalNumbers;

    // Calculate current position of target number
    const currentAngle = (targetNumber - 1) * angleStep;
    const currentPosition = (currentAngle + currentRotation.current) % 360;

    // Calculate rotation needed to position the number at the arrow (180° position)
    let angleDiff = 180 - currentPosition;

    // Ensure it spins the shortest direction
    if (angleDiff < 0) angleDiff += 360;

    // Total rotation = complete turns + adjustment for correct position
    const totalRotation =
      currentRotation.current + 360 * extraRotations + angleDiff;

    // Stop any previous animation
    gsap.killTweensOf(numbersContainerRef.current);

    // Spin animation
    gsap.to(numbersContainerRef.current, {
      duration: spinDuration,
      rotation: totalRotation,
      transformOrigin: "center center",
      ease: "power2.out",
      onStart: () => {
        if (spinBtnRef.current) {
          // spinBtnRef.current.disabled = true;
          spinBtnRef.current.textContent = "Girando...";
        }
      },
      onComplete: () => {
        currentRotation.current = totalRotation;
        if (spinBtnRef.current) {
          // spinBtnRef.current.disabled = false;
        }
        showResult(targetNumber);
        if (onSpinComplete) {
          onSpinComplete(targetNumber);
        }
      },
    });
  };

  // Show the result
  const showResult = (number: number) => {
    const winningNumber = document.querySelector(
      `.number[data-number="${number}"] circle`
    );
    const winningNumberLabel = document.querySelector(
      `.number[data-number="${number}"] text`
    );
    if (!spinBtnRef.current || !spinHear.current || !winningNumber) return;

    spinBtnRef.current.textContent = number.toString();
    spinBtnRef.current.style.fontSize = "46px";

    if (!winningNumber) {
      return;
    }
    if (winningNumber) {
      gsap.to(winningNumberLabel, {
        scale: 2,
        duration: 0.5,
        yoyo: true,
        repeat: 1,
        transformOrigin: "50% 50%",
        /* translateY: -20, */
        zIndex: 4000,
      });
      gsap.to(winningNumber, {
        scale: 2,
        duration: 0.5,
        yoyo: true,
        repeat: 1,
        transformOrigin: "50% 50%",
        /*  translateY: 20, */
        zIndex: 4000,
      });
    }
  };

  // Initialization
  useEffect(() => {
    createWheelNumbers();
  }, [totalNumbers]);

  const handleSpinClick = () => {
    onSpinComplete(null);
    const randomNumber = Math.floor(Math.random() * totalNumbers) + 1;
    if (spinBtnRef.current) {
      spinBtnRef.current.textContent = "Girar Ruleta";
      spinBtnRef.current.style.fontSize = "18px";
    }
    spinWheel(randomNumber);
  };

  return (
    <div
      className="flex  flex-col relative md:aspect-[4/3]  aspect-[3/3] w-full    mx-auto rounded-lg shadow-lg "
      style={{ backgroundColor: "white", border: "solid 8px " + coverColor }}
    >
      <div className="text-center w-full">
        <h2 className="text-2xl font-bold" style={{ color: coverColor }}>
          Gira y disfruta de las Citas
        </h2>
      </div>
      <div className="flex align-middle justify-center">
        <svg
          className="w-[80%]   min-w-64 top-1/2 left-1/2 "
          id="wheel"
          viewBox="0 0 500 500"
          ref={wheelRef}
        >
          <defs>
            <radialGradient id="romanticBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffa6ec" /> {/* Rosado pastel */}
              <stop offset="70%" stopColor="#912a4d" /> {/* Rosado pastel */}
              <stop offset="100%" stopColor="#e10e56ba" />{" "}
              {/* Flor de cerezo */}
            </radialGradient>
          </defs>
          <defs id="defs13">
            <linearGradient
              id="line-gradient"
              x1="0"
              y1="0"
              x2="0"
              y2="-250"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#B9B075" offset="0%" id="stop2" />
              <stop stopColor="#F44336" offset="25%" id="stop4" />
              <stop stopColor="#9C27B0" offset="50%" id="stop6" />
              <stop stopColor="#4CAF50" offset="75%" id="stop8" />
              <stop stopColor="#2196F3" offset="100%" id="stop10" />
            </linearGradient>
          </defs>
          <line
            stroke="red"
            style={{ strokeWidth: 4, visibility: "hidden" }}
            id="line"
            y2="8%"
            x2="50%"
            y1="36%"
            x1="50%"
            className="wheel-line no-opacity"
          />

          <circle
            cx="250"
            cy="250"
            r="240"
            fill="url(#romanticBg)"
            stroke="#FF9BB3" // Rosado melón para el borde
            strokeWidth="4"
          />

          <circle
            cx="250"
            cy="250"
            r="210"
            fill="none"
            stroke="#5de2f9"
            strokeWidth="2"
          />
          <g id="numbers-container" ref={numbersContainerRef}></g>
          <polygon points="250,420 275,225 225,225" fill="#FF6EA8" />
          <polygon
            points="250,420 275,225 225,225"
            fill="none"
            stroke="#537aac"
            strokeWidth={5}
          />
          <path
            ref={spinHear}
            id="Hear"
            fill="#FF6EA8"
            stroke="#537aac"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m12 21l-8.8-8.3A5.6 5.6 0 1 1 12 6a5.6 5.6 0 1 1 8.9 6.6z"
            transform="translate(226, 400) scale(2)"
          />
          <circle
            cx="250"
            cy="250"
            r="70"
            fill="#FF6EA8"
            onClick={() => {
              handleSpinClick();
            }}
          />
          <circle
            cx="250"
            cy="250"
            r="70"
            fill="none"
            stroke="#537aac"
            onClick={() => {
              handleSpinClick();
            }}
            strokeWidth={4}
          />

          <text
            id="spin-btn"
            ref={spinBtnRef}
            onClick={() => {
              handleSpinClick();
            }}
            x="250"
            y="250"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontSize="14"
          >
            Girar Ruleta
          </text>
        </svg>
      </div>
    </div>
  );
};

export default Wheel;
