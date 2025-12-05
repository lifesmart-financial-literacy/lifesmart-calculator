import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { IoWarning } from 'react-icons/io5';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface InvestmentInputs {
  timePeriod: number | null;
  returnRate: number | null;
}

interface InvestmentChartProps {
  monthlyContribution: number;
  annualRate: number;
  maxYears?: number;
  darkMode?: boolean;
  investmentInputs?: InvestmentInputs;
  onInvestmentChange?: (field: keyof InvestmentInputs, value: number | null) => void;
  noCardWrapper?: boolean;
  hideTitleAndInputs?: boolean;
  hideSummaryAndDisclaimer?: boolean;
}

const InvestmentChart: React.FC<InvestmentChartProps> = ({
  monthlyContribution,
  annualRate,
  maxYears = 10,
  darkMode = false,
  investmentInputs,
  onInvestmentChange,
  noCardWrapper = false,
  hideTitleAndInputs = false,
  hideSummaryAndDisclaimer = false
}) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  useEffect(() => {
    setIsLoaded(true);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1500);
  }, [monthlyContribution, annualRate, maxYears]);

  // Calculate investment growth for each year
  const calculateInvestmentGrowth = (years: number) => {
    const monthlyRate = annualRate / 100 / 12;
    const totalMonths = years * 12;

    // Future value of annuity formula
    const futureValue = monthlyContribution * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);

    return Math.round(futureValue);
  };

  // Generate data points for the chart
  const generateChartData = () => {
    const labels = [];
    const data = [];
    const totalInvested = [];

    for (let year = 0; year <= maxYears; year++) {
      labels.push(year.toString());
      data.push(calculateInvestmentGrowth(year));
      totalInvested.push(monthlyContribution * 12 * year);
    }

    return { labels, data, totalInvested };
  };

  const { labels, data, totalInvested } = generateChartData();
  const finalValue = data[data.length - 1] || 0;
  const finalInvested = totalInvested[totalInvested.length - 1] || 0;
  const totalGains = finalValue - finalInvested;

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Investment Value',
        data,
        borderColor: '#0067f7', // Match the blue color from the bottom text
        backgroundColor: 'rgba(0, 103, 247, 0.1)',
        borderWidth: 2,
        pointBackgroundColor: '#0067f7',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: false, // Remove fill for cleaner look
        tension: 0.2, // Less curve for simpler appearance
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart' as const,
    },
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: 'normal' as const,
          },
          color: darkMode ? '#ffffff' : '#374151',
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.95)',
        titleColor: darkMode ? '#ffffff' : '#000000',
        bodyColor: darkMode ? '#ffffff' : '#000000',
        borderColor: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: (context: any) => {
            if (context && context.length > 0 && context[0]) {
              return `Year ${context[0].label}`;
            }
            return 'Investment Data';
          },
          label: (context: any) => {
            const value = context.parsed.y;
            return `Investment Value: $${value.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Years',
          font: {
            size: 12,
            weight: 'normal' as const,
          },
          color: darkMode ? 'rgba(255, 255, 255, 0.7)' : '#6B7280',
        },
        grid: {
          display: false, // Hide vertical grid lines
          drawBorder: false,
        },
        ticks: {
          color: darkMode ? 'rgba(255, 255, 255, 0.7)' : '#6B7280',
          font: {
            size: 10,
            weight: 'normal' as const,
          },
        },
        border: {
          display: false,
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Investment Value $',
          font: {
            size: 12,
            weight: 'normal' as const,
          },
          color: darkMode ? 'rgba(255, 255, 255, 0.7)' : '#6B7280',
        },
        grid: {
          display: true,
          color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
          drawBorder: false,
        },
        ticks: {
          color: darkMode ? 'rgba(255, 255, 255, 0.7)' : '#6B7280',
          font: {
            size: 10,
            weight: 'normal' as const,
          },
          callback: function(value: any) {
            return '$' + value.toLocaleString();
          },
        },
        border: {
          display: false,
        },
        beginAtZero: true,
      },
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
    elements: {
      point: {
        hoverBackgroundColor: '#3B82F6',
        hoverBorderColor: '#ffffff',
        hoverBorderWidth: 2,
      },
    },
  };

  const content = (
    <div className={noCardWrapper ? "p-0" : "p-4 sm:p-6 lg:p-8"}>
        {!hideTitleAndInputs && (
          <>
            {/* Title */}
            <div className="text-center mb-6 sm:mb-8">
              <h2 className={`text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold mb-4 sm:mb-6 px-2 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Let's imagine you put that saved money into an investment portfolio for the next ten years
              </h2>
            </div>

            {/* Input fields side by side */}
            {investmentInputs && onInvestmentChange && !hideTitleAndInputs && (
              <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
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
                  onInvestmentChange('timePeriod', value);
                }}
                className="w-full px-3 sm:px-4 py-3 sm:py-4 text-base sm:text-lg border border-gray-300 text-gray-900 placeholder-gray-500 rounded-md bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                min="1"
                max="30"
                placeholder="10"
                aria-label="Investment time period in years"
                title="Enter the number of years for investment growth"
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
                  onInvestmentChange('returnRate', value);
                }}
                className="w-full px-3 sm:px-4 py-3 sm:py-4 text-base sm:text-lg border border-gray-300 text-gray-900 placeholder-gray-500 rounded-md bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                min="0"
                max="20"
                step="0.1"
                placeholder="9"
                aria-label="Annual return rate percentage"
                title="Enter the expected annual return rate as a percentage"
              />
            </div>
          </div>
              </>
            )}
          </>
        )}

        {/* Chart Container */}
        <div className="relative h-64 sm:h-80 lg:h-96 w-full mb-6 sm:mb-8">
          <div className="relative z-10 h-full">
            <Line data={chartData} options={options} />
          </div>
        </div>

        {/* Summary Box and Disclaimer - Side by side */}
        {!hideSummaryAndDisclaimer && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6 sm:mb-8">
            {/* Summary Box matching the design */}
            <div className={`p-4 sm:p-6 rounded-lg text-center ${
              darkMode ? 'bg-white text-gray-900' : 'bg-white text-gray-700'
            }`}>
              <p className="text-sm sm:text-base md:text-lg mb-2">
                By switching to <strong>SPZero's 0% APR card</strong>, you could save <strong style={{ color: '#0067f7' }}>${(monthlyContribution * 12 * maxYears).toLocaleString()}</strong> in interest payments over the next {maxYears} years, which if invested, could reach a value of <strong style={{ color: '#0067f7' }}>${finalValue.toLocaleString()}</strong>
              </p>
            </div>

            {/* Disclaimer */}
            <div className={`flex items-start ${darkMode ? 'text-white' : 'text-gray-600'}`}>
              <IoWarning className="text-yellow-500 text-lg mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-bold text-sm mb-1">Important Disclaimer</p>
                <p className="text-xs leading-relaxed">
                  This is a simplified calculation for educational purposes. Assumes monthly contributions with {annualRate}% annual return, compounded monthly.
                  Actual investment returns may vary significantly. Past performance does not guarantee future results.
                  Consider consulting with a financial advisor before making investment decisions. This tool is not financial advice.
                </p>
              </div>
            </div>
          </div>
        )}
    </div>
  );

  if (noCardWrapper) {
    return content;
  }

  return (
    <div className={`relative overflow-hidden rounded-lg shadow-lg`}
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
      {content}
    </div>
  );
};

export default InvestmentChart;
