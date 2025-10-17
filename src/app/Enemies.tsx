import React, { useEffect, useState } from 'react'

interface Enemy {
  id: number
  x: number
  y: number
  alive: boolean
}

interface EnemiesProps {
  enemies: Enemy[]
  onEnemyDead?: (id: number) => void
}

export default function Enemies({ enemies, onEnemyDead }: EnemiesProps) {
  const [deadMap, setDeadMap] = useState<Record<number, boolean>>({})

  useEffect(() => {
    // when enemies prop changes, clear entries for alive enemies
    const newMap: Record<number, boolean> = { ...deadMap }
    enemies.forEach((e) => {
      if (e.alive && newMap[e.id]) delete newMap[e.id]
    })
    setDeadMap(newMap)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enemies])

  return (
    <>
      {enemies.map((enemy) => {
        if (enemy.alive) {
          return (
            <span
              key={enemy.id}
              className="absolute text-2xl"
              style={{ left: enemy.x, top: enemy.y }}
            >
              👾
            </span>
          )
        }
        // show small explosion for recently-dead enemies
        if (!deadMap[enemy.id]) {
          // mark as showing death
          setDeadMap((d) => ({ ...d, [enemy.id]: true }))
          // notify parent after timeout so it can respawn
          if (onEnemyDead) {
            setTimeout(() => onEnemyDead && onEnemyDead(enemy.id), 700)
          }
          return (
            <span
              key={enemy.id}
              className="absolute text-2xl animate-pulse opacity-90"
              style={{ left: enemy.x, top: enemy.y }}
            >
              ✨
            </span>
          )
        }
        return null
      })}
    </>
  )
}
