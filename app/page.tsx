"use client";

import CircularText from "./components/CircularText/CircularText";
import ShapeBlur from "./components/ShapeBlur/ShapeBlur";
import SplashCursor from "./components/SplashCursor/SplashCursor";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen p-8 font-[family-name:var(--font-geist-sans)] relative">
      <SplashCursor />

      <ShapeBlur
        className="absolute inset-0 -z-10"
        variation={0}
        shapeSize={1.5}
        roundness={0.3}
        borderSize={0.08}
        circleSize={0.4}
        circleEdge={0.6}
      />
      <main className="flex items-center justify-center">
        <CircularText
          text="CARRE MUSIQUE "
          onHover="goBonkers"
          spinDuration={20}
        />
      </main>
    </div>
  );
}
