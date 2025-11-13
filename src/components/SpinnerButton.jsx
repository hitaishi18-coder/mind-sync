import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

export function SpinnerButton() {
  return (
    <div className="flex flex-col items-center gap-4">
      <Button variant="outline" disabled size="sm">
        <Spinner />
        Please wait..
      </Button>
    </div>
  )
}
