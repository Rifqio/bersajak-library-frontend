import {
    Button,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
  } from "@/components";
import { ROUTE } from "@/lib/constants";
  import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
  
  const ScoreDialog = ({ onOpen, onBack, score }) => {
    const navigate = useNavigate();
    const roundedScore = score.toFixed(0);

    const handleGoTo = () => {
      navigate(ROUTE.Home);
    };

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
            <Button onClick={() => handleGoTo()} variant="destructive">
              Selesai
            </Button>
            <Button onClick={() => onBack()} variant="destructive">
              Pilih Buku
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
  