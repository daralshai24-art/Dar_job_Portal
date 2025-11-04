//src\components\shared\modals\ConfirmationModalContext.jsx
"use client";
import { createContext, useContext, useState, useCallback } from "react";
import { ConfirmationModal } from "./ConfirmationModal";

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
    formData: null,
    initialFormData: {},
  });

  const showConfirmation = useCallback((options) => {
    setModalState({
      isOpen: true,
      loading: false,
      confirmText: "تأكيد",
      cancelText: "إلغاء",
      variant: "primary",
      formData: null,
      initialFormData: {},
      ...options,
    });
  }, []);

  const hideConfirmation = useCallback(() => {
    setModalState((prev) => ({ ...prev, isOpen: false, loading: false }));
  }, []);

  const setLoading = useCallback((loading) => {
    setModalState((prev) => ({ ...prev, loading }));
  }, []);

  const updateFormData = useCallback((newFormData) => {
    setModalState(prev => ({ ...prev, formData: newFormData }));
  }, []);

  // Handle confirm action
  const handleConfirm = async (confirmData) => {
    const { onConfirm } = modalState;
    
    if (!onConfirm) {
      hideConfirmation();
      return;
    }

    setLoading(true);
    try {
      // Pass the form data or other confirmation data to the onConfirm callback
      const result = await onConfirm(confirmData);
      // If onConfirm returns true or undefined, close the modal
      if (result !== false) {
        hideConfirmation();
      }
    } catch (error) {
      console.error("Confirmation modal error:", error);
      // Don't close on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfirmationModalContext.Provider
      value={{ 
        modalState, 
        showConfirmation, 
        hideConfirmation, 
        setLoading,
        updateFormData
      }}
    >
      {children}
      <ConfirmationModal 
        {...modalState} 
        onClose={hideConfirmation}
        onConfirm={handleConfirm}
        updateFormData={updateFormData}
      />
    </ConfirmationModalContext.Provider>
  );
};

export const useConfirmationModal = () => useContext(ConfirmationModalContext);