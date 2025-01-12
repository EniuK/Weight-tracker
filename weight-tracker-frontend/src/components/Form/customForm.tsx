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

