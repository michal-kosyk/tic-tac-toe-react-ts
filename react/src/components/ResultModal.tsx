import "./ResultModal.css";

type Props = {
  message: string;
  onClick(): void;
};

export default function ResultModal({ message, onClick }: Props) {
  return (
    <div className="modal">
      <div className="modal-contents">
        <p>{message}</p>
        <button onClick={onClick}>Play again</button>
      </div>
    </div>
  );
}
