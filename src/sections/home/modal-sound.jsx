import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components";
import PropTypes from "prop-types";

export const ModalSound = ({ onOpen, onOpenChange, onEnableAudio, onDisabledAudio, disabled }) => {
  return (
    <Dialog open={onOpen} onOpenChange={onOpenChange}>
      <DialogContent className="font-fredoka">
        <DialogHeader>
          <DialogTitle className="tracking-wide text-2xl">Ingin Mengaktifkan Fitur Suara?</DialogTitle>
          <DialogDescription className="pb-2">
            Untuk menambah pengalaman membaca, Anda dapat mengaktifkan fitur suara.
          </DialogDescription>
          <div className="flex justify-center gap-x-6">
            <Button disabled={disabled} onClick={onEnableAudio} className="w-full rounded-full bg-home-yellow hover:bg-yellow-800">
              Ya
            </Button>
            <Button disabled={disabled} onClick={onDisabledAudio} variant="outline" className="w-full rounded-full">
              Tidak
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

ModalSound.propTypes = {
  onOpen: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  onEnableAudio: PropTypes.func.isRequired,
  onDisabledAudio: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};
