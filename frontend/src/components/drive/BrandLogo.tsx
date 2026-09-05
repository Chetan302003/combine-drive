import { cn } from '@/lib/utils'

export function BrandLogo({ className, imgClassName }: { className?: string; imgClassName?: string }) {
  return (
    <div className={cn('relative flex items-center justify-center shrink-0 select-none', className)}>
      <img
        src="/combined-logo.png"
        alt="Combined logo"
        className={cn('h-full w-full object-contain drop-shadow-xs transition-transform duration-200', imgClassName)}
      />
    </div>
  )
}
