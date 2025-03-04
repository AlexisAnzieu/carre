"use client";

import ShapeBlur from "./components/ShapeBlur/ShapeBlur";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] relative">
      <ShapeBlur
        className="absolute inset-0 -z-10"
        variation={0}
        shapeSize={1.5}
        roundness={0.3}
        borderSize={0.08}
        circleSize={0.4}
        circleEdge={0.6}
      />
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-5xl sm:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 animate-gradient-x tracking-tight">
          Carré Musique
        </h1>
        <div className="flex gap-4 items-center flex-col sm:flex-row"></div>
      </main>
    </div>
  );
}
