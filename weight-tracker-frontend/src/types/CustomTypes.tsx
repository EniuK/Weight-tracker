import dayjs from "dayjs";

export interface CustomFormProps {
  handleTick: () => void;
  unit: Unit;
}

export interface HandleDateChangeParams {
  newValue: dayjs.Dayjs | null;
}

export interface HandleWeightChangeEvent {
  target: {
    value: string;
  };
}

export interface HandlePostParams {
  chosenDate: string;
  chosenWeight: string;
}

export interface ErrorState {
  error: boolean;
  weightError: string | null;
}

export type Unit = "kg" | "LBs";

export interface Weight {
  date: string;
  test: string | null;
  weight: number;
}

export interface WeightData {
  date: string;
  weight: number;
  test?: string | null;
}

export type HandleTick = () => void;

export interface CustomFormPropstable {
  handleTick: HandleTick;
  unit: Unit;
}

export interface WeightListProps {
  weightData: WeightData;
  handleTick: HandleTick;
  unit: Unit;
}

export interface ConfirmationModalProps {
  onConfirm: () => void;
  checkDateExists: (formattedDate: string) => Promise<boolean>;
  newWeight: string | number;
  newDate: string;
  setWeight: React.Dispatch<React.SetStateAction<string | number>>;
  setDate: React.Dispatch<React.SetStateAction<string>>;
}

export interface WeightData {
  weight: number;
  date: string;
}

export interface WeightListProps {
  weightData: WeightData;
  unit: "kg" | "LBs";
  handleTick: () => void;
}
