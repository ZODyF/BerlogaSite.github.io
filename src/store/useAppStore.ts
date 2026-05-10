import { create } from 'zustand'
import { collection, onSnapshot, addDoc, deleteDoc, doc, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export type Waiter = {
  id: string
  name: string
  color?: string
}

export type Shift = {
  id: string
  date: string // YYYY-MM-DD
  waiterId: string
}

interface AppState {
  waiters: Waiter[]
  shifts: Shift[]
  isAdmin: boolean
  theme: 'light' | 'dark'
  selectedWaiterId: string | null
  
  // Actions
  setAdmin: (isAdmin: boolean) => void
  toggleTheme: () => void
  setSelectedWaiterId: (id: string | null) => void
  
  // Firebase sync
  initFirebaseListeners: () => () => void // Returns unsubscribe function
  
  // Firebase actions
  addWaiter: (waiter: Omit<Waiter, 'id'>) => Promise<void>
  removeWaiter: (id: string) => Promise<void>
  addShift: (shift: Omit<Shift, 'id'>) => Promise<void>
  removeShift: (id: string) => Promise<void>
}

export const useAppStore = create<AppState>((set, get) => {
  // Load theme from localStorage
  const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
  const initialTheme = savedTheme || 'light'

  // Apply theme to document
  if (initialTheme === 'dark') {
    document.documentElement.classList.add('dark')
  }

  return {
    waiters: [],
    shifts: [],
    isAdmin: false,
    theme: initialTheme,
    selectedWaiterId: null,

    setAdmin: (isAdmin) => set({ isAdmin }),
    
    toggleTheme: () => set((state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light'
      localStorage.setItem('theme', newTheme)
      
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      
      return { theme: newTheme }
    }),

    setSelectedWaiterId: (id) => set({ selectedWaiterId: id }),
    
    initFirebaseListeners: () => {
      const waitersQuery = query(collection(db, 'waiters'));
      const shiftsQuery = query(collection(db, 'shifts'));

      const unsubWaiters = onSnapshot(waitersQuery, (snapshot) => {
        const waitersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Waiter[];
        set({ waiters: waitersData });
      });

      const unsubShifts = onSnapshot(shiftsQuery, (snapshot) => {
        const shiftsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Shift[];
        set({ shifts: shiftsData });
      });

      // Return a function to unsubscribe from both listeners
      return () => {
        unsubWaiters();
        unsubShifts();
      };
    },

    addWaiter: async (waiter) => {
      try {
        await addDoc(collection(db, 'waiters'), waiter);
      } catch (error) {
        console.error("Error adding waiter:", error);
      }
    },
    
    removeWaiter: async (id) => {
      try {
        // Find and delete all shifts for this waiter first
        const { shifts } = get();
        const waiterShifts = shifts.filter(s => s.waiterId === id);
        
        // Delete the waiter
        await deleteDoc(doc(db, 'waiters', id));

        // Delete all associated shifts (optional but good for consistency)
        for (const shift of waiterShifts) {
          await deleteDoc(doc(db, 'shifts', shift.id));
        }
      } catch (error) {
        console.error("Error removing waiter:", error);
      }
    },
    
    addShift: async (shift) => {
      try {
        const { shifts } = get();
        const exists = shifts.some(s => s.date === shift.date && s.waiterId === shift.waiterId);
        if (exists) return;

        await addDoc(collection(db, 'shifts'), shift);
      } catch (error) {
        console.error("Error adding shift:", error);
      }
    },
    
    removeShift: async (id) => {
      try {
        await deleteDoc(doc(db, 'shifts', id));
      } catch (error) {
        console.error("Error removing shift:", error);
      }
    },
  }
})
