/* eslint-disable react/prop-types */
import { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Toastify = ({ transcript, answer, toastText }) => {
  useEffect(() => {
    if (transcript.includes(answer)) {
      toast.success(toastText, {
        position: 'top-center',
      });
    }
  }, [transcript, answer, toastText]);

  return (
    <div>
      <ToastContainer />
    </div>
  );
};

export default Toastify;
