import { Button } from "@/components/ui/button"

export default function Page() {
  return (
    <div className="flex min-h-svh p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <div>
          <h1 className="font-medium">Texto literario</h1>
          <p>Un texto literario es una composición oral o escrita, realizada por uno o varios autores, que utiliza el lenguaje para transmitir un determinado mensaje o historia. Este tipo de texto pone el foco en la función poética del lenguaje, más que en su fin utilitario, y utiliza recursos y estructuras para relatar universos reales o imaginarios a través de la palabra. You may now add components and start building.</p>
          <p>We&apos;ve already added the button component for you.</p>
          <Button className="mt-2">Button</Button>
        </div>
        <div className="font-mono text-xs text-muted-foreground">
          (Press <kbd>d</kbd> to toggle dark mode)
        </div>
      </div>
    </div>
  )
}
