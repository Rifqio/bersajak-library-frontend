import { useModalErrorStore } from "@/zustand";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "./dialog";
import { Button } from "./button";

export const ErrorModal = () => {
  const { isOpen, onClose } = useModalErrorStore();
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='font-poppins text-2xl text-center'>
            Terjadi Kesalahan
          </DialogTitle>
        </DialogHeader>
        <div className='pt-4'>
          <p className='font-poppins text-sm text-center leading-relaxed tracking-tight'>
            Terjadi kesalahan pada server silahkan coba beberapa saat lagi
          </p>
        </div>
        <div className='flex justify-end pt-4'>
          <Button onClick={onClose} className='w-full' variant="destructive" size="sm">
            Tutup
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
