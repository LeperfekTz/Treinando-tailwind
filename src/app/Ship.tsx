import React from 'react'

interface ShipProps {
  x: number
}

export default function Ship({ x }: ShipProps) {
  return (
    <div className="absolute" style={{ left: x, bottom: 0 }}>
      <img src="/images/nave.png" alt="Nave" className="w-8 h-8" />
    </div>
  )
}
