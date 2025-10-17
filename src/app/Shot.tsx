import React from 'react'

interface ShotProps {
  x: number
  y: number
  active: boolean
}

export default function Shot({ x, y, active }: ShotProps) {
  if (!active) return null
  return (
    <div
      className="absolute w-1 h-8 bg-pink-400 rounded-full"
      style={{ left: x + 14, bottom: y + 16 }}
    />
  )
}
