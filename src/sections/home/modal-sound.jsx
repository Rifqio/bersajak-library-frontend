import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components";
import PropTypes from "prop-types";

export const ModalSound = ({ onOpen, onOpenChange, onEnableAudio, onDisabledAudio }) => {
  return (
    <Dialog open={onOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ingin Mengaktifkan Fitur Suara?</DialogTitle>
          <DialogDescription className="pb-2">
            Dolor ad adipisicing consectetur amet in non cillum amet dolor.
          </DialogDescription>
          <div className="flex justify-center gap-x-6">
            <Button onClick={onEnableAudio} className="w-full rounded-full">
              Ya
            </Button>
            <Button onClick={onDisabledAudio} variant="outline" className="w-full rounded-full">
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
};
