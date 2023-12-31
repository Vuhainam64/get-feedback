import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { countTaskStatusByEmployee } from "../../api";
import Spinner from "../Spinner";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Home() {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState({});
  const [employeeStatus, setEmployeeStatus] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      const result = await countTaskStatusByEmployee();
      setLoading(false);
      setChartData(result.taskStatusCounts);
      setEmployeeStatus(result.employeeStatus);
    };

    fetchData();
  }, []);

  const data = {
    labels: Object.keys(chartData),
    datasets: [
      {
        label: "Task Status",
        data: Object.values(chartData),
        backgroundColor: [
          "rgba(75, 192, 192, 0.2)",
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 205, 86, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(153, 102, 255, 0.2)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(255, 205, 86, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        beginAtZero: true,
        stacked: true,
        ticks: {
          stepSize: 1,
          precision: 0,
        },
      },
    },
  };

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <Spinner />
        </div>
      ) : (
        <div className="flex items-center justify-center flex-col mt-16">
          <div class="grid grid-cols-2 gap-4 w-full">
            <div className="border border-gray-400">
              <div className="m-4">
                <h2 className="text-center text-2xl font-bold mb-4 text-gray-800">
                  Tasks Status
                </h2>
                <div className="w-508">
                  <Bar data={data} options={options} />
                </div>
              </div>
            </div>
            <div>
              <div class="grid grid-cols-2 gap-4">
                <div class="border border-gray-400 bg-red-400 h-44">
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center w-full">
                      <p className="text-xl text-white font-semibold">
                        {employeeStatus.totalTasksAssigned}
                      </p>
                      <p className="text-md text-white ">Task Total</p>
                    </div>
                  </div>
                </div>
                <div class="border border-gray-400 bg-sky-300 justify-center text-center h-44">
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center w-full">
                      <p className="text-xl text-white font-semibold">
                        {employeeStatus.totalTasksAssigned -
                          employeeStatus.tasksInProgress -
                          employeeStatus.taskCancel}
                      </p>
                      <p className="text-md text-white ">Finish Task</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4 mt-4">
                <div class="border border-gray-400 bg-sky-300 justify-center text-center h-44">
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center w-full">
                      <p className="text-xl text-white font-semibold">
                        {employeeStatus.tasksInProgress}
                      </p>
                      <p className="text-md text-white ">Task In Progress</p>
                    </div>
                  </div>
                </div>
                <div class="border border-gray-400 bg-red-400 justify-center text-center h-44">
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center w-full">
                      <p className="text-xl text-white font-semibold">
                        {employeeStatus.taskCancel}
                      </p>
                      <p className="text-md text-white ">Task Cancel</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Home;
