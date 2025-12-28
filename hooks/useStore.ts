import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { DataRoot, DateType } from '@/app/types/types';

interface AppState {
    dataPage: DataRoot;
    savedDates: DateType[];
    coverColor: string;
    coverTitle: string;
    coverSubtitle: string;
    coverImage: string | null;
    setDataPage: (data: DataRoot) => void;
    updateDataPage: (updates: Partial<DataRoot>) => void;
    setCoverColor: (color: string) => void;
    setCoverTitle: (title: string) => void;
    setCoverSubtitle: (subtitle: string) => void;
    setCoverImage: (image: string | null) => void;
    addSavedDate: (date: DateType) => void;
    updateSavedDate: (date: DateType) => void;
    removeSavedDate: (id: number) => void;
    setLastSection: (section: string) => void;
}

export const useStore = create<AppState>()(
    persist(
        (set) => ({
            dataPage: {
                Dates: [],
                person1: "",
                person2: "",
                lastseccion: "cover",
                totalPage: 0
            },
            savedDates: [],
            coverColor: "#f43f5e", // rose-500 default
            coverTitle: "Nuestra Agenda de Citas",
            coverSubtitle: "100 Ideas para Compartir Juntos",
            coverImage: null,

            setDataPage: (data) => set({ dataPage: data }),

            updateDataPage: (updates) => set((state) => ({
                dataPage: { ...state.dataPage, ...updates }
            })),

            setCoverColor: (color) => set({ coverColor: color }),
            
            setCoverTitle: (title) => set({ coverTitle: title }),
            
            setCoverSubtitle: (subtitle) => set({ coverSubtitle: subtitle }),
            
            setCoverImage: (image) => set({ coverImage: image }),

            addSavedDate: (date) => set((state) => {
                // Avoid duplicates or update existing
                const exists = state.savedDates.find(d => d.id === date.id);
                if (exists) {
                    return {
                        savedDates: state.savedDates.map(d => d.id === date.id ? date : d)
                    };
                }
                return { savedDates: [...state.savedDates, date] };
            }),

            updateSavedDate: (date) => set((state) => ({
                savedDates: state.savedDates.map((d) => (d.id === date.id ? date : d)),
            })),

            removeSavedDate: (id) => set((state) => ({
                savedDates: state.savedDates.filter((d) => d.id !== id)
            })),

            setLastSection: (section) => set((state) => ({
                dataPage: { ...state.dataPage, lastseccion: section }
            })),
        }),
        {
            name: 'love-date-storage', // unique name
            storage: createJSONStorage(() => localStorage),
        }
    )
);
