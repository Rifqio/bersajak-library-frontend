import {
    Button,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components";
import { ArrowDownAZ, ClipboardPen } from "lucide-react";
import PropTypes from "prop-types";
import { useNavigate, useParams } from "react-router-dom";

const QuizOption = ({ icon, title, onClick }) => {
    return (
        <button onClick={onClick} className='border-2 border-gray-500 rounded-lg bg-gray-100 w-40 h-40 flex flex-col justify-center items-center cursor-pointer hover:bg-gray-300'>
            {icon}
            <h1 className='text-md font-semibold text-gray-900 font-poppins'>
                {title}
            </h1>
        </button>
    );
};

export const StartQuizDialog = ({ open, onOpenChange }) => {
    const navigate = useNavigate();
    const { id } = useParams();

    const onClickMultipleChoice = () => {
        navigate(`/quiz/multiple-choice/${id}`);
        onOpenChange();
    }


    const onClickWordCompletion = () => {
        navigate(`/quiz/word-completion/${id}`);
        onOpenChange();
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Ingin memulai kuis?</DialogTitle>
                    <DialogDescription className='pb-6'>
                        Selamat, kamu telah menyelesaikan cerita. Silahkan pilih jenis permainan
                    </DialogDescription>
                    <div className='flex justify-evenly items-center pb-6 gap-10'>
                       <QuizOption onClick={onClickMultipleChoice} icon={<ArrowDownAZ className="opacity-80" size={100} />} title='Pilihan Ganda' />
                       <QuizOption onClick={onClickWordCompletion} icon={<ClipboardPen className="opacity-80" size={100} />} title='Melengkapi Kata' />
                    </div>
                       <Button onClick={() => onOpenChange()} variant="destructive">Batalkan</Button>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

QuizOption.propTypes = {
    icon: PropTypes.node.isRequired,
    title: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
};

StartQuizDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onOpenChange: PropTypes.func.isRequired
};
