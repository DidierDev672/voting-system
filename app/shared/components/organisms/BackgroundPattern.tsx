"use client";

interface BackgroundPatternProps {
  children: React.ReactNode;
}

export function BackgroundPattern({ children }: BackgroundPatternProps) {
  return (
    <div className="min-h-screen relative overflow-hidden bg-[#faf8f5]">
      {/* Iconos de fondo - política y literatura */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        {/* Fila 1 */}
        <div className="absolute top-8 left-[5%] text-6xl select-none">📜</div>
        <div className="absolute top-16 left-[25%] text-4xl select-none">⚖️</div>
        <div className="absolute top-8 left-[45%] text-5xl select-none">📋</div>
        <div className="absolute top-20 left-[65%] text-4xl select-none">🏛️</div>
        <div className="absolute top-12 left-[85%] text-6xl select-none">📚</div>

        {/* Fila 2 */}
        <div className="absolute top-[20%] left-[10%] text-5xl select-none">🗳️</div>
        <div className="absolute top-[25%] left-[35%] text-4xl select-none">📖</div>
        <div className="absolute top-[18%] left-[55%] text-6xl select-none">✍️</div>
        <div className="absolute top-[28%] left-[75%] text-5xl select-none">🎯</div>
        <div className="absolute top-[22%] left-[92%] text-4xl select-none">📎</div>

        {/* Fila 3 */}
        <div className="absolute top-[35%] left-[8%] text-5xl select-none">📝</div>
        <div className="absolute top-[40%] left-[28%] text-6xl select-none">🏛️</div>
        <div className="absolute top-[38%] left-[48%] text-4xl select-none">⚖️</div>
        <div className="absolute top-[42%] left-[68%] text-5xl select-none">🗒️</div>
        <div className="absolute top-[36%] left-[88%] text-6xl select-none">📜</div>

        {/* Fila 4 */}
        <div className="absolute top-[50%] left-[3%] text-4xl select-none">💼</div>
        <div className="absolute top-[55%] left-[23%] text-5xl select-none">📋</div>
        <div className="absolute top-[52%] left-[43%] text-6xl select-none">🎓</div>
        <div className="absolute top-[58%] left-[63%] text-4xl select-none">📌</div>
        <div className="absolute top-[54%] left-[83%] text-5xl select-none">🗂️</div>

        {/* Fila 5 */}
        <div className="absolute top-[65%] left-[7%] text-5xl select-none">⚖️</div>
        <div className="absolute top-[70%] left-[27%] text-6xl select-none">📚</div>
        <div className="absolute top-[68%] left-[47%] text-4xl select-none">✒️</div>
        <div className="absolute top-[72%] left-[67%] text-5xl select-none">📜</div>
        <div className="absolute top-[66%] left-[87%] text-6xl select-none">🏛️</div>

        {/* Fila 6 */}
        <div className="absolute top-[80%] left-[5%] text-4xl select-none">🗳️</div>
        <div className="absolute top-[85%] left-[25%] text-5xl select-none">📝</div>
        <div className="absolute top-[82%] left-[45%] text-6xl select-none">📋</div>
        <div className="absolute top-[88%] left-[65%] text-4xl select-none">⚖️</div>
        <div className="absolute top-[84%] left-[85%] text-5xl select-none">📚</div>

        {/* Fila 7 */}
        <div className="absolute top-[92%] left-[10%] text-5xl select-none">✍️</div>
        <div className="absolute top-[96%] left-[30%] text-4xl select-none">🏛️</div>
        <div className="absolute top-[94%] left-[50%] text-6xl select-none">📜</div>
        <div className="absolute top-[98%] left-[70%] text-5xl select-none">🗒️</div>
        <div className="absolute top-[95%] left-[90%] text-4xl select-none">⚖️</div>
      </div>

      {/* Capa de ruido sutil para textura */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZmlsdGVyIGlkPSJnoiPjxmZVR1cmJ1bGVuY2UgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlbmN5PSIwLjYiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjZykiIG9wYWNpdHk9IjAuNSIvPjwvc3ZnPg==')]"></div>

      {/* Gradiente suave para profundidad */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#faf8f5]/80 via-transparent to-[#faf8f5]/80"></div>

      {/* Contenido */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
