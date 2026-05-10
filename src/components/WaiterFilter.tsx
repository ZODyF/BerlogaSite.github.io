import { useAppStore } from "@/store/useAppStore";
import { cn, getWaiterBg } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function WaiterFilter() {
  const { waiters, selectedWaiterId, setSelectedWaiterId } = useAppStore();
  const [isExpanded, setIsExpanded] = useState(false);

  const selectedWaiter = waiters.find((w) => w.id === selectedWaiterId);

  return (
    <div className="mb-6 space-y-3">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border flex items-center gap-2 shadow-sm",
          selectedWaiterId === null 
            ? "bg-primary text-primary-foreground border-primary" 
            : cn(getWaiterBg(selectedWaiter?.color), "border-transparent")
        )}
      >
        {selectedWaiter ? selectedWaiter.name : "Все"}
        <ChevronDown className={cn("w-4 h-4 ml-1 transition-transform", isExpanded && "rotate-180")} />
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap gap-2 pb-2 mt-2">
              {waiters.map((waiter) => {
                const isSelected = selectedWaiterId === waiter.id;
                return (
                  <button
                    key={waiter.id}
                    onClick={() => {
                      setSelectedWaiterId(isSelected ? null : waiter.id);
                    }}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border",
                      isSelected ? "ring-2 ring-primary shadow-sm" : "border-transparent opacity-90 hover:opacity-100",
                      getWaiterBg(waiter.color)
                    )}
                  >
                    {waiter.name}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
