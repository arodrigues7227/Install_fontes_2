import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";

import { i18n } from "../../translate/i18n";
import { FormControl, TextField } from "@material-ui/core";

const ConfirmationModal = ({ title, children, open, onClose, onConfirm, keyword = "" }) => {
	const [currentKeyword, setCurrentKeyword] = useState("");
	return (
		<Dialog
			open={open}
			onClose={() => onClose(false)}
			aria-labelledby="confirm-dialog"
		>
			<DialogTitle id="confirm-dialog">{title}</DialogTitle>
			<DialogContent dividers>
				{keyword ? <Typography>{children}: <b>{keyword}</b> </Typography> : <Typography>{children}</Typography>}
				{keyword ?
					<FormControl
						variant="outlined"
						margin="dense"
					>
						<TextField
							size="small"
							name="title"
							label={i18n.t("Palavra chave")}
							variant="outlined"
							placeholder={keyword}
							value={currentKeyword}
							onChange={(e) => {
								setCurrentKeyword(e.target.value);
							}}
						/>
					</FormControl> : <></>}
			</DialogContent>
			<DialogActions>
				<Button
					variant="contained"
					onClick={() => onClose(false)}
					color="default"
				>
					{i18n.t("confirmationModal.buttons.cancel")}
				</Button>
				<Button
					disabled={!keyword ? false : keyword === currentKeyword ? false : true}
					variant="contained"
					onClick={() => {
						onClose(false);
						onConfirm();
					}}
					color="secondary"
				>
					{i18n.t("confirmationModal.buttons.confirm")}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default ConfirmationModal;
