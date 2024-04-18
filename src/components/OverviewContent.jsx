import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import {
  FaDollarSign,
  FaUsers,
  FaTasks,
  FaMoneyBill,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import { FaDesktop, FaTabletAlt, FaMobileAlt } from "react-icons/fa";
import { Progress } from "flowbite-react";

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
        },
      ],
    };

    const doughnutData = {
      datasets: [
        {
          label: "My First Dataset",
          data: [100, 600, 100],
          backgroundColor: [
            "rgb(256, 99, 132)",
            "rgb(54, 162, 235)",
            "rgb(255, 205, 86)",
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
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });

      const doughnutChart = new Chart(doughnutChartRef.current, {
        type: "doughnut",
        data: doughnutData,
      });

      return () => {
        salesChart.destroy();
        doughnutChart.destroy();
      };
    }
  }, []);

  return (
    <div className="p-2">
      <h2 className="text-xl italic font-bold ">Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="shadow-xl p-4 rounded-md flex justify-between items-center mb-6">
          <div>
            <h3 className="text-gray-600 text-sm">Budget</h3>
            <p className="text-2xl font-bold text-gray-800">{budget}</p>
            <p className="text-sm text-gray-500">
              Since Last Month: <FaArrowUp className="text-green-500 inline" />{" "}
              10%
            </p>
          </div>
          <FaDollarSign className="text-5xl text-white bg-red-500 rounded-full p-2" />
        </div>
        <div className="shadow-xl p-4 rounded-md flex justify-between items-center mb-6">
          <div>
            <h3 className="text-gray-600 text-sm">Total Customers</h3>
            <p className="text-2xl font-bold text-gray-800">{totalCustomers}</p>
            <p className="text-sm text-gray-500">
              Since Last Month: <FaArrowDown className="text-red-500 inline" />{" "}
              5%
            </p>
          </div>
          <FaUsers className="text-5xl text-white bg-green-500 rounded-full p-2" />
        </div>
        <div className="shadow-xl p-4 rounded-md flex justify-between items-center mb-6">
          <div>
            <h3 className="text-gray-600 text-sm">Task Progress</h3>
            <span className="text-2xl font-bold text-gray-800">
              {taskProgress}%
            </span>
            <Progress
              value={taskProgress}
              max={100}
              color="bg-blue-600"
              className="w-full h-2 mb-2"
            />
          </div>
          <FaTasks className="text-5xl text-white bg-yellow-400 rounded-full p-2" />
        </div>
        <div className="shadow-xl p-4 rounded-md flex justify-between items-center mb-6">
          <div>
            <h3 className="text-gray-600 text-sm">Total Profit</h3>
            <p className="text-2xl font-bold text-gray-800">{totalProfit}</p>
          </div>
          <FaMoneyBill className="text-5xl text-white bg-blue-600 rounded-full p-2" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="w-full shadow-xl">
          <div className="p-6">
            <h3 className="text-xl text-gray-950 font-semibold mb-2">
              Sales Chart
            </h3>
            <canvas
              ref={salesChartRef}
              style={{
                maxWidth: "500px",
                maxHeight: "300px",
                width: "100%",
                height: "100%",
              }}
            ></canvas>
          </div>
        </div>
        <div className="p-4 relative shadow-xl">
          <h3 className="text-xl text-gray-950 font-semibold mb-2">
            Traffic Source
          </h3>
          <canvas
            ref={doughnutChartRef}
            style={{
              maxWidth: "500px",
              maxHeight: "250px",
              width: "100%",
              height: "100%",
            }}
          ></canvas>
          <div className="absolute bottom-2 ml-40 flex justify-center">
            <div className="flex flex-col items-center mr-6">
              <FaDesktop className="mb-1 text-2xl" />
              <span className="text-xs text-gray-950 font-bold mb-2">
                Desktop
              </span>
              <span className="text-xs">70%</span>
            </div>
            <div className="flex flex-col items-center mr-6">
              <FaTabletAlt className="mb-1 text-2xl" />
              <span className="text-xs text-gray-950 font-bold mb-2">
                Tablet
              </span>
              <span className="text-xs">20%</span>
            </div>
            <div className="flex flex-col items-center">
              <FaMobileAlt className="mb-1 text-2xl" />
              <span className="text-xs text-gray-950 font-bold mb-2">
                Phone
              </span>
              <span className="text-xs">10%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewContent;
