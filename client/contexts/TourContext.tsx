import React, { createContext, useContext, useState, useEffect } from "react";

interface TourContextType {
  isTourOpen: boolean;
  hasCompletedTour: boolean;
  startTour: () => void;
  closeTour: () => void;
  completeTour: () => void;
  resetTour: () => void;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

interface TourProviderProps {
  children: React.ReactNode;
}

export function TourProvider({ children }: TourProviderProps) {
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [hasCompletedTour, setHasCompletedTour] = useState(false);

  // Load tour completion status from localStorage
  useEffect(() => {
    const completed = localStorage.getItem("valasys-tour-completed");
    if (completed === "true") {
      setHasCompletedTour(true);
    }
  }, []);

  const startTour = () => {
    setIsTourOpen(true);
  };

  const closeTour = () => {
    setIsTourOpen(false);
  };

  const completeTour = () => {
    setIsTourOpen(false);
    setHasCompletedTour(true);
    localStorage.setItem("valasys-tour-completed", "true");
  };

  const resetTour = () => {
    setHasCompletedTour(false);
    localStorage.removeItem("valasys-tour-completed");
  };

  const value: TourContextType = {
    isTourOpen,
    hasCompletedTour,
    startTour,
    closeTour,
    completeTour,
    resetTour,
  };

  return <TourContext.Provider value={value}>{children}</TourContext.Provider>;
}

export function useTour(): TourContextType {
  const context = useContext(TourContext);
  if (context === undefined) {
    throw new Error("useTour must be used within a TourProvider");
  }
  return context;
}
