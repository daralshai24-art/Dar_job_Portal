// "use client";
// import { createContext, useContext, useState, useCallback } from "react";
// import { ConfirmationModal } from "@/components/shared/modals/ConfirmationModal";

// const ConfirmationContext = createContext();

// export function ConfirmationProvider({ children }) {
//   const [modalState, setModalState] = useState({
//     isOpen: false,
//     title: "",
//     message: "",
//     confirmText: "تأكيد",
//     cancelText: "إلغاء",
//     variant: "default",
//     onConfirm: null,
//     loading: false,
//   });

//   const confirm = useCallback((options) => {
//     return new Promise((resolve, reject) => {
//       setModalState({
//         ...options,
//         isOpen: true,
//         loading: false,
//         onConfirm: async () => {
//           setModalState((s) => ({ ...s, loading: true }));
//           try {
//             await options.onConfirm?.();
//             resolve(true);
//           } catch (err) {
//             reject(err);
//           } finally {
//             setModalState((s) => ({ ...s, isOpen: false, loading: false }));
//           }
//         }
//       });
//     });
//   }, []);

//   const close = () => setModalState((s) => ({ ...s, isOpen: false }));

//   return (
//     <ConfirmationContext.Provider value={{ confirm, close }}>
//       {children}
//       <ConfirmationModal {...modalState} onClose={close} />
//     </ConfirmationContext.Provider>
//   );
// }

// export const useConfirm = () => useContext(ConfirmationContext);
