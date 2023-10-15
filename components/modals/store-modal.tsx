"use client";

import Modal from "@/components/ui/modal";
import { useStoreModal } from "@/hooks/useStoreModal";

export default function StoreModal() {
  const storeModal = useStoreModal();

  return (
    <Modal
      title="Create Store"
      description="Create a new store"
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      Future Create Store Form
    </Modal>
  );
}
