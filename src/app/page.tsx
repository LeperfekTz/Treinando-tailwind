export default function HomePage() {
  const colors = [
    { name: 'slate', class: 'bg-slate-500 text-white' },
    { name: 'gray', class: 'bg-gray-500 text-white' },
    { name: 'zinc', class: 'bg-zinc-500 text-white' },
    { name: 'neutral', class: 'bg-neutral-500 text-white' },
    { name: 'stone', class: 'bg-stone-500 text-white' },
    { name: 'red', class: 'bg-red-500 text-white' },
    { name: 'orange', class: 'bg-orange-500 text-white' },
    { name: 'amber', class: 'bg-amber-500 text-black' },
    { name: 'yellow', class: 'bg-yellow-500 text-black' },
    { name: 'lime', class: 'bg-lime-500 text-black' },
    { name: 'green', class: 'bg-green-500 text-white' },
    { name: 'emerald', class: 'bg-emerald-500 text-white' },
    { name: 'teal', class: 'bg-teal-500 text-white' },
    { name: 'cyan', class: 'bg-cyan-500 text-black' },
    { name: 'sky', class: 'bg-sky-500 text-white' },
    { name: 'blue', class: 'bg-blue-500 text-white' },
    { name: 'indigo', class: 'bg-indigo-500 text-white' },
    { name: 'violet', class: 'bg-violet-500 text-white' },
    { name: 'purple', class: 'bg-purple-500 text-white' },
    { name: 'fuchsia', class: 'bg-fuchsia-500 text-white' },
    { name: 'pink', class: 'bg-pink-500 text-white' },
    { name: 'rose', class: 'bg-rose-500 text-white' },
  ]

  return (
    <main>
      <header>
        <h1 className="text-3xl mb-5 rounded-[5px] w-120 h-10 mx-auto my-auto text-center justify-center items-center flex font-bold text-black font-serif bg-emerald-700">
          Bem-vindo ao meu site!
        </h1>
      </header>
      <div className="space-y-4">
        <div className="bg-blue-500 rounded-2xl w-120 h-10 mx-auto text-center justify-center items-center flex text-black lg:bg-green-500">
          {/* abaixo de 1024px fica azul */}
          Essa parte fica azul em telas menores que 1024px
        </div>
        <div className="bg-red-500 rounded-2xl w-120 h-10 mx-auto text-center justify-center items-center flex text-black md:bg-green-500">
          {/* abaixo de 768px fica vermelho */}
          Essa parte fica vermelha em telas menores que 768px
        </div>
        <div className="bg-yellow-500 rounded-2xl w-120 h-10 mx-auto text-center justify-center items-center flex text-black sm:bg-green-500">
          {/* abaixo de 640px fica amarelo */}
          Essa parte fica amarela em telas menores que 640px
        </div>
      </div>

      <h1 className="text-3xl mt-3 bg-red-500 w-120 h-10 mx-auto rounded-[10px] justify-center items-center flex text-black font-bold font-serif">
        Cores com Tailwind CSS
      </h1>
      <section className="mt-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {colors.map((c) => (
            <div key={c.name} className="rounded shadow">
              <div className={`${c.class} p-4 rounded-t`}>
                <div className="font-semibold capitalize">{c.name}-500</div>
              </div>
              <div className="p-2 bg-gray-100 text-sm text-gray-600">
                {/* mostra a classe usada para referência */}
                <code className="font-mono">{`bg-${c.name}-500`}</code>
              </div>
            </div>
          ))}
        </div>
      </section>
      <div className="grid grid-cols-[repeat(3,1fr)] grid-rows-[repeat(3,1fr)] gap-y-[10px] gap-x-[10px]">
        <div className="row-start-1 text-red-500 row-end-2 col-start-1 col-end-2 bg-gray-500 flex items-center justify-center rounded">
          1
        </div>
        <div className="row-start-2  text-blue-500 row-end-3 col-start-1 col-end-2 bg-gray-500 flex items-center justify-center rounded">
          2
        </div>
        <div className="row-start-2  text-sky-900 row-end-3 col-start-2 col-end-3 bg-gray-500 flex items-center justify-center rounded">
          3
        </div>
        <div className="row-start-3  text-zinc-900 row-end-4 col-start-1 col-end-2 bg-gray-500 flex items-center justify-center rounded">
          4
        </div>
      </div>
      <div className="grid grid-cols-[repeat(3,1fr)] grid-rows-[repeat(3,1fr)] gap-y-[10px] gap-x-[10px]">
        <div className="row-start-1 row-end-2 col-start-1 col-end-2">1</div>
        <div className="row-start-2 row-end-3 col-start-1 col-end-2">2</div>
        <div className="row-start-2 row-end-3 col-start-2 col-end-3">3</div>
        <div className="row-start-3 row-end-4 col-start-1 col-end-2">4</div>
      </div>
    </main>
  )
}
