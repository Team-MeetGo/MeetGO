import ReactDOM from 'react-dom';

type Props = {
  children: React.ReactNode;
};

export default function ModalPotal({ children }: Props) {
  const node = document.getElementById('portal') as Element;
  return ReactDOM.createPortal(children, node);
}
