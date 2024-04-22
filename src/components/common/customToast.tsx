import { toast, Slide } from 'react-toastify';

export const customErrToast = (str: string) => {
  return toast.error(str, {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
    transition: Slide
  });
};

export const customSuccessToast = (str: string) => {
  return toast.success(str, {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
    transition: Slide
  });
};
