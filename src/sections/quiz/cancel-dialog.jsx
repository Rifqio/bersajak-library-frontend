import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components";
import PropTypes from "prop-types";

const CancelDialog = ({ onOpen, onOpenChange, onCancel }) => {
  return (
    <Dialog open={onOpen} onOpenChange={onOpenChange}>
      <DialogContent className="font-poppins">
        <DialogHeader>
          <DialogTitle>Batalkan Quiz</DialogTitle>
          <DialogDescription>
            Kamu yakin ingin membatalkan quiz?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => onOpenChange()} variant="secondary">
            Tidak
          </Button>
          <Button onClick={() => onCancel()} variant="destructive">
            Ya
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

CancelDialog.propTypes = {
  onOpen: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default CancelDialog;
