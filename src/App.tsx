import React from "react";
import CreditCardCalculator from "./components/CreditCardCalculator";

export interface AppConfig {
  mode: "auto" | "light" | "dark";
  transparentBackground: boolean;
  version: string;
  source: string;
}

interface AppProps {
  config: AppConfig;
}

const App: React.FC<AppProps> = ({ config }) => {
  return <CreditCardCalculator config={config} />;
};

export default App;
