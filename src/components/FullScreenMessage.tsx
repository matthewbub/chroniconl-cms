import { cn } from '@/utils/cn'
import { LinkAsButton } from '@/components/button'

export default function FullScreenMessage({
  eyebrow,
  title,
  description,
  actionLabel,
  actionHref,
}: {
  eyebrow: string
  title: string
  description: string
  actionLabel: string
  actionHref: string
}) {
  return (
    <section className="flex flex-col items-center justify-center pb-40 pt-20">
      <p className="text-base font-semibold text-stone-800 dark:text-stone-300">
        {eyebrow}
      </p>
      <h2
        className={cn([
          'mt-4 text-6xl font-bold tracking-[3px] text-stone-950 dark:text-stone-200',
        ])}
      >
        {title}
      </h2>
      <p className="mt-4 text-base text-stone-600 dark:text-stone-400">
        {description}
      </p>
      <LinkAsButton
        href={actionHref}
        className="mt-4"
        variant="outline"
        size="lg"
      >
        {actionLabel}
      </LinkAsButton>
    </section>
  )
}
