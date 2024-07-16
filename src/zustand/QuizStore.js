import { create } from 'zustand';

const useQuizStore = create((set) => ({
    isQuizFinished: false,
    onFinishQuiz: () => set({ isQuizFinished: true }),
    onResetQuiz: () => set({ isQuizFinished: false }),
}));

export default useQuizStore;