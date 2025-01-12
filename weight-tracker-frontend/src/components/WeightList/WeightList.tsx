import React, { useState } from "react";
import "./weightList.css";
import { FormControl, FormHelperText, Input } from "@mui/material";
import axios from "axios";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal.tsx";

import { WeightListProps } from "../../types/CustomTypes.tsx";

const WeightList: React.FC<WeightListProps> = ({
  weightData,
  handleTick,
  unit,
}) => {
  const [handleEdit, setHandleEdit] = useState<boolean>(false);
  const [weight, setWeight] = useState<string | number>(weightData.weight);
  const [newWeight, setNewWeight] = useState<string | number>(
    weightData.weight
  );
  const [date, setDate] = useState<string>(weightData.date);
  const [newDate, setNewDate] = useState<string>(weightData.date);
  const [dateError, setDateError] = useState<string>("");
  const [weightError, setWeightError] = useState<string>("");

  const deleteRecord = (date: string) => {
    console.log("Deleting record with date:", date);
    handleTick();
    axios
      .delete(`http://localhost:3005/weight_main_table/${date}`)
      .then((res) => {
        console.log("Record deleted successfully:", res.data);
      })
      .catch((err) => {
        console.error(
          "Error while deleting record:",
          err.response?.data || err
        );
      });
  };
