import { Modal } from "../../../components/Modal.component";
import  { useState } from "react";

const ModalUse = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsModalOpen(true)}>Open Modal</button>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="My Modal"
      >
        <p>This is some content inside the modal.</p>
      </Modal>
    </div>
  );
};

export default ModalUse;
