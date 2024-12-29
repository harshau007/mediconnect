import { create } from "zustand";
import { Hospital } from "../types/hospital";

interface HospitalStore {
  hospitals: Hospital[];
  selectedHospital: Hospital | null;
  isLoading: boolean;
  setHospitals: (hospitals: Hospital[]) => void;
  setSelectedHospital: (hospital: Hospital | undefined) => void;
  setIsLoading: (isLoading: boolean) => void;
  fetchHospitals: () => Promise<void>;
  getHospital: (id: number) => Hospital | undefined;
  refreshHospital: (id: number) => Promise<void>;
}

export const useHospitalStore = create<HospitalStore>((set, get) => ({
  hospitals: [],
  selectedHospital: null,
  isLoading: false,
  setHospitals: (hospitals) => set({ hospitals }),
  setSelectedHospital: (hospital) => set({ selectedHospital: hospital }),
  setIsLoading: (isLoading) => set({ isLoading }),
  fetchHospitals: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch("http://localhost:8080/api/v1/hospitals/");
      if (!response.ok) {
        throw new Error("Failed to fetch hospitals");
      }
      const data: { data: Hospital[]; status: string } = await response.json();
      set({ hospitals: data.data, isLoading: false });
    } catch (error) {
      console.error("Error fetching hospitals:", error);
      set({ isLoading: false });
    }
  },
  getHospital: (id) => {
    return get().hospitals.find((h) => h.id === id);
  },
  refreshHospital: async (id) => {
    set({ isLoading: true });
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/hospitals/${id}`
      );
      if (!response.ok) {
        throw new Error("Failed to refresh hospital");
      }
      const data: { data: Hospital; status: string } = await response.json();
      set((state) => ({
        hospitals: state.hospitals.map((h) => (h.id === id ? data.data : h)),
        selectedHospital: data.data,
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error refreshing hospital:", error);
      set({ isLoading: false });
    }
  },
}));
