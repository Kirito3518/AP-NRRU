export default function Loading() {
  return <main className="mx-auto w-full max-w-7xl animate-pulse space-y-5 p-6"><div className="h-8 w-72 rounded bg-muted" /><div className="grid grid-cols-2 gap-4 lg:grid-cols-5">{Array.from({ length: 5 }, (_, index) => <div key={index} className="h-32 rounded-2xl bg-muted" />)}</div><div className="h-80 rounded-2xl bg-muted" /></main>;
}
