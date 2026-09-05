const COLOR_VARIANTS = [
  'bg-blue-100 text-blue-700 border-blue-200/80',
  'bg-emerald-100 text-emerald-700 border-emerald-200/80',
  'bg-indigo-100 text-indigo-700 border-indigo-200/80',
  'bg-purple-100 text-purple-700 border-purple-200/80',
  'bg-amber-100 text-amber-800 border-amber-200/80',
  'bg-rose-100 text-rose-700 border-rose-200/80',
  'bg-cyan-100 text-cyan-800 border-cyan-200/80',
]

function getColorClass(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return COLOR_VARIANTS[Math.abs(hash) % COLOR_VARIANTS.length]
}

export function AvatarStack({ email }: { count?: number; email?: string }) {
  const label = email?.trim() || 'A'
  const initial = label.charAt(0).toUpperCase()
  const colorClass = getColorClass(label)

  return (
    <div
      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-extrabold border shadow-2xs select-none ${colorClass}`}
      title={email || undefined}
    >
      {initial}
    </div>
  )
}
