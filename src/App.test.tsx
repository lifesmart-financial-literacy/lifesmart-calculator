import { render, screen } from "@testing-library/react";
import type { AppConfig } from "./App";
import App from "./App";

const defaultConfig: AppConfig = {
  mode: "auto",
  transparentBackground: false,
  version: "1.0.0",
  source: "test",
};

test("renders the calculator component", () => {
  render(<App config={defaultConfig} />);
  // Check for a key element that should be present in the calculator
  const calculatorElement = screen.getByText(/your current card/i);
  expect(calculatorElement).toBeInTheDocument();
});
