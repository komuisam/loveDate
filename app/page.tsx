import { DateRoulette } from "@/components/date-roulette"
import { ThemeProvider } from "@/components/theme-provider"

export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <main className="min-h-screen bg-background">
        <DateRoulette />
      </main>
    </ThemeProvider>
  )
}

