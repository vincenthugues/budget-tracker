const DeleteButton = ({
  confirmationMessage,
  onDelete,
}: {
  confirmationMessage: string;
  onDelete: Function;
}): JSX.Element => (
  <button
    onClick={() => {
      if (window.confirm(confirmationMessage)) {
        onDelete();
      }
    }}
  >
    ❌
  </button>
);

export default DeleteButton;
