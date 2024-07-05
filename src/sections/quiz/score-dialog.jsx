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
  
  const ScoreDialog = ({ onOpen, onBack, score }) => {
    const roundedScore = score.toFixed(0);
    return (
      <Dialog open={onOpen}>
        <DialogContent className="font-poppins">
          <DialogHeader>
            <DialogTitle>Total Skor</DialogTitle>
            <DialogDescription>
            Score yang kamu miliki {roundedScore}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => onBack()} variant="destructive">
              Kemabli
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };
  
  ScoreDialog.propTypes = {
    onOpen: PropTypes.bool.isRequired,
    onBack: PropTypes.func.isRequired,
    score: PropTypes.string,
  };
  
  export default ScoreDialog;
  