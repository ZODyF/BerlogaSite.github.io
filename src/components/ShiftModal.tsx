import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { X, UserPlus, Trash2 } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ShiftModalProps {
  date: Date;
  onClose: () => void;
}

export function ShiftModal({ date, onClose }: ShiftModalProps) {
  const { waiters, shifts, addShift, removeShift } = useAppStore();
  const dateStr = format(date, "yyyy-MM-dd");
  const dayShifts = shifts.filter((s) => s.date === dateStr);
  const [selectedWaiter, setSelectedWaiter] = useState("");

  const handleAddShift = () => {
    if (!selectedWaiter) return;
    addShift({ date: dateStr, waiterId: selectedWaiter });
    setSelectedWaiter("");
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md bg-card border rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="flex items-center justify-between p-4 border-b">
            <div>
              <h3 className="text-lg font-semibold">Управление сменой</h3>
              <p className="text-sm text-muted-foreground capitalize">
                {format(date, "EEEE, d MMMM yyyy", { locale: ru })}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-muted-foreground hover:bg-secondary rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 space-y-6">
            {/* Add to shift */}
            <div>
              <label className="text-sm font-medium mb-2 block text-muted-foreground">
                Назначить сотрудника
              </label>
              <div className="flex gap-2">
                <select
                  value={selectedWaiter}
                  onChange={(e) => setSelectedWaiter(e.target.value)}
                  className="flex-1 px-3 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Выберите...</option>
                  {waiters
                    .filter((w) => !dayShifts.some((s) => s.waiterId === w.id))
                    .map((waiter) => (
                      <option key={waiter.id} value={waiter.id}>
                        {waiter.name}
                      </option>
                    ))}
                </select>
                <button
                  onClick={handleAddShift}
                  disabled={!selectedWaiter}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Current shift list */}
            <div>
              <label className="text-sm font-medium mb-2 block text-muted-foreground">
                Сотрудники на смене
              </label>
              <div className="space-y-2">
                {dayShifts.map((shift) => {
                  const waiter = waiters.find((w) => w.id === shift.waiterId);
                  if (!waiter) return null;

                  return (
                    <div
                      key={shift.id}
                      className="flex items-center justify-between p-3 bg-secondary rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className={cn("w-3 h-3 rounded-full", waiter.color)} />
                        <span className="font-medium">{waiter.name}</span>
                      </div>
                      <button
                        onClick={() => removeShift(shift.id)}
                        className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
                {dayShifts.length === 0 && (
                  <p className="text-center text-sm text-muted-foreground py-4 border rounded-lg border-dashed">
                    Смена пуста
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
