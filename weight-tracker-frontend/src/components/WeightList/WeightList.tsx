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

  const checkDateExists = async (formattedDate: string): Promise<boolean> => {
    try {
      const response = await axios.get(
        `http://localhost:3005/weight_main_table/${formattedDate}`
      );
      return response.status === 200;
    } catch (err: any) {
      if (err.response && err.response.status === 404) {
        return false;
      }
      console.error("Error checking date existence:", err);
      return false;
    }
  };

  const handleDateChange = (newValue: Dayjs | null) => {
    const formattedDate = newValue?.format("YYYY-MM-DD");
    const currentDate = dayjs();

    if (!newValue || !formattedDate) {
      setDateError("Date is required");
      return;
    }

    if (currentDate.isBefore(dayjs(formattedDate), "day")) {
      setDateError("Date cannot be in the future");
      return;
    }

    setDateError("");
    setNewDate(formattedDate);
  };

  const handleWeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;

    if (!inputValue) {
      setWeightError("Weight is required");
    }

    if (!/^\d*\.?\d{0,1}$/.test(inputValue)) {
      setWeightError("Weight must be a number with up to 1 decimal place");
      return;
    }

    const numericValue = parseFloat(inputValue);

    if (numericValue < 0) {
      setWeightError("Weight cannot be negative");
      return;
    }

    setWeightError("");
    setNewWeight(inputValue);
  };

  const saveChanges = async () => {
    if (!newWeight) {
      setWeightError("Weight is required");
      return;
    }

    if (!newDate) {
      setDateError("Date is required");
      return;
    }

    try {
      const numericNewWeight =
        typeof newWeight === "string" ? parseFloat(newWeight) : newWeight;

      const adjustedWeight =
        unit === "LBs" ? numericNewWeight / 2.20462 : numericNewWeight;

      const response = await axios.put(
        `http://localhost:3005/weight_main_table/${weightData.date}`,
        {
          weight: adjustedWeight.toFixed(1),
          date: newDate,
        }
      );
      handleTick();
      console.log("Changes saved successfully:", response.data);

      setDate(newDate);
      setWeight(adjustedWeight.toFixed(1));
      setHandleEdit(false);
    } catch (err) {
      console.error("Error saving changes:", err);
    }
  };

  return (
    <div className={"weightlist-container"}>
      {handleEdit ? (
        <>
          <div className={"weightlist-weight-reading"}>
            <FormControl fullWidth>
              <Input
                value={newWeight}
                onChange={handleWeightChange}
                type="text"
                placeholder="Enter your weight"
                inputProps={{
                  inputMode: "decimal",
                  step: "0.1",
                }}
                sx={{
                  fontSize: "16px",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  "&:hover": {
                    borderColor: "#1976d2",
                  },
                  "&:focus-within": {
                    borderColor: "#1976d2",
                    boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.2)",
                  },
                }}
              />
              {weightError && (
                <FormHelperText error>{weightError}</FormHelperText>
              )}
            </FormControl>
          </div>
          <div className={"weightlist-date-reading"}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div className={"customform-datepicker"}>
                <DatePicker
                  label="Select a date"
                  views={["year", "month", "day"]}
                  value={dayjs(newDate)}
                  onChange={handleDateChange}
                  format="YYYY-MM-DD"
                />
                {dateError && (
                  <p style={{ color: "red", marginTop: "5px" }}>{dateError}</p>
                )}
              </div>
            </LocalizationProvider>
          </div>
        </>
      ) : (
        <>
          <div className={"weightlist-weight-reading"}>
            <div className="weightlist-value-holder">
              {unit === "LBs"
                ? (Number(weight) * 2.20462).toFixed(1)
                : Number(weight).toFixed(1)}{" "}
            </div>
            <div className="weightlist-unit-holder">{unit}</div>
          </div>
          <div className={"weightlist-date-reading"}>{date}</div>
        </>
      )}

      <div className={"weightlist-button-container"}>
        {handleEdit && (
          <ConfirmationModal
            onConfirm={saveChanges}
            checkDateExists={checkDateExists}
            newWeight={weight}
            newDate={newDate}
            setWeight={setWeight}
            setDate={setDate}
          />
        )}

        <img
          src="/icons/edit.png"
          alt="delete"
          style={{ width: "30px", height: "30px", marginRight: "10px" }}
          onClick={() => setHandleEdit(!handleEdit)}
        />

        <img
          src="/icons/delete.png"
          alt="delete"
          style={{ width: "30px", height: "30px" }}
          onClick={() => deleteRecord(date)}
        />
      </div>
    </div>
  );
};

export default WeightList;
