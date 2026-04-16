"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface ExtraHelpContextType {
  isHelpEnabled: boolean;
  toggleHelp: () => void;
}

const ExtraHelpContext = createContext<ExtraHelpContextType>({
  isHelpEnabled: false,
  toggleHelp: () => {},
});

export function useExtraHelp() {
  return useContext(ExtraHelpContext);
}

export function ExtraHelpProvider({ children }: { children: ReactNode }) {
  const [isHelpEnabled, setIsHelpEnabled] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("ac_extra_help");
    if (stored === "true") setIsHelpEnabled(true);
  }, []);

  function toggleHelp() {
    const next = !isHelpEnabled;
    setIsHelpEnabled(next);
    localStorage.setItem("ac_extra_help", String(next));
  }

  return (
    <ExtraHelpContext.Provider value={{ isHelpEnabled, toggleHelp }}>
      {children}
    </ExtraHelpContext.Provider>
  );
}
