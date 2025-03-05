"use client";

import { useState } from "react";
import CircularText from "./components/CircularText/CircularText";
import ShapeBlur from "./components/ShapeBlur/ShapeBlur";
import Squares from "./components/Squares/Squares";
import EmailSubscription from "./components/EmailSubscription/EmailSubscription";

export default function Home() {
  const [showEmailModal, setShowEmailModal] = useState(false);

  const handleCircleClick = () => {
    setShowEmailModal(true);
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-8 font-[family-name:var(--font-geist-sans)] relative overflow-hidden">
      <ShapeBlur
        variation={0}
        shapeSize={1.5}
        roundness={0}
        borderSize={0.2}
        circleSize={0.4}
        circleEdge={0.6}
        className="absolute inset-0"
      >
        <Squares
          speed={0.6}
          squareSize={60}
          direction="down"
          borderColor="#000"
          hoverFillColor="#000"
          className="absolute inset-0"
        />
      </ShapeBlur>
      <div className="relative">
        <main className="flex items-center justify-center">
          <div className="relative">
            <CircularText
              text="CARRE MUSIQUE "
              spinDuration={20}
              onClick={handleCircleClick}
            />
            <CircularText
              text="CLIQUE ICI "
              onHover="goBonkers"
              onClick={handleCircleClick}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-[0.4]"
            />
          </div>
        </main>
        {showEmailModal && (
          <EmailSubscription
            isOpen={showEmailModal}
            onClose={() => {
              setShowEmailModal(false);
            }}
          />
        )}
      </div>
    </div>
  );
}
