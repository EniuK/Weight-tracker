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

  const handleWeightChange = (event: HandleWeightChangeEvent) => {
    const inputValue = event.target.value;

    if (!/^\d*\.?\d{0,1}$/.test(inputValue)) {
      setWeightError(
        "Value must be a positive number with up to 1 decimal place"
      );
      return;
    }

    const numericValue = parseFloat(inputValue);

    if (numericValue < 0) {
      setWeightError("Please provide a positive value");
      return;
    }

    setWeightError(null);
    setWeight(inputValue);
  };

  const handlePost = async ({ chosenDate, chosenWeight }: HandlePostParams) => {
    const currentDate = dayjs();
    const chosenDateChecker = dayjs(chosenDate);

    if (!chosenWeight) {
      setWeightError("Please provide a weight value");
      return;
    }

    if (currentDate.isBefore(chosenDateChecker, "day")) {
      setDateError("Date is in the future, please set a valid date");
      return;
    } else {
      setDateError("");
    }

    const convertedWeight =
      unit === "LBs"
        ? (parseFloat(chosenWeight) / 2.20462).toFixed(1)
        : chosenWeight;

    try {
      await axios
        .post(`http://localhost:3005/weight_main_table`, {
          date: chosenDate,
          weight: convertedWeight,
        })
        .then((res) => {
          console.log(res);
          setDateError("");
          setWeightError("");
          handleTick();
        });
    } catch (err) {
      console.error(err);
      setDateError("Date already exists in the system");
    }
  };

  return (
    <>
      <div className={"customform-container"}>
        <div className="customform-form">
          <FormControl fullWidth>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              <Input
                value={weight}
                onChange={handleWeightChange}
                type="text"
                placeholder={`Enter your weight in ${unit}`}
                inputProps={{
                  inputMode: "decimal",
                  step: "0.1",
                }}
                sx={{
                  fontSize: "16px",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  flexGrow: 1,
                  height: "75px",
                  "&:hover": {
                    borderColor: "#1976d2",
                  },
                  "&:focus-within": {
                    borderColor: "#1976d2",
                    boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.2)",
                  },
                }}
              />
            </div>
            {weightError ? (
              <FormHelperText error>{weightError}</FormHelperText>
            ) : (
              <FormHelperText
                style={{
                  textTransform: "uppercase",
                  fontWeight: "bold",
                  fontSize: "14px",
                  color: "#333",
                }}
              >
                {unit}
              </FormHelperText>
            )}
          </FormControl>
        </div>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div
            className={"customform-datepicker"}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              minWidth: "200px",
            }}
          >
            <DatePicker
              label="Select a date"
              views={["year", "month", "day"]}
              value={dayjs(date)}
              onChange={handleDateChange}
              format="YYYY-MM-DD"
              sx={{
                width: "100%",
                "& .MuiInputBase-root": {
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                },
              }}
            />
            {dateError && <FormHelperText error>{dateError}</FormHelperText>}
          </div>
        </LocalizationProvider>

        <div className="customForm-button-container">
          <Button
            variant={"contained"}
            color="success"
            style={{ height: "55px" }}
            onClick={() =>
              handlePost({ chosenDate: date, chosenWeight: weight })
            }
          >
            <b>ADD WEIGHT</b>
          </Button>
        </div>
      </div>
    </>
  );
};

export default CustomForm;
