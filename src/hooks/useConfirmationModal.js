"use client";

import { useState, useCallback } from "react";

export const useConfirmationModal = () => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "تأكيد",
    cancelText: "إلغاء",
    variant: "default",
    type: null,
    onConfirm: null,
    loading: false,
    password: "",
  });

  const showConfirmation = useCallback((options = {}) => {
    setModalState((prev) => ({
      ...prev,
      ...options,
      isOpen: true,
      password: options.password ?? "",
      loading: false,
    }));
  }, []);

  const hideConfirmation = useCallback(() => {
    setModalState((prev) => ({
      ...prev,
      isOpen: false,
      password: "",
      loading: false,
    }));
  }, []);

  return {
    modalState,
    setModalState,
    showConfirmation,
    hideConfirmation,
  };
};
