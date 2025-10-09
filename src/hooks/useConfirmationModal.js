// hooks/useConfirmationModal.js
import { useState } from "react";

export const useConfirmationModal = () => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "تأكيد",
    cancelText: "إلغاء",
    variant: "warning",
    type: "general",
    onConfirm: null,
    loading: false
  });

  const showConfirmation = (options) => {
    setModalState({
      isOpen: true,
      variant: "warning",
      type: "general",
      loading: false,
      ...options
    });
  };

  const hideConfirmation = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  const setLoading = (loading) => {
    setModalState(prev => ({ ...prev, loading }));
  };

  return {
    modalState,
    showConfirmation,
    hideConfirmation,
    setLoading
  };
};