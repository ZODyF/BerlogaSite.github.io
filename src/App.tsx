import { HashRouter, Routes, Route } from "react-router-dom";
import { CalendarPage } from "@/pages/CalendarPage";
import { AdminPage } from "@/pages/AdminPage";
import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";

export default function App() {
  const initFirebaseListeners = useAppStore(state => state.initFirebaseListeners);

  useEffect(() => {
    // Подключаемся к Firebase и слушаем изменения
    const unsubscribe = initFirebaseListeners();
    return () => unsubscribe();
  }, [initFirebaseListeners]);

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<CalendarPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </HashRouter>
  );
}
