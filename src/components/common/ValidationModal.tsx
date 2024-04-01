type ModalProps = {
  modalToggle: React.Dispatch<React.SetStateAction<boolean>>;
  type?: 'alert' | 'confirm';
  name?: string;
  text?: string;
  onFunc?: () => void;
};

const ValidationModal = ({ modalToggle, type, name, text, onFunc }: ModalProps) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{name}</h2>
        <p>{text}</p>
        <div className="modal-btns">
          <button onClick={() => modalToggle(false)}>취소</button>
          <button onClick={onFunc}>{type === 'confirm' ? '확인' : '닫기'}</button>
        </div>
      </div>
    </div>
  );
};
