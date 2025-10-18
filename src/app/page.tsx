'use client'
import React, { useEffect, useState, useRef } from 'react'
import ArcadeScreen from './ArcadeScreen'
import Ship from './Ship'
import Shot from './Shot'
import Enemies from './Enemies'
import BonusLevel from './Bonus'

type Enemy = { id: number; x: number; y: number; alive: boolean }

export default function HomePage() {
  const GAME_WIDTH = 400
  const GAME_HEIGHT = 320
  const SHIP_WIDTH = 32
  const SHIP_HEIGHT = 32
  const ENEMY_SIZE = 24
  const SHOT_HEIGHT = 8

  const [shipX, setShipX] = useState(Math.floor((GAME_WIDTH - SHIP_WIDTH) / 2))
  const [shipY, setShipY] = useState(
    Math.floor((GAME_HEIGHT - SHIP_HEIGHT) / 2)
  )
  const shipXRef = useRef(shipX)
  const shipYRef = useRef(shipY)
  useEffect(() => {
    shipXRef.current = shipX
  }, [shipX])
  useEffect(() => {
    shipYRef.current = shipY
  }, [shipY])
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
  const containerWidthRef = useRef<number | null>(null)
  const firingIntervalRef = useRef<number | null>(null)
  const pointerDownPosRef = useRef<{ x: number; y: number } | null>(null)

  // bonus popup state: show overlay when reaching each 1000 points
  const lastBonusLevelRef = useRef(0)
  const [showBonusPopup, setShowBonusPopup] = useState(false)
  const bonusTimerRef = useRef<number | null>(null)

  function hideBonusPopup() {
    setShowBonusPopup(false)
    if (bonusTimerRef.current) {
      clearTimeout(bonusTimerRef.current)
      bonusTimerRef.current = null
    }
  }

  useEffect(() => {
    const level = Math.floor(score / 10000)
    if (level > lastBonusLevelRef.current) {
      lastBonusLevelRef.current = level
      setShowBonusPopup(true)
      if (bonusTimerRef.current) clearTimeout(bonusTimerRef.current)
      bonusTimerRef.current = window.setTimeout(() => {
        setShowBonusPopup(false)
        bonusTimerRef.current = null
      }, 1500)
    }
  }, [score])

  useEffect(() => {
    return () => {
      if (bonusTimerRef.current) clearTimeout(bonusTimerRef.current)
    }
  }, [])

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
    }, 3)
    return () => clearInterval(interval)
  }, [shot.active])

  return (
    <main>
      <ArcadeScreen
        onMouseDown={(e) => {
          // Fire only if there is no active shot. Capture ship X at this moment.
          const startX = shipXRef.current + SHIP_WIDTH / 2
          const startY = shipYRef.current - SHOT_HEIGHT
          setShot((s) =>
            s.active ? s : { x: startX, y: startY, active: true }
          )
        }}
        hideCursor={true}
        onMouseMove={(e) => {
          // Move ship with cursor X relative to the container using actual container width
          const rect = e.currentTarget.getBoundingClientRect()
          const containerWidth = rect.width
          const containerHeight = rect.height
          containerWidthRef.current = containerWidth
          // Map pointer to game coordinates (account for possible CSS scaling)
          const relX = e.clientX - rect.left
          const relY = e.clientY - rect.top
          // scale factors
          const scaleX = containerWidth / GAME_WIDTH
          const scaleY = containerHeight / GAME_HEIGHT
          const gameX = relX / scaleX
          const gameY = relY / scaleY
          const clampedX = Math.max(
            0,
            Math.min(GAME_WIDTH - SHIP_WIDTH, gameX - SHIP_WIDTH / 2)
          )
          // prevent ship from going above vertical midpoint
          const minY = Math.floor((GAME_HEIGHT - SHIP_HEIGHT) / 2)
          const clampedY = Math.max(
            minY,
            Math.min(GAME_HEIGHT - SHIP_HEIGHT, gameY)
          )
          setShipX(clampedX)
          setShipY(clampedY)
        }}
        onPointerDown={(e) => {
          // prevent default (extra safety) and start auto-fire while finger is down
          e.preventDefault()
          const rect = e.currentTarget.getBoundingClientRect()
          pointerDownPosRef.current = {
            x: (e as React.PointerEvent<HTMLDivElement>).clientX - rect.left,
            y: (e as React.PointerEvent<HTMLDivElement>).clientY - rect.top,
          }
          // start interval to attempt firing every 200ms
          if (firingIntervalRef.current == null) {
            firingIntervalRef.current = window.setInterval(() => {
              const startX = shipXRef.current + SHIP_WIDTH / 2
              const startY = shipYRef.current - SHOT_HEIGHT
              setShot((s) =>
                s.active ? s : { x: startX, y: startY, active: true }
              )
            }, 200)
          }
        }}
        onPointerMove={(e) => {
          // pointermove uses same logic as mousemove but receives PointerEvent
          const rect = e.currentTarget.getBoundingClientRect()
          const containerWidth = rect.width
          const containerHeight = rect.height
          containerWidthRef.current = containerWidth
          const relX =
            (e as React.PointerEvent<HTMLDivElement>).clientX - rect.left
          const relY =
            (e as React.PointerEvent<HTMLDivElement>).clientY - rect.top
          const scaleX = containerWidth / GAME_WIDTH
          const scaleY = containerHeight / GAME_HEIGHT
          const gameX = relX / scaleX
          const gameY = relY / scaleY
          const clampedX = Math.max(
            0,
            Math.min(GAME_WIDTH - SHIP_WIDTH, gameX - SHIP_WIDTH / 2)
          )
          // prevent ship from going above vertical midpoint (same as mouse handler)
          const minY = Math.floor((GAME_HEIGHT - SHIP_HEIGHT) / 2)
          const clampedY = Math.max(
            minY,
            Math.min(GAME_HEIGHT - SHIP_HEIGHT, gameY)
          )
          setShipX(clampedX)
          setShipY(clampedY)
        }}
        onPointerUp={(e) => {
          // stop auto-fire
          if (firingIntervalRef.current != null) {
            clearInterval(firingIntervalRef.current)
            firingIntervalRef.current = null
          }
          pointerDownPosRef.current = null
          // fire once on pointer up to register a tap shot as well
          const startX = shipXRef.current + SHIP_WIDTH / 2
          const startY = shipYRef.current - SHOT_HEIGHT
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
            // respawn enemy after short delay at random x across container width
            setTimeout(() => {
              setEnemies((prev) =>
                prev.map((e) =>
                  e.id === id
                    ? {
                        ...e,
                        alive: true,
                        x: (() => {
                          const cw = containerWidthRef.current ?? 360
                          const min = 20
                          const max = Math.max(
                            min + ENEMY_SIZE,
                            Math.floor(cw) - 20
                          )
                          return Math.floor(Math.random() * (max - min)) + min
                        })(),
                      }
                    : e
                )
              )
            }, 10)
          }}
        />
        {/* Nave */}
        <Ship x={shipX} y={shipY} />
        {/* Tiro */}
        <Shot x={shot.x} y={shot.y} active={shot.active} />
        {/* Bonus popup */}
        {showBonusPopup ? <BonusLevel score={score} /> : null}
      </ArcadeScreen>
    </main>
  )
}
