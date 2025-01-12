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

  return (
    <div className={"app-main-container"}>
      <div>
        <h1>Weight tracker app</h1>
      </div>
      <CustomForm handleTick={handleTick} unit={unit} />

      <div
        style={{
          margin: "20px 0",
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <FormControlLabel
          control={
            <Switch
              checked={unit === "LBs"}
              onChange={handleUnitChange}
              color="primary"
            />
          }
          label={` ${unit}`}
        />
      </div>

      {sortedWeightsByDate?.map((e: Weight) => {
        return (
          <div key={e.date}>
            <WeightList
              weightData={e as WeightData}
              handleTick={handleTick}
              unit={unit}
            />
          </div>
        );
      })}
    </div>
  );
};

export default AppContainer;
