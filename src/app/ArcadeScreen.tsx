import React from 'react'

export default function ArcadeScreen({
  children,
  onMouseDown,
  onMouseMove,
  hideCursor,
}: {
  children: React.ReactNode
  onMouseDown?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  onMouseMove?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  hideCursor?: boolean
}) {
  return (
    <div
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      className={`mx-auto mt-10 mb-16 w-200 h-110 bg-gradient-to-b from-gray-900 to-black border-[12px] border-pink-400 rounded-3xl shadow-2xl flex flex-col items-center relative overflow-hidden ${
        hideCursor ? 'cursor-none' : ''
      }`}
      tabIndex={0}
    >
      {/* Luzes arcade */}
      <div className="absolute left-4 top-4 w-4 h-4 bg-green-400 rounded-full shadow-lg animate-pulse" />
      <div className="absolute right-4 top-4 w-4 h-4 bg-yellow-300 rounded-full shadow-lg animate-pulse" />
      {/* Score (será controlado pelo componente pai) */}
      {children}
      {/* Scanlines efeito retrô */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="h-full w-full bg-[repeating-linear-gradient(180deg,transparent,transparent_6px,rgba(0,0,0,0.2)_8px)]" />
      </div>
    </div>
  )
}
