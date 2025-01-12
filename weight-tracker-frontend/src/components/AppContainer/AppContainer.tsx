import React, { useEffect, useState } from "react";
import CustomForm from "../Form/customForm.tsx";
import WeightList from "../WeightList/WeightList.tsx";
import { FormControlLabel, Switch } from "@mui/material";
import axios from "axios";
import "./appContainer.css";

import {
  Weight,
  Unit,
  HandleTick,
  WeightData,
} from "../../types/CustomTypes.tsx";

const AppContainer: React.FC = () => {
  const [weights, setWeights] = useState<Weight[]>([]);
  const [tick, setTick] = useState<boolean>(true);
  const [unit, setUnit] = useState<Unit>("kg");

  const sortedWeightsByDate: Weight[] = weights.sort(
    (a: Weight, b: Weight) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
  );
