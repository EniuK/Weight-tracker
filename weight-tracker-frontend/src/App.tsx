import React from "react";
import AppContainer from "./components/AppContainer/AppContainer.tsx";
import "./App.css";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <AppContainer />
        </LocalizationProvider>
      </header>
    </div>
  );
}

export default App;
