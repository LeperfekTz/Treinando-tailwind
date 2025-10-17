export default function BonusLevel({ score }: { score: number }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80">
      <div className="p-4 bg-gray-800 rounded-lg">
        <h2 className="text-lg font-bold text-green-300">Bonus Level!</h2>
        <p className="text-sm text-gray-400">Score: {score}</p>
      </div>
    </div>

  )
}
