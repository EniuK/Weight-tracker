import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import "./confirmationModal.css";
import { ConfirmationModalProps } from "../../types/CustomTypes.tsx"; // Import typów

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  onConfirm,
  checkDateExists,
  newWeight,
  newDate,
  setWeight,
  setDate,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleClickOpen = (): void => {
    setError("");
    setOpen(true);
  };

  const handleClose = (): void => {
    setError("");
    setOpen(false);
  };

  const handleConfirm = async (): Promise<void> => {
    try {
      const dateExists = await checkDateExists(newDate);
      console.log(await checkDateExists(newDate));
      if (dateExists) {
        setError("The selected date already exists in the database. i chuj");
        return;
      }

      onConfirm();
      setWeight(newWeight);
      setDate(newDate);
      handleClose();
    } catch (err) {
      console.error("Error confirming changes:", err);
      setError("An unexpected error occurred. Please try again.");
    }
  };

