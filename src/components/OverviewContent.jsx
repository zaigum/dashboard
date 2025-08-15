import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import {
  FaDollarSign,
  FaUsers,
  FaTasks,
  FaMoneyBill,
  FaArrowUp,
  FaArrowDown,
  FaDesktop,
  FaTabletAlt,
  FaMobileAlt,
} from "react-icons/fa";

const OverviewContent = ({ userData }) => {
  const [budget, setBudget] = useState("$100,000");
  const [totalCustomers, setTotalCustomers] = useState(1500);
  const [taskProgress, setTaskProgress] = useState(70);
  const [totalProfit, setTotalProfit] = useState("$50,000");

  const salesChartRef = useRef(null);
  const doughnutChartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setBudget("$120,000");
        setTotalCustomers(1700);
        setTaskProgress(85);
        setTotalProfit("$60,000");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const salesData = {
      labels: ["January", "February", "March", "April", "May", "June", "July"],
      datasets: [
        {
          label: "Sales",
          data: [100, 200, 300, 400, 500, 600, 700],
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 2,
          fill: true,
          tension: 0.4,
        },
      ],
    };

    const doughnutData = {
      labels: ["Desktop", "Tablet", "Phone"],
      datasets: [
        {
          label: "Traffic Source",
          data: [70, 20, 10],
          backgroundColor: [
            "rgb(59, 130, 246)", // blue-500
            "rgb(139, 92, 246)", // violet-500
            "rgb(249, 115, 22)", // orange-500
          ],
          hoverOffset: 4,
        },
      ],
    };

    if (salesChartRef.current && doughnutChartRef.current) {
      const salesChart = new Chart(salesChartRef.current, {
        type: "line",
        data: salesData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            x: {
              grid: {
                display: false,
              },
            },
            y: {
              beginAtZero: true,
              grid: {
                borderDash: [5, 5],
              },
            },
          },
        },
      });

      const doughnutChart = new Chart(doughnutChartRef.current, {
        type: "doughnut",
        data: doughnutData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                boxWidth: 10,
                padding: 15,
              },
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  let label = context.label || "";
                  if (label) {
                    label += ": ";
                  }
                  if (context.parsed !== null) {
                    label += context.parsed + "%";
                  }
                  return label;
                },
              },
            },
          },
        },
      });

      return () => {
        salesChart.destroy();
        doughnutChart.destroy();
      };
    }
  }, []);

  const dataCards = [
    {
      title: "Budget",
      value: budget,
      change: "10%",
      direction: "up",
      icon: <FaDollarSign />,
      color: "bg-red-500",
    },
    {
      title: "Total Customers",
      value: totalCustomers,
      change: "5%",
      direction: "down",
      icon: <FaUsers />,
      color: "bg-green-500",
    },
    {
      title: "Task Progress",
      value: `${taskProgress}%`,
      change: null,
      direction: null,
      icon: <FaTasks />,
      color: "bg-yellow-400",
      progress: true,
    },
    {
      title: "Total Profit",
      value: totalProfit,
      change: null,
      direction: null,
      icon: <FaMoneyBill />,
      color: "bg-blue-600",
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-6 italic">Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dataCards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-between transition-transform transform hover:scale-105"
          >
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                {card.title}
              </h3>
              {card.progress ? (
                <>
                  <p className="text-3xl font-bold text-gray-800 my-1">{card.value}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: card.value }}
                    ></div>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-3xl font-bold text-gray-800">{card.value}</p>
                  {card.change && (
                    <div className="flex items-center text-sm mt-1">
                      {card.direction === "up" ? (
                        <FaArrowUp className="text-green-500 mr-1" />
                      ) : (
                        <FaArrowDown className="text-red-500 mr-1" />
                      )}
                      <span
                        className={
                          card.direction === "up" ? "text-green-500" : "text-red-500"
                        }
                      >
                        {card.change}
                      </span>
                      <span className="text-gray-500 ml-1">Since last month</span>
                    </div>
                  )}
                </>
              )}
            </div>
            <div
              className={`p-3 rounded-full ${card.color} text-white text-3xl`}
            >
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Sales Chart</h3>
          <div className="h-80">
            <canvas ref={salesChartRef}></canvas>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Traffic Source</h3>
          <div className="h-80 w-full flex-grow flex items-center justify-center">
            <canvas ref={doughnutChartRef} className="max-w-xs"></canvas>
          </div>
          <div className="flex justify-center w-full mt-4 space-x-8">
            <div className="flex flex-col items-center">
              <FaDesktop className="text-2xl text-blue-500" />
              <span className="text-sm font-medium mt-1">Desktop</span>
              <span className="text-xs text-gray-500">70%</span>
            </div>
            <div className="flex flex-col items-center">
              <FaTabletAlt className="text-2xl text-violet-500" />
              <span className="text-sm font-medium mt-1">Tablet</span>
              <span className="text-xs text-gray-500">20%</span>
            </div>
            <div className="flex flex-col items-center">
              <FaMobileAlt className="text-2xl text-orange-500" />
              <span className="text-sm font-medium mt-1">Phone</span>
              <span className="text-xs text-gray-500">10%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewContent;