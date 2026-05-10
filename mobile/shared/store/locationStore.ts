import { create } from 'zustand';

interface Address {
  id: string;
  label: string;
  address_line: string;
  village: string;
  district: string;
  lat: number;
  lng: number;
  is_default: boolean;
}

interface LocationStore {
  selectedAddress: Address | null;
  setSelectedAddress: (address: Address | null) => void;
}

export const useLocationStore = create<LocationStore>((set) => ({
  selectedAddress: null,
  setSelectedAddress: (address) => set({ selectedAddress: address }),
}));
