import type { PartnershipDiagram as Diagram, StackDiagram, WorkloadDiagram } from './data';

// Signature diagram for a partnership page. Built from the page's own copy as
// semantic HTML (a list or a table), so it reads correctly without visuals.

function DiagramFrame({ id, title, description, children }: { id: string; title: string; description: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
      <div className="border-b border-zinc-800 px-5 py-6 sm:px-8 sm:py-8">
        <h2 id={id} className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
          {title}
        </h2>
        <p className="mt-2 max-w-[65ch] text-sm sm:text-base leading-relaxed text-neutral-400">{description}</p>
      </div>
      {children}
    </section>
  );
}

function Stack({ diagram }: { diagram: StackDiagram }) {
  return (
    <DiagramFrame id="partnership-diagram" title={diagram.title} description={diagram.description}>
      <ol className="divide-y divide-zinc-800">
        {diagram.layers.map((layer) => (
          <li key={layer.owner} className="grid gap-4 px-5 py-6 sm:px-8 lg:grid-cols-12 lg:items-center lg:gap-8">
            <div className="lg:col-span-3">
              <p className={`text-base sm:text-lg font-semibold ${layer.highlight ? 'text-[#5B9BFF]' : 'text-white'}`}>
                {layer.owner}
              </p>
              <p className="mt-0.5 text-sm text-neutral-500">{layer.role}</p>
            </div>
            <ul className="flex flex-wrap gap-2 lg:col-span-9">
              {layer.items.map((item) => (
                <li
                  key={item}
                  className={`rounded-md border px-3 py-1.5 text-sm ${
                    layer.highlight
                      ? 'border-[#0A5BDF]/50 bg-[#0A5BDF]/10 text-neutral-100'
                      : 'border-zinc-800 bg-zinc-950 text-neutral-300'
                  }`}
                >
                  {item}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </DiagramFrame>
  );
}

function Workload({ diagram }: { diagram: WorkloadDiagram }) {
  return (
    <DiagramFrame id="partnership-diagram" title={diagram.title} description={diagram.description}>
      <div>
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-zinc-800 text-sm text-neutral-500">
              <th scope="col" className="px-5 py-3 font-medium sm:px-8">Task</th>
              {diagram.engines.map((engine) => (
                <th key={engine} scope="col" className="w-12 px-1 py-3 text-center font-medium sm:w-24 sm:px-2">
                  {engine}
                </th>
              ))}
              <th scope="col" className="hidden w-40 px-5 py-3 font-medium sm:table-cell sm:px-8">
                <span className="sr-only">Note</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {diagram.rows.map((row) => (
              <tr key={row.task}>
                <th scope="row" className="px-5 py-5 text-sm sm:text-base font-medium text-white sm:px-8">
                  {row.task}
                  {row.note && <span className="mt-1 block text-sm font-normal text-neutral-400 sm:hidden">{row.note}</span>}
                </th>
                {diagram.engines.map((engine) => {
                  const used = row.uses.includes(engine);
                  return (
                    <td key={engine} className="px-1 py-5 text-center sm:px-2">
                      <span
                        aria-hidden="true"
                        className={`inline-block size-3 rounded-full ${used ? 'bg-[#0A5BDF] ring-4 ring-[#0A5BDF]/20' : 'bg-zinc-700'}`}
                      />
                      <span className="sr-only">{used ? `Runs on ${engine}` : `Not on ${engine}`}</span>
                    </td>
                  );
                })}
                <td className="hidden whitespace-nowrap px-5 py-5 text-sm text-neutral-300 tabular-nums sm:table-cell sm:px-8">{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {diagram.caption && (
        <p className="border-t border-zinc-800 px-5 py-4 text-sm leading-relaxed text-neutral-500 sm:px-8">{diagram.caption}</p>
      )}
    </DiagramFrame>
  );
}

export default function PartnershipDiagram({ diagram }: { diagram: Diagram }) {
  return diagram.type === 'stack' ? <Stack diagram={diagram} /> : <Workload diagram={diagram} />;
}
