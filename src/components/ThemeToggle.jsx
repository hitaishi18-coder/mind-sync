import { Moon, Sun } from "lucide-react";
import { useTheme } from "./Themeprovider";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="hover:bg-indigo-100 dark:hover:bg-gray-800 relative"
    >
      <Sun className={`h-[1.2rem] w-[1.2rem] transition-all ${theme === "dark" ? "rotate-90 scale-0" : "rotate-0 scale-100"}`} />
      <Moon className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${theme === "dark" ? "rotate-0 scale-100" : "-rotate-90 scale-0"}`} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
