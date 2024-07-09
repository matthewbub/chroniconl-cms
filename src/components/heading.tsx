import { robotoSlab } from '@/app/fonts'
import { clsx } from 'clsx'

type HeadingProps = {
  level?: 1 | 2 | 3 | 4 | 5 | 6
  className?: string
  children: React.ReactNode
}

export function Heading({ className, level = 2, ...props }: HeadingProps) {
  let Element: `h${typeof level}` = `h${level}`

  return (
    <Element
      {...props}
      className={clsx(
        className,
        'font-black leading-6 text-stone-950 dark:text-white',
        level === 1 && robotoSlab.className,
        level > 1 && robotoSlab.className,
        level === 1 && 'text-4xl',
        level === 2 && 'text-3xl',
        level === 3 && 'text-2xl/8',
        level === 4 && 'text-xl',
        level === 5 && 'text-2xl/8',
        level === 6 && 'text-2xl/8',
      )}
    />
  )
}
