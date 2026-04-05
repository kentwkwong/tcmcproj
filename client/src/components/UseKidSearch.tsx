// hooks/useKidSearch.ts
import { useState, useEffect } from "react";
import axios from "../api/axios";
import { Kid } from "../types/Kid";

interface UseKidSearchProps {
  onCheckIn: (idOrName: string) => Promise<void>;
}

export const useKidSearch = ({ onCheckIn }: UseKidSearchProps) => {
  const [kidOptions, setKidOptions] = useState<Kid[]>([]);
  const [selectedKid, setSelectedKid] = useState<Kid | null>(null);
  const [searchInput, setSearchInput] = useState("");

  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");

  const guestKid: Kid = {
    name: "New_Guest",
    email: "",
    dob: "",
    gender: "",
  };

  const handlePhoneChange = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    let formatted = cleaned;
    if (cleaned.length > 3 && cleaned.length <= 6) {
      formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    } else if (cleaned.length > 6) {
      formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
    }
    if (formatted.length <= 14) setGuestPhone(formatted);
  };

  useEffect(() => {
    const controller = new AbortController();

    const fetchKids = async () => {
      if (!searchInput.trim()) {
        setKidOptions([guestKid]);
        return;
      }

      try {
        const res = await axios.get(`/kids/getkidsbyname/${searchInput}`, {
          signal: controller.signal,
        });
        if (res.data.length === 0) {
          setKidOptions([guestKid]);
        } else {
          setKidOptions(res.data);
        }
      } catch (err) {
        setKidOptions([guestKid]);
      }
    };

    const debounce = setTimeout(fetchKids, 300);
    return () => {
      clearTimeout(debounce);
      controller.abort();
    };
  }, [searchInput]);

  const handleSearchSubmit = async () => {
    if (!selectedKid?._id) {
      if (!guestName.trim() || guestPhone.length < 14) return;
      await onCheckIn(`${guestName}-${guestPhone}`);
    } else {
      await onCheckIn(selectedKid._id);
    }
    setSearchInput("");
    setSelectedKid(null);
    setGuestName("");
    setGuestPhone("");
  };

  return {
    kidOptions,
    selectedKid,
    setSelectedKid,
    searchInput,
    setSearchInput,
    guestName,
    setGuestName,
    guestPhone,
    handlePhoneChange,
    handleSearchSubmit,
    isSubmitDisabled:
      !selectedKid ||
      (!selectedKid._id && (!guestName.trim() || guestPhone.length < 14)),
  };
};
