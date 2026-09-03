import "./BinCreatedModal.css";

const BinCreatedModal = ({ binName, onClose, onOpenBin }) => {
	return (
		<div className="modal-overlay">
			<div className="modal-card" role="dialog" aria-modal="true">
				<h2>Bin "{binName}" successfully created!</h2>
				<div className="modal-actions">
					<button className="modal-button modal-button--secondary" type="button" onClick={onClose}>
						Close
					</button>
					<button className="modal-button modal-button--primary" type="button" onClick={onOpenBin}>
						Open New Bin
					</button>
				</div>
			</div>
		</div>
	)
};

export default BinCreatedModal;
