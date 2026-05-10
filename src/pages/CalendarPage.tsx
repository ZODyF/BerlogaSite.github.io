import { Layout } from "@/components/Layout";
import { CalendarGrid } from "@/components/CalendarGrid";
import { WaiterFilter } from "@/components/WaiterFilter";
import { motion } from "framer-motion";

export function CalendarPage() {
  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Календарь смен</h1>
        </div>

        <WaiterFilter />
        <CalendarGrid />
      </motion.div>
    </Layout>
  );
}
