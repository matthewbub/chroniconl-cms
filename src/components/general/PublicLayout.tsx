import Header from '@/components/general/header/Header'
import Footer from '@/components/general/Footer'

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <Header />
      <main className="mx-auto mb-20 mt-8 max-w-7xl px-2 md:mt-10 md:px-4">
        {children}
      </main>
      <Footer />
    </div>
  )
}
