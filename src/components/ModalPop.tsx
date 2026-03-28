import ReactDOM from "react-dom";



interface ModalPopProps {
  children: React.ReactNode;
  isOpen: boolean;
  closeModal?: () => void;
}

export function ModalPop({ children, isOpen, closeModal }: ModalPopProps) {
  if (!isOpen) return null;

  const portalRoot = document.getElementById("modal");
  if (!portalRoot) return null;

  return ReactDOM.createPortal(
    <div
      onClick={() => {
        closeModal && closeModal();
      }}
      className={`fixed w-full h-screen top-16 left-0   backdrop-blur-xs flex z-50 justify-center  overflow-hidden md:p-4 p-2`}
    >
      {children}
    </div>,
    portalRoot
  );
}