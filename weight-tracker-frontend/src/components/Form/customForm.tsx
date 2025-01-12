import React, { useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Input, FormHelperText, FormControl, Button } from "@mui/material";

import "./customForm.css";
import axios from "axios";

import {
  CustomFormProps,
  HandleWeightChangeEvent,
  HandlePostParams,
} from "../../types/CustomTypes.tsx";

const CustomForm: React.FC<CustomFormProps> = ({ handleTick, unit }) => {
  const [date, setDate] = useState<string>("2025-01-01");
  const [dateError, setDateError] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [weightError, setWeightError] = useState<string | null>(null);

  const handleDateChange = (newValue: any) => {
    const formattedDate = newValue?.format("YYYY-MM-DD");
    const currentDate = dayjs();

    if (!newValue) {
      setDateError("Date cannot be empty");
      return;
    }

    if (formattedDate && currentDate.isBefore(dayjs(formattedDate), "day")) {
      setDateError("Date is in the future, please set a valid date");
    } else {
      setDateError("");
      setDate(formattedDate);
    }
  };
