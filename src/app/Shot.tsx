import React from 'react'

interface ShotProps {
  x: number
  y: number
  active: boolean
}

export default function Shot({ x, y, active }: ShotProps) {
  if (!active) return null
  // Render shot using top/left so y is distance from the top of the game area
  return (
    <div
      className="absolute w-1 h-8 bg-pink-400 rounded-full"
      style={{ left: x, top: y, transform: 'translateX(-50%)' }}
    />
  )
}
