import "./App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactApexCharts from "react-apexcharts";

function App() {
  const [requests, setRequests] = useState([]);
  const [options, setOptions] = useState({});
  const [series, setSeries] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://checkinn.co/api/v1/int/requests"
        );
        const requestData = response.data.requests;

        const uniqueHotelNames = [
          ...new Set(requestData.map((request) => request.hotel.name)),
        ];

        const hotelData = {};
        requestData.forEach((request) => {
          const hotelName = request.hotel.name;
          if (!hotelData[hotelName]) {
            hotelData[hotelName] = 1;
          } else {
            hotelData[hotelName]++;
          }
        });

        const chartData = Object.keys(hotelData).map((hotelName) => ({
          x: hotelName,
          y: hotelData[hotelName] || 0,
        }));

        setSeries([{ data: chartData }]);
        setOptions({
          chart: {
            id: "requests-chart",
            type: "line",
            height: 350,
          },
          xaxis: {
            categories: uniqueHotelNames,
          },
          yaxis: {
            min: 0,
            max: 8,
            tickAmount: 5,
            tickPlacement: "between",
          },
          tooltip: {
            enabled: true,
            y: {
              formatter: function (val) {
                return "Request: " + val;
              },
            },
          },
        });
        setRequests(requestData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container">
      <h1>Request Per Hotel</h1>
      <div className="chart">
        <ReactApexCharts
          options={options}
          series={series}
          type="line"
          height={350}
        />
      </div>
    </div>
  );
}

export default App;
