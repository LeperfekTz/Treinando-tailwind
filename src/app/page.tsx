'use client'
import React, { useEffect, useState } from 'react'
import ArcadeScreen from './ArcadeScreen'
import Ship from './Ship'
import Shot from './Shot'
import Enemies from './Enemies'

type Enemy = { id: number; x: number; y: number; alive: boolean }

export default function HomePage() {
  const [shipX, setShipX] = useState(192)
  const [shot, setShot] = useState({ y: 0, active: false })
  const [enemies, setEnemies] = useState<Enemy[]>([
    { id: 1, x: 60, y: 60, alive: true },
    { id: 2, x: 120, y: 60, alive: true },
    { id: 3, x: 180, y: 60, alive: true },
    { id: 4, x: 240, y: 60, alive: true },
    { id: 5, x: 300, y: 60, alive: true },
  ])
  const [score, setScore] = useState(0)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        setShipX((x) => Math.max(0, x - 16))
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        setShipX((x) => Math.min(400 - 32, x + 16))
      } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        // opcional: mover para cima
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        // opcional: mover para baixo
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Atirar com clique do mouse na tela do ArcadeScreen
  useEffect(() => {
    function handleClick() {
      setShot((s) => (s.active ? s : { y: 240, active: true }))
    }
    window.addEventListener('mousedown', handleClick)
    return () => window.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    if (!shot.active) return
    const interval = setInterval(() => {
      setShot((s) => {
        if (s.y < 0) return { y: 0, active: false }
        let hit = false
        setEnemies((prev) =>
          prev.map((enemy) => {
            if (
              enemy.alive &&
              Math.abs(shipX + 14 - enemy.x) < 20 &&
              Math.abs(s.y + 16 - enemy.y) < 20
            ) {
              hit = true
              setScore((sc) => sc + 100)
              return { ...enemy, alive: false }
            }
            return enemy
          })
        )
        if (hit) return { y: 0, active: false }
          return { ...s, y: s.y - 16 }
      })
    }, 30)
    return () => clearInterval(interval)
  }, [shot.active, shipX])

  return (
    <main>
      <ArcadeScreen>
        {/* Fundo animado puro CSS */}
        <div className="absolute inset-0 z-0 pointer-events-none bg-black bg-[radial-gradient(circle,white_1px,transparent_1px)] [background-size:20px_20px] animate-starfield opacity-30" />
        {/* Score */}
        <div className="absolute justify-center top-2 text-xs text-green-300 font-mono tracking-widest select-none z-10">
          SCORE: {score.toString().padStart(5, '0')}
        </div>
        {/* Enemies */}
        <Enemies enemies={enemies} />
        {/* Nave */}
        <Ship x={shipX} />
        {/* Tiro */}
        <Shot x={shipX} y={shot.y} active={shot.active} />
      </ArcadeScreen>
    </main>
  )
}
