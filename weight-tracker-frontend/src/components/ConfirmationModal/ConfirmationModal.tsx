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

