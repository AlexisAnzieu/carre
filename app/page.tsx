"use client";

import CircularText from "./components/CircularText/CircularText";
import ShapeBlur from "./components/ShapeBlur/ShapeBlur";
import Squares from "./components/Squares/Squares";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen p-8 font-[family-name:var(--font-geist-sans)] relative">
      <ShapeBlur
        variation={0}
        shapeSize={1.5}
        roundness={0}
        borderSize={0.2}
        circleSize={0.4}
        circleEdge={0.6}
        className="absolute"
      >
        <Squares
          speed={0.6}
          squareSize={60}
          direction="down"
          borderColor="#fff"
          hoverFillColor="#222"
          className="absolute inset-0"
        />
      </ShapeBlur>
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
