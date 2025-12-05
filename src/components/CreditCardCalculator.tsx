import React, { useEffect, useState } from 'react';
import { IoMoon, IoSunny, IoWarning } from 'react-icons/io5';
import { AppConfig } from '../App';
import InvestmentChart from './InvestmentChart';

interface CalculatorInputs {
  monthlySpend: number;
  balanceCarriedPercent: number;
  apr: number;
}

interface InvestmentInputs {
  timePeriod: number | null;
  returnRate: number | null;
}

interface CreditCardCalculatorProps {
  config: AppConfig;
}

const CreditCardCalculator: React.FC<CreditCardCalculatorProps> = ({ config }) => {
  // Default values as specified
  const [inputs, setInputs] = useState<CalculatorInputs>({
    monthlySpend: 2000,
    balanceCarriedPercent: 50,
    apr: 23
  });

  const [investmentInputs, setInvestmentInputs] = useState<InvestmentInputs>({
    timePeriod: 10,
    returnRate: 9
  });

  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    // Detect mobile screen size
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Determine initial dark mode based on config
    let initialDarkMode = false;

    if (config.mode === 'dark') {
      initialDarkMode = true;
    } else if (config.mode === 'light') {
      initialDarkMode = false;
    } else {
      // Auto mode: check localStorage or system preference
      const savedDarkMode = localStorage.getItem('darkMode');
      if (savedDarkMode !== null) {
        initialDarkMode = savedDarkMode === 'true';
      } else {
        initialDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
    }

    setDarkMode(initialDarkMode);

    // Add loaded class after component mounts
    setTimeout(() => setIsLoaded(true), 100);
  }, [config.mode]);

  useEffect(() => {
    // Apply dark mode only to the plugin container, not the entire document
    const rootElement = document.getElementById('root');
    if (rootElement) {
      if (darkMode) {
        rootElement.setAttribute('data-theme', 'dark');
        rootElement.classList.add('dark');
      } else {
        rootElement.setAttribute('data-theme', 'light');
        rootElement.classList.remove('dark');
      }
    }

    // Only save to localStorage if in auto mode
    if (config.mode === 'auto') {
      localStorage.setItem('darkMode', darkMode.toString());
    }
  }, [darkMode, config.mode]);

  // Calculations
  // balanceCarriedPercent now represents the percentage PAID OFF
  const paidOffBalance = inputs.monthlySpend * (inputs.balanceCarriedPercent / 100);
  const carriedBalance = inputs.monthlySpend - paidOffBalance;
  const annualInterest = carriedBalance * (inputs.apr / 100);
  const monthlySavings = annualInterest / 12;

  // Calculate investment final value (same formula as InvestmentChart)
  const calculateInvestmentFinalValue = (years: number, rate: number, monthly: number) => {
    const monthlyRate = rate / 100 / 12;
    const totalMonths = years * 12;

    // Handle zero-rate case: when rate is 0%, future value is simply total contributions
    if (rate === 0 || monthlyRate === 0) {
      return Math.round(monthly * totalMonths);
    }

    // Future value of annuity formula
    const futureValue = monthly * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
    return Math.round(futureValue);
  };

  const investmentYears = investmentInputs.timePeriod ?? 10;
  const investmentRate = investmentInputs.returnRate ?? 9;
  const investmentFinalValue = calculateInvestmentFinalValue(investmentYears, investmentRate, monthlySavings);
  const totalInterestSaved = monthlySavings * 12 * investmentYears;

  const handleInputChange = (field: keyof CalculatorInputs, value: number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleInvestmentChange = (field: keyof InvestmentInputs, value: number | null) => {
    setInvestmentInputs(prev => ({ ...prev, [field]: value }));
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
  };

  // Mobile Component
  const MobileCalculatorCard = () => (
    <div className={`relative overflow-hidden rounded-lg shadow-lg`}
      style={{
        background: darkMode
          ? 'linear-gradient(to bottom right, #8b3dff, #000)'
          : 'linear-gradient(to bottom right, #ffffff, #c8a2c8)',
        border: '1px solid transparent',
        backgroundImage: darkMode
          ? 'linear-gradient(to bottom right, #8b3dff, #000), linear-gradient(to bottom right, transparent, transparent 40%)'
          : 'linear-gradient(to bottom right, #ffffff, #c8a2c8), linear-gradient(to bottom right, transparent, transparent 40%)',
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box'
      }}>
      <div className="p-6">
        {/* Title - Centered on Mobile */}
        <div className="text-center mb-6">
          <h2 className={`text-2xl font-bold mb-6 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            See what 0% APR could save you
          </h2>
        </div>

        {/* Input Fields - Stacked Vertically */}
        <div className="space-y-5 mb-6">
          {/* Monthly Credit Card Spend */}
          <div className="group/input">
            <label className={`block text-sm font-medium mb-2 ${
              darkMode ? 'text-white' : 'text-gray-700'
            }`}>
              Monthly credit card spend
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-lg text-gray-500">$</span>
              </div>
              <input
                type="number"
                value={inputs.monthlySpend || ''}
                onChange={(e) => {
                  const value = e.target.value === '' ? 0 : Number(e.target.value);
                  handleInputChange('monthlySpend', Math.max(0, value));
                }}
                onBlur={(e) => {
                  if (e.target.value === '' || Number(e.target.value) < 0) {
                    handleInputChange('monthlySpend', 0);
                  }
                }}
                className="w-full pl-8 pr-4 py-4 text-lg border border-gray-300 text-gray-900 placeholder-gray-500 rounded-md bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="2000"
              />
            </div>
          </div>

          {/* Average balance paid off each month */}
          <div className="group/input">
            <label className={`block text-sm font-medium mb-2 ${
              darkMode ? 'text-white' : 'text-gray-700'
            }`}>
              Average balance paid off each month
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-lg text-gray-500">$</span>
              </div>
              <input
                type="number"
                value={paidOffBalance || ''}
                onChange={(e) => {
                  const value = e.target.value === '' ? 0 : Number(e.target.value);
                  const newBalanceCarriedPercent = inputs.monthlySpend > 0 ? Math.min(100, (value / inputs.monthlySpend) * 100) : 0;
                  handleInputChange('balanceCarriedPercent', newBalanceCarriedPercent);
                }}
                onBlur={(e) => {
                  if (e.target.value === '' || Number(e.target.value) < 0) {
                    handleInputChange('balanceCarriedPercent', 0);
                  }
                }}
                className="w-full pl-8 pr-4 py-4 text-lg border border-gray-300 text-gray-900 placeholder-gray-500 rounded-md bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="1000"
              />
            </div>
          </div>

          {/* Balance carried over slider */}
          <div className="group/input">
            <label className={`block text-sm font-medium mb-2 ${
              darkMode ? 'text-white' : 'text-gray-700'
            }`}>
              Balance carried over: {inputs.balanceCarriedPercent.toFixed(0)}%
            </label>
            <div className="relative">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>
              <div className="relative h-3 bg-gray-200 rounded-lg overflow-hidden">
                <div
                  className="h-full rounded-lg transition-all duration-300 ease-out"
                  style={{
                    background: 'linear-gradient(90deg, #ec4899, #8b5cf6)',
                    width: `${inputs.balanceCarriedPercent}%`
                  }}
                />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={inputs.balanceCarriedPercent}
                  onChange={(e) => handleInputChange('balanceCarriedPercent', Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  aria-label="Percentage of balance carried over"
                />
              </div>
            </div>
          </div>

          {/* APR Input */}
          <div className="group/input">
            <label className={`block text-sm font-medium mb-2 ${
              darkMode ? 'text-white' : 'text-gray-700'
            }`}>
              Average interest rate each month APR on your credit card
            </label>
            <div className="relative">
              <input
                type="number"
                value={inputs.apr || ''}
                onChange={(e) => {
                  const value = e.target.value === '' ? 0 : Number(e.target.value);
                  handleInputChange('apr', Math.max(0, Math.min(100, value)));
                }}
                onBlur={(e) => {
                  if (e.target.value === '' || Number(e.target.value) < 0) {
                    handleInputChange('apr', 0);
                  }
                }}
                className="w-full px-4 py-4 text-lg border border-gray-300 text-gray-900 placeholder-gray-500 rounded-md bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="23"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-lg text-gray-500">%</span>
              </div>
            </div>
          </div>
        </div>


        {/* Bottom Summary Statement */}
        <div className="text-center px-4">
          <p className="text-lg text-white">
            You would save{' '}
            <span className="text-3xl font-bold" style={{ color: '#0067f7' }}>
              ${annualInterest.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}
            </span>
            {' '}annually, back into your pocket.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      config.transparentBackground
        ? 'bg-transparent'
        : darkMode
        ? 'bg-gray-900'
        : 'bg-gray-50'
    } ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>

      <div className="relative z-10 max-w-7xl mx-auto py-8 px-4">
        {/* Header with Dark Mode Toggle */}
        <div className="text-center mb-12">
          <div className="flex justify-between items-center mb-8">
            <div className="w-16"></div> {/* Spacer */}
            <div className="flex-1">
              <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                0% Interest Forever! Calculator
              </h1>
              <p className={`text-base md:text-lg max-w-4xl mx-auto ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Calculate your annual credit card interest costs and compare them to potential investment returns.
                Optimize your financial strategy by understanding the true cost of carrying credit card debt.
              </p>
            </div>
            {/* Only show toggle if mode is auto */}
            {config.mode === 'auto' && (
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`relative w-14 h-8 rounded-full transform transition-all duration-500 ease-in-out focus:outline-none focus:ring-4 focus:ring-opacity-50 ${
                  darkMode
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 focus:ring-purple-300'
                    : 'bg-gradient-to-r from-purple-400 to-indigo-400 focus:ring-purple-300'
                } shadow-lg hover:shadow-xl hover:scale-105`}
                title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                type="button"
              >
                {/* Toggle Circle */}
                <div
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-all duration-500 ease-in-out ${
                    darkMode ? 'translate-x-7' : 'translate-x-0'
                  }`}
                  style={{
                    willChange: 'transform'
                  }}
                >
                  <div className="flex items-center justify-center h-full w-full relative">
                    <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
                      darkMode ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
                    }`}>
                      <IoSunny className="text-yellow-500 text-base" />
                    </div>
                    <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
                      darkMode ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                    }`}>
                      <IoMoon className="text-purple-600 text-base" />
                    </div>
                  </div>
                </div>
              </button>
            )}
            {config.mode !== 'auto' && <div className="w-16"></div>} {/* Spacer when toggle hidden */}
          </div>
        </div>

        {/* Calculator and Investment Chart side by side */}
        {isMobile ? (
          <>
            <MobileCalculatorCard />
            <div className="mt-8">
              <InvestmentChart
                monthlyContribution={monthlySavings}
                annualRate={investmentInputs.returnRate ?? 9}
                maxYears={investmentInputs.timePeriod ?? 10}
                darkMode={darkMode}
                investmentInputs={investmentInputs}
                onInvestmentChange={handleInvestmentChange}
              />
            </div>
          </>
        ) : (
        <div className={`relative overflow-hidden rounded-lg shadow-lg`}
          style={{
            background: darkMode
              ? 'linear-gradient(to bottom right, #8b3dff, #000)'
              : 'linear-gradient(to bottom right, #ffffff, #c8a2c8)',
            border: '1px solid transparent',
            backgroundImage: darkMode
              ? 'linear-gradient(to bottom right, #8b3dff, #000), linear-gradient(to bottom right, transparent, transparent 40%)'
              : 'linear-gradient(to bottom right, #ffffff, #c8a2c8), linear-gradient(to bottom right, transparent, transparent 40%)',
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box'
          }}>
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Top Row - Calculator Inputs on Left, Investment Inputs and Chart on Right */}
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 mb-6 lg:mb-8">
              {/* Left Section - Calculator Inputs (1/3 width) */}
              <div className="lg:w-1/3">
                <div className="space-y-3 sm:space-y-4">
                {/* Title */}
                <h2 className={`text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  See what 0% APR could save you
                </h2>

                {/* Monthly Credit Card Spend */}
                <div className="group/input">
                  <label className={`block text-sm font-medium mb-2 ${
                    darkMode ? 'text-white' : 'text-gray-700'
                  }`}>
                    Monthly credit card spend
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-lg text-gray-500">$</span>
                    </div>
                    <input
                      type="number"
                      value={inputs.monthlySpend || ''}
                      onChange={(e) => {
                        const value = e.target.value === '' ? 0 : Number(e.target.value);
                        handleInputChange('monthlySpend', Math.max(0, value));
                      }}
                      onBlur={(e) => {
                        if (e.target.value === '' || Number(e.target.value) < 0) {
                          handleInputChange('monthlySpend', 0);
                        }
                      }}
                      className="w-full pl-8 pr-3 sm:pr-4 py-3 sm:py-4 text-base sm:text-lg border border-gray-300 text-gray-900 placeholder-gray-500 rounded-md bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="2000"
                    />
                  </div>
                </div>

                {/* Average balance paid off each month (absolute value) */}
                <div className="group/input">
                  <label className={`block text-sm font-medium mb-2 ${
                    darkMode ? 'text-white' : 'text-gray-700'
                  }`}>
                    Average balance paid off each month
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-lg text-gray-500">$</span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      value={paidOffBalance || ''}
                      onChange={(e) => {
                        const dollarAmount = e.target.value === '' ? 0 : Number(e.target.value);
                        // Calculate percentage based on dollar amount
                        if (inputs.monthlySpend > 0) {
                          const percentage = Math.round((dollarAmount / inputs.monthlySpend) * 100);
                          handleInputChange('balanceCarriedPercent', Math.min(100, Math.max(0, percentage)));
                        } else {
                          handleInputChange('balanceCarriedPercent', 0);
                        }
                      }}
                      onBlur={(e) => {
                        if (e.target.value === '' || Number(e.target.value) < 0) {
                          handleInputChange('balanceCarriedPercent', 0);
                        } else if (inputs.monthlySpend > 0) {
                          const dollarAmount = Number(e.target.value);
                          const percentage = Math.round((dollarAmount / inputs.monthlySpend) * 100);
                          if (percentage > 100) {
                            handleInputChange('balanceCarriedPercent', 100);
                          }
                        }
                      }}
                      className="w-full pl-8 pr-3 sm:pr-4 py-3 sm:py-4 text-base sm:text-lg border border-gray-300 text-gray-900 placeholder-gray-500 rounded-md bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="1000"
                    />
                  </div>
                </div>

                {/* Slider */}
                <div className="group/input">
                  <div className="flex items-center space-x-4">
                    <span className={`text-sm font-medium ${
                      darkMode ? 'text-white' : 'text-gray-700'
                    }`}>0%</span>
                    <div className="flex-1 relative">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={inputs.balanceCarriedPercent}
                        onChange={(e) => handleInputChange('balanceCarriedPercent', Number(e.target.value))}
                        className="w-full h-6 appearance-none cursor-pointer slider"
                        style={{
                          background: `linear-gradient(to right, #ec4899 0%, #ec4899 ${inputs.balanceCarriedPercent}%, #ffffff ${inputs.balanceCarriedPercent}%, #ffffff 100%)`,
                          borderRadius: '4px'
                        }}
                        aria-label="Percentage of balance carried over"
                        title={`${inputs.balanceCarriedPercent}% of balance carried over`}
                      />
                      <div className="flex justify-between text-xs mt-1">
                        <span className={darkMode ? 'text-white' : 'text-gray-500'}>25%</span>
                        <span className={darkMode ? 'text-white' : 'text-gray-500'}>50%</span>
                        <span className={darkMode ? 'text-white' : 'text-gray-500'}>75%</span>
                      </div>
                    </div>
                    <span className={`text-sm font-medium ${
                      darkMode ? 'text-white' : 'text-gray-700'
                    }`}>100%</span>
                  </div>
                </div>

                {/* Average balance paid off each month (percentage) - APR */}
                <div className="group/input">
                  <label className={`block text-sm font-medium mb-2 ${
                    darkMode ? 'text-white' : 'text-gray-700'
                  }`}>
                    Average interest rate each month APR on your credit card
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={inputs.apr || ''}
                      onChange={(e) => {
                        const value = e.target.value === '' ? 0 : Number(e.target.value);
                        handleInputChange('apr', Math.max(0, value));
                      }}
                      onBlur={(e) => {
                        if (e.target.value === '' || Number(e.target.value) < 0) {
                          handleInputChange('apr', 0);
                        }
                      }}
                      className="w-full pl-4 pr-12 py-3 sm:py-4 text-base sm:text-lg border border-gray-300 text-gray-900 placeholder-gray-500 rounded-md bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="23"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm font-medium text-gray-500">%</span>
                  </div>
                </div>

                {/* Bottom Summary Statement */}
                <div className="text-center mt-4 sm:mt-6">
                  <p className="text-base sm:text-lg text-white">
                    You would save{' '}
                    <span className="text-2xl sm:text-3xl font-bold" style={{ color: '#0067f7' }}>
                      ${annualInterest.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}
                    </span>
                    {' '}annually, back into your pocket.
                  </p>
                </div>
                </div>
              </div>

              {/* Right Section - Investment Title, Inputs, and Chart (2/3 width) */}
              <div className="lg:w-2/3">
                <div className="space-y-4">
                  {/* Title */}
                  <h2 className={`text-lg sm:text-xl md:text-2xl font-semibold mb-4 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Let's imagine you put that saved money into an investment portfolio for the next ten years
                  </h2>

                  {/* Input fields - Side by side */}
                  {investmentInputs && handleInvestmentChange && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="group/input">
                        <label className={`block text-sm font-medium mb-2 ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Investment Time Period (Years)
                        </label>
                        <input
                          type="number"
                          value={investmentInputs.timePeriod || ''}
                          onChange={(e) => {
                            const value = e.target.value === '' ? null : Number(e.target.value);
                            handleInvestmentChange('timePeriod', value);
                          }}
                          className="w-full px-3 sm:px-4 py-3 sm:py-4 text-base sm:text-lg border border-gray-300 text-gray-900 placeholder-gray-500 rounded-md bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          min="1"
                          max="30"
                          placeholder="10"
                          aria-label="Investment time period in years"
                        />
                      </div>
                      <div className="group/input">
                        <label className={`block text-sm font-medium mb-2 ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Expected Annual Return Rate (%)
                        </label>
                        <input
                          type="number"
                          value={investmentInputs.returnRate || ''}
                          onChange={(e) => {
                            const value = e.target.value === '' ? null : Number(e.target.value);
                            handleInvestmentChange('returnRate', value);
                          }}
                          className="w-full px-3 sm:px-4 py-3 sm:py-4 text-base sm:text-lg border border-gray-300 text-gray-900 placeholder-gray-500 rounded-md bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          min="0"
                          max="20"
                          step="0.1"
                          placeholder="9"
                          aria-label="Annual return rate percentage"
                        />
                      </div>
                    </div>
                  )}

                  {/* Investment Chart Section - Inside Right Div */}
                  <div className="w-full mt-6">
                    <InvestmentChart
                      monthlyContribution={monthlySavings}
                      annualRate={investmentInputs.returnRate ?? 9}
                      maxYears={investmentInputs.timePeriod ?? 10}
                      darkMode={darkMode}
                      investmentInputs={investmentInputs}
                      onInvestmentChange={handleInvestmentChange}
                      noCardWrapper={true}
                      hideTitleAndInputs={true}
                      hideSummaryAndDisclaimer={true}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Box and Disclaimer - Full Width */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6 lg:mt-8">
              {/* Summary Box matching the design */}
              <div className={`p-4 sm:p-6 rounded-lg text-center ${
                darkMode ? 'bg-white text-gray-900' : 'bg-white text-gray-700'
              }`}>
                <p className="text-sm sm:text-base md:text-lg mb-2">
                  By switching to <strong>SPZero's 0% APR card</strong>, you could save <strong style={{ color: '#0067f7' }}>${totalInterestSaved.toLocaleString()}</strong> in interest payments over the next {investmentYears} years, which if invested, could reach a value of <strong style={{ color: '#0067f7' }}>${investmentFinalValue.toLocaleString()}</strong>
                </p>
              </div>

              {/* Disclaimer */}
              <div className={`flex items-start ${darkMode ? 'text-white' : 'text-gray-600'}`}>
                <IoWarning className="text-yellow-500 text-lg mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-bold text-sm mb-1">Important Disclaimer</p>
                  <p className="text-xs leading-relaxed">
                    This is a simplified calculation for educational purposes. Assumes monthly contributions with {investmentRate}% annual return, compounded monthly.
                    Actual investment returns may vary significantly. Past performance does not guarantee future results.
                    Consider consulting with a financial advisor before making investment decisions. This tool is not financial advice.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Conclusion Card - Total Savings Over Time */}
        <div className={`relative overflow-hidden rounded-lg shadow-lg mt-8`}
          style={{
            background: darkMode
              ? 'linear-gradient(to bottom right, #8b3dff, #000)'
              : 'linear-gradient(to bottom right, #ffffff, #c8a2c8)', // White to lilac gradient
            border: '1px solid transparent',
            backgroundImage: darkMode
              ? 'linear-gradient(to bottom right, #8b3dff, #000), linear-gradient(to bottom right, transparent, transparent 40%)'
              : 'linear-gradient(to bottom right, #ffffff, #c8a2c8), linear-gradient(to bottom right, transparent, transparent 40%)', // White to lilac gradient for border
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box'
          }}>
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white text-2xl sm:text-3xl mb-4 shadow-lg">
                🎯
              </div>
              <h2 className={`text-xl sm:text-2xl md:text-3xl font-bold mb-2 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Your Financial Journey
              </h2>
              <p className={`text-sm sm:text-base md:text-base ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                See the impact of switching to SPZero over time
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Annual Savings */}
                <div className={`p-4 sm:p-6 rounded-lg ${
                  darkMode ? 'bg-gray-800/50 border border-purple-700/30' : 'bg-white border border-purple-200'
                }`}>
                <div className={`text-xs font-semibold uppercase tracking-wide mb-2 ${
                  darkMode ? 'text-purple-400' : 'text-purple-600'
                }`}>
                  Year 1 Savings
                </div>
                <div className={`text-3xl font-bold ${
                  isAnimating ? 'animate-pulse' : ''
                } ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  ${annualInterest.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </div>
                <div className={`text-xs mt-1 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Interest saved annually
                </div>
              </div>

              {/* 5 Year Savings */}
                <div className={`p-4 sm:p-6 rounded-lg ${
                  darkMode ? 'bg-gray-800/50 border border-purple-700/30' : 'bg-white border border-purple-200'
                }`}>
                <div className={`text-xs font-semibold uppercase tracking-wide mb-2 ${
                  darkMode ? 'text-purple-400' : 'text-purple-600'
                }`}>
                  5 Year Savings
                </div>
                <div className={`text-3xl font-bold ${
                  isAnimating ? 'animate-pulse' : ''
                } ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  ${(annualInterest * 5).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </div>
                <div className={`text-xs mt-1 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Total interest saved
                </div>
              </div>

              {/* Custom Period Savings */}
                <div className={`p-4 sm:p-6 rounded-lg ${
                  darkMode ? 'bg-gray-800/50 border border-purple-700/30' : 'bg-white border border-purple-200'
                }`}>
                <div className={`text-xs font-semibold uppercase tracking-wide mb-2 ${
                  darkMode ? 'text-purple-400' : 'text-purple-600'
                }`}>
                  {investmentInputs.timePeriod || 10} Year Savings
                </div>
                <div className={`text-3xl font-bold ${
                  isAnimating ? 'animate-pulse' : ''
                } ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  ${(annualInterest * (investmentInputs.timePeriod || 10)).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </div>
                <div className={`text-xs mt-1 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Total interest saved
                </div>
              </div>
            </div>

            {/* Bottom Summary */}
            <div className={`mt-6 p-6 rounded-lg text-center ${
              darkMode ? 'bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-700/30' : 'bg-gradient-to-r from-purple-100 to-indigo-100 border border-purple-300'
            }`}>
              <p className={`text-sm md:text-base mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                By switching to SPZero's 0% APR card, you could save
              </p>
              <p className={`text-2xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent ${
                isAnimating ? 'animate-pulse' : ''
              }`}>
                ${(annualInterest * (investmentInputs.timePeriod || 10)).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
              </p>
              <p className={`text-sm md:text-base mt-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                over the next {investmentInputs.timePeriod || 10} years that would have been lost to interest payments
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CreditCardCalculator;


