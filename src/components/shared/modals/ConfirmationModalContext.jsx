"use client";
import { createContext, useContext, useState, useCallback } from "react";

const ConfirmationModalContext = createContext();

export const ConfirmationModalProvider = ({ children }) => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "تأكيد",
    cancelText: "إلغاء",
    variant: "primary",
    type: null,
    loading: false,
    onConfirm: null,
  });

  const showConfirmation = useCallback((options) => {
    setModalState({
      isOpen: true,
      loading: false,
      ...options,
    });
  }, []);

  const hideConfirmation = useCallback(() => {
    setModalState((prev) => ({ ...prev, isOpen: false, loading: false }));
  }, []);

  return (
    <ConfirmationModalContext.Provider
      value={{ modalState, showConfirmation, hideConfirmation, setModalState }}
    >
      {children}
    </ConfirmationModalContext.Provider>
  );
};

export const useConfirmationModal = () => useContext(ConfirmationModalContext);
