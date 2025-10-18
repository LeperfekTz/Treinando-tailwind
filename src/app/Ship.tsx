import React from 'react'

interface ShipProps {
  x: number
  y?: number
}

export default function Ship({ x, y = 0 }: ShipProps) {
  return (
    <div className="absolute" style={{ left: x, top: y }}>
      <img src="/images/nave.png" alt="Nave" className="w-8 h-8" />
    </div>
  )
}
