import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function WaiterFilter() {
  const { waiters, selectedWaiterId, setSelectedWaiterId } = useAppStore();

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <button
        onClick={() => setSelectedWaiterId(null)}
        className={cn(
          "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border",
          selectedWaiterId === null
            ? "bg-primary text-primary-foreground border-primary"
            : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border-transparent"
        )}
      >
        Все
      </button>
      {waiters.map((waiter) => {
        const isSelected = selectedWaiterId === waiter.id;
        return (
          <motion.button
            key={waiter.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedWaiterId(isSelected ? null : waiter.id)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border flex items-center gap-2",
              isSelected
                ? "border-primary bg-background shadow-sm"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border-transparent",
              !isSelected && selectedWaiterId !== null && "opacity-50"
            )}
          >
            <span className={cn("w-2 h-2 rounded-full", waiter.color)} />
            {waiter.name}
          </motion.button>
        );
      })}
    </div>
  );
}
