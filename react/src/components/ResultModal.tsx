import "./ResultModal.css";

type Props = {
  message: string;
};

export default function ResultModal({ message }: Props) {
  return (
    <div className="modal">
      <div className="modal-contents">
        <p>{message}</p>
        <button>Play again</button>
      </div>
    </div>
  );
}
