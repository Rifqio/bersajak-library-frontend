import { create } from 'zustand';

const useModalErrorStore = create((set) => ({
    isOpen: false,
    message: '',
    requestId: '',
    onOpen: (message, requestId) => set({ isOpen: true, message, requestId }),
    onClose: () => set({ isOpen: false, message: '', requestId: '' }),
}));

export default useModalErrorStore;