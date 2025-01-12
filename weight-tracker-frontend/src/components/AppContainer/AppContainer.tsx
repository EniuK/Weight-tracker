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

  const handleTick: HandleTick = (): void => {
    setTick((prevTick) => !prevTick);
  };

  const getWeights = (): void => {
    axios
      .get<Weight[]>("http://localhost:3005/weight_main_table")
      .then((res) => {
        setWeights(res.data);
      });
  };
  const handleUnitChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setUnit(event.target.checked ? "LBs" : "kg");
  };
  useEffect(() => {
    getWeights();
  }, [tick]);

