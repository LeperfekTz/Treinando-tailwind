import React from 'react'

interface Enemy {
  id: number
  x: number
  y: number
  alive: boolean
}

interface EnemiesProps {
  enemies: Enemy[]
}

export default function Enemies({ enemies }: EnemiesProps) {
  return (
    <>
      {enemies.map((enemy) =>
        enemy.alive ? (
          <span
            key={enemy.id}
            className="absolute text-2xl"
            style={{ left: enemy.x, top: enemy.y }}
          >
            👾
          </span>
        ) : null
      )}
    </>
  )
}
