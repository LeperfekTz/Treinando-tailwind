'use client'
import React, { useEffect, useState, useRef } from 'react'
import ArcadeScreen from './ArcadeScreen'
import Ship from './Ship'
import Shot from './Shot'
import Enemies from './Enemies'

type Enemy = { id: number; x: number; y: number; alive: boolean }

export default function HomePage() {
  const GAME_WIDTH = 400
  const GAME_HEIGHT = 320
  const SHIP_WIDTH = 32
  const SHIP_HEIGHT = 32
  const ENEMY_SIZE = 24
  const SHOT_HEIGHT = 8

  const [shipX, setShipX] = useState(Math.floor((GAME_WIDTH - SHIP_WIDTH) / 2))
  const shipXRef = useRef(shipX)
  useEffect(() => {
    shipXRef.current = shipX
  }, [shipX])
  const [shot, setShot] = useState<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  })
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

  // Mouse clicks are handled on the ArcadeScreen container (see JSX below)

  useEffect(() => {
    if (!shot.active) return
    const interval = setInterval(() => {
      setShot((s) => {
        // if shot goes past the top, deactivate
        if (s.y < -SHOT_HEIGHT) return { x: 0, y: 0, active: false }
        let hit = false
        setEnemies((prev) =>
          prev.map((enemy) => {
            if (enemy.alive) {
              const enemyCenterX = enemy.x + ENEMY_SIZE / 2
              const enemyCenterY = enemy.y + ENEMY_SIZE / 2
              const shotCenterX = s.x
              const shotCenterY = s.y + SHOT_HEIGHT / 2
              if (
                Math.abs(shotCenterX - enemyCenterX) < 18 &&
                Math.abs(shotCenterY - enemyCenterY) < 18
              ) {
                hit = true
                setScore((sc) => sc + 100)
                return { ...enemy, alive: false }
              }
            }
            return enemy
          })
        )
        if (hit) return { x: 0, y: 0, active: false }
        return { ...s, y: s.y - 6 }
      })
    }, 30)
    return () => clearInterval(interval)
  }, [shot.active])

  return (
    <main>
      <ArcadeScreen
        onMouseDown={(e) => {
          // Fire only if there is no active shot. Capture ship X at this moment.
          const startX = shipXRef.current + SHIP_WIDTH / 2
          const startY = GAME_HEIGHT - SHIP_HEIGHT - SHOT_HEIGHT
          setShot((s) =>
            s.active ? s : { x: startX, y: startY, active: true }
          )
        }}
      >
        {/* Fundo animado puro CSS */}
        <div className="absolute inset-0 z-0 pointer-events-none bg-black bg-[radial-gradient(circle,white_1px,transparent_1px)] [background-size:20px_20px] animate-starfield opacity-30" />
        {/* Score */}
        <div className="absolute justify-center top-2 text-xs text-green-300 font-mono tracking-widest select-none z-10">
          SCORE: {score.toString().padStart(5, '0')}
        </div>
        {/* Enemies */}
        <Enemies
          enemies={enemies}
          onEnemyDead={(id) => {
            // respawn enemy after short delay at random x
            setTimeout(() => {
              setEnemies((prev) =>
                prev.map((e) =>
                  e.id === id
                    ? {
                        ...e,
                        alive: true,
                        x: Math.floor(Math.random() * (360 - 40)) + 20,
                      }
                    : e
                )
              )
            }, 1000)
          }}
        />
        {/* Nave */}
        <Ship x={shipX} />
        {/* Tiro */}
        <Shot x={shot.x} y={shot.y} active={shot.active} />
      </ArcadeScreen>
    </main>
  )
}
