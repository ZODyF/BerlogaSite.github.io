import { Layout } from "@/components/Layout";
import { useAppStore } from "@/store/useAppStore";
import { Lock, Unlock, Users, CalendarDays, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { cn, WAITER_COLORS, getWaiterBg } from "@/lib/utils";

export function AdminPage() {
  const { isAdmin, setAdmin, waiters, addWaiter, removeWaiter, adminPin, setAdminPin } = useAppStore();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [newWaiterName, setNewWaiterName] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [newPin, setNewPin] = useState("");
  const [pinMessage, setPinMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === adminPin) {
      setAdmin(true);
      setError("");
      setPin("");
      navigate("/");
    } else {
      setError("Неверный PIN-код");
    }
  };

  const handleAddWaiter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWaiterName.trim()) return;

    const nameToAdd = newWaiterName.trim();
    const colorToAdd = selectedColor;
    setNewWaiterName(""); // Сразу очищаем поле для мгновенного отклика
    setSelectedColor("");

    const newWaiterData: { name: string; color?: string } = { name: nameToAdd };
    if (colorToAdd) {
      newWaiterData.color = colorToAdd;
    }

    await addWaiter(newWaiterData);
  };

  const handleChangePin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.trim().length < 4) {
      setPinMessage("Пин-код должен содержать минимум 4 символа");
      return;
    }
    await setAdminPin(newPin.trim());
    setNewPin("");
    setPinMessage("PIN-код успешно изменен!");
    setTimeout(() => setPinMessage(""), 3000);
  };

  if (!isAdmin) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md p-8 bg-card border rounded-2xl shadow-sm text-center"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Вход для администратора</h1>
            <p className="text-muted-foreground mb-6">Введите PIN-код для доступа к управлению</p>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="PIN-код (1234)"
                  className="w-full px-4 py-3 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-center tracking-widest text-lg"
                  autoFocus
                />
                {error && <p className="text-destructive text-sm mt-2">{error}</p>}
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Войти
              </button>
            </form>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Unlock className="w-8 h-8 text-primary" /> Панель управления
            </h1>
            <p className="text-muted-foreground mt-2">
              Управление сотрудниками и сменами
            </p>
          </div>
          <button
            onClick={() => setAdmin(false)}
            className="px-4 py-2 border rounded-lg hover:bg-secondary transition-colors text-sm font-medium self-start md:self-auto"
          >
            Выйти
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Waiters Management */}
          <div className="bg-card border rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-muted-foreground" /> Сотрудники
            </h2>
            
            <form onSubmit={handleAddWaiter} className="flex flex-col gap-3 mb-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newWaiterName}
                  onChange={(e) => setNewWaiterName(e.target.value)}
                  placeholder="Имя сотрудника"
                  className="flex-1 min-w-0 px-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="submit"
                  className="shrink-0 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Добавить
                </button>
              </div>
              <div className="flex items-center gap-2 px-1 flex-wrap">
                <span className="text-sm text-muted-foreground mr-2">Цвет:</span>
                <button
                  type="button"
                  onClick={() => setSelectedColor("")}
                  className={cn(
                    "text-xs px-2 py-1 rounded-md border transition-colors",
                    selectedColor === "" ? "border-primary bg-primary/10 text-primary" : "bg-secondary text-muted-foreground border-transparent"
                  )}
                >
                  Без цвета
                </button>
                {WAITER_COLORS.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSelectedColor(c)}
                    className={cn(
                      "w-6 h-6 rounded-md transition-transform border", 
                      getWaiterBg(c),
                      selectedColor === c ? "scale-110 ring-2 ring-primary ring-offset-2 ring-offset-card border-transparent" : "border-transparent hover:scale-105"
                    )}
                  />
                ))}
              </div>
            </form>

            <div className="space-y-2">
              {waiters.map((waiter) => (
                <div key={waiter.id} className={cn("flex items-center justify-between p-3 rounded-lg border border-transparent", getWaiterBg(waiter.color))}>
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{waiter.name}</span>
                  </div>
                  <button
                    onClick={() => removeWaiter(waiter.id)}
                    className="p-2 opacity-60 hover:opacity-100 hover:text-destructive hover:bg-destructive/10 rounded-md transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {waiters.length === 0 && (
                <p className="text-center text-muted-foreground py-4">Нет сотрудников</p>
              )}
            </div>
          </div>

          {/* Quick Stats / Info & Security */}
          <div className="space-y-8">
            <div className="bg-card border rounded-2xl p-6 shadow-sm">
               <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-muted-foreground" /> Инструкция
              </h2>
              <div className="prose prose-sm dark:prose-invert text-muted-foreground space-y-4">
                <p>
                  В панели администратора вы можете управлять списком официантов. 
                </p>
                <p>
                  <strong>Чтобы назначить смену:</strong><br/>
                  Перейдите на вкладку "Календарь" (будучи авторизованным администратором) и кликните на нужный день. В открывшемся окне вы сможете добавить или удалить сотрудников на эту дату.
                </p>
              </div>
            </div>

            <div className="bg-card border rounded-2xl p-6 shadow-sm">
               <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Lock className="w-5 h-5 text-muted-foreground" /> Безопасность
              </h2>
              <form onSubmit={handleChangePin} className="space-y-4">
                <label className="text-sm font-medium block text-muted-foreground">
                  Изменить PIN-код (Текущий: {adminPin})
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    placeholder="Новый PIN"
                    className="flex-1 min-w-0 px-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    type="submit"
                    className="shrink-0 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
                  >
                    Сохранить
                  </button>
                </div>
                {pinMessage && (
                  <p className={`text-sm ${pinMessage.includes('Минимум') || pinMessage.includes('минимум') ? 'text-destructive' : 'text-green-500'}`}>
                    {pinMessage}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
}
