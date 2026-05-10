import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths } from "date-fns";
import { ru } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { cn, getWaiterBg } from "@/lib/utils";
import { ShiftModal } from "./ShiftModal";

export function CalendarGrid() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { shifts, waiters, selectedWaiterId, isAdmin, addShift, removeShift } = useAppStore();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  
  // Pad the start of the month with empty days to align with weekday columns (Mon-Sun)
  const startDate = new Date(monthStart);
  const startDayOfWeek = startDate.getDay();
  const padDays = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1; // 0 is Sunday, make Monday=0
  
  for (let i = 0; i < padDays; i++) {
    startDate.setDate(startDate.getDate() - 1);
  }

  const days = eachDayOfInterval({
    start: startDate,
    end: monthEnd,
  });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

  return (
    <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-semibold capitalize">
          {format(currentDate, "LLLL yyyy", { locale: ru })}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={prevMonth}
            className="p-2 hover:bg-secondary rounded-full transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-secondary rounded-full transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 border-b bg-muted/30">
        {weekDays.map((day) => (
          <div key={day} className="py-3 text-center text-sm font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 auto-rows-fr">
        {days.map((day) => {
          const dateStr = format(day, "yyyy-MM-dd");
          const dayShifts = shifts.filter((s) => s.date === dateStr);
          const isCurrentMonth = isSameMonth(day, currentDate);
          
          // Determine if this day should be dimmed based on filter
          const isDimmed = selectedWaiterId !== null && !dayShifts.some(s => s.waiterId === selectedWaiterId);

          return (
            <div
              key={day.toString()}
              onClick={() => {
                if (isAdmin && isCurrentMonth) {
                  if (selectedWaiterId) {
                    const existingShift = dayShifts.find(s => s.waiterId === selectedWaiterId);
                    if (existingShift) {
                      removeShift(existingShift.id);
                    } else {
                      addShift({ date: dateStr, waiterId: selectedWaiterId });
                    }
                  } else {
                    setSelectedDate(day);
                  }
                }
              }}
              className={cn(
                "h-[110px] md:h-[130px] flex flex-col p-1 md:p-2 border-r border-b relative transition-colors",
                !isCurrentMonth && "bg-muted/10 text-muted-foreground",
                isToday(day) && "bg-primary/5",
                isDimmed && "opacity-30 grayscale transition-all duration-300",
                isAdmin && isCurrentMonth && "hover:bg-accent/5 cursor-pointer" // Admin interaction hint
              )}
            >
              <div className="flex justify-between items-start mb-1 md:mb-2 shrink-0">
                <span
                  className={cn(
                    "text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full",
                    isToday(day) && "bg-primary text-primary-foreground"
                  )}
                >
                  {format(day, "d")}
                </span>
              </div>

              {/* Shifts Display */}
              <div className="flex flex-col gap-1 overflow-y-auto flex-1 no-scrollbar">
                {dayShifts.map((shift) => {
                  const waiter = waiters.find((w) => w.id === shift.waiterId);
                  if (!waiter) return null;

                  const isHighlighted = selectedWaiterId === waiter.id;

                  return (
                    <div
                      key={shift.id}
                      className={cn(
                        "text-[10px] sm:text-[11px] px-1.5 py-0.5 rounded flex items-center shrink-0 border transition-all duration-200 overflow-hidden",
                        isHighlighted ? "ring-2 ring-primary z-10" : "border-transparent",
                        getWaiterBg(waiter.color)
                      )}
                    >
                      <span className="leading-none overflow-hidden whitespace-nowrap text-clip py-0.5">{waiter.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Admin Shift Modal */}
      {selectedDate && (
        <ShiftModal
          date={selectedDate}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </div>
  );
}
