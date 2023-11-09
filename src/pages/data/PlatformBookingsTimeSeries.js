import React, {useState, useRef, useEffect} from 'react';
import {Dropdown, Button, Menu, Layout, Select, Typography} from 'antd';
import 'chartjs-adapter-date-fns'; // Import the date adapter

import {
    Chart as ChartJS,
    LineController,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    TimeScale
} from 'chart.js';
import {Bar, Line} from 'react-chartjs-2';


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    TimeScale,
    LineController,
    Title,
    Tooltip,
    Legend
);

const WEEKLY = 'weekly';
const YEARLY = 'yearly';
const MONTHLY = 'monthly';
const NUMBER_OF_BOOKINGS = "Number of Bookings";
const NUMBER_OF_BOOKINGS_LOCAL = "Number of Bookings by Local";
const NUMBER_OF_BOOKINGS_TOURIST = "Number of Bookings by Tourist";
const NUMBER_OF_BOOKINGS_BY_COUNTRY = "Number of Bookings by Country";



export const PlatformBookingsTimeSeries = (props) => {
    const chartRef = props.chartRef;
    const data = props.data
    const [selectedXAxis, setSelectedXAxis] = useState(MONTHLY);
    const [selectedYAxis, setSelectedYAxis] = useState(NUMBER_OF_BOOKINGS);
    const [selectedDataset, setSelectedDataset] = useState([{}]);


    const itemsXAxis = [
        {
            value: MONTHLY,
            label: 'Monthly',
        },
        {
            value: WEEKLY,
            label: 'Weekly',
        },
        {
            value: YEARLY,
            label: 'Yearly',
        },

    ];

    const itemsYAxis = [
        {
            value: NUMBER_OF_BOOKINGS,
            label: NUMBER_OF_BOOKINGS,
        },
        {
            value: NUMBER_OF_BOOKINGS_LOCAL,
            label: NUMBER_OF_BOOKINGS_LOCAL,
        },
        {
            value: NUMBER_OF_BOOKINGS_TOURIST,
            label: NUMBER_OF_BOOKINGS_TOURIST,
        },
        {
            value: NUMBER_OF_BOOKINGS_BY_COUNTRY,
            label: NUMBER_OF_BOOKINGS_BY_COUNTRY,
        },

    ];

    const getRandomColor = (index) => {
        
        const colors = [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(255, 0, 0, 1)',
            'rgba(0, 255, 0, 1)',
            'rgba(0, 0, 255, 1)',
            'rgba(255, 255, 0, 1)',
            'rgba(255, 0, 255, 1)',
            'rgba(0, 255, 255, 1)',
            'rgba(128, 0, 0, 1)',
            'rgba(0, 128, 0, 1)',
            'rgba(0, 0, 128, 1)',
        ];
        console.log(index)
        const randomIndex = Math.floor(Math.random() * colors.length);
        return colors[index];
      };


      const aggregateDatafromDropdown = (data) => {
        const aggregatedData = new Map(); // Use a Map to store aggregated data by date
      
        // Loop through the data and aggregate by date
        data.forEach((item) => {
          const [date, country] = item; // ["2023-05-17", "CountryName"]
          let xAxisKey;
          if (selectedXAxis === MONTHLY) {
            xAxisKey = date.substr(0, 7); // Extract yyyy-MM part of the date
          } else if (selectedXAxis === YEARLY) {
            xAxisKey = date.substr(0, 4); // Extract yyyy part of the date
          }
      
          if (!aggregatedData.has(xAxisKey)) {
            // Initialize data for the date
            aggregatedData.set(xAxisKey, { Date: xAxisKey, Count: 0, Countries: {} });
          }
      
          // Increment the count for the date
          aggregatedData.get(xAxisKey).Count++;
      
          // Increment the count for the country within the date
          if (!aggregatedData.get(xAxisKey).Countries[country]) {
            aggregatedData.get(xAxisKey).Countries[country] = 1;
          } else {
            aggregatedData.get(xAxisKey).Countries[country]++;
          }
        });
      
        // Convert the aggregated Map back to an array of lists
        const aggregatedArray = Array.from(aggregatedData.values()).map((value) => [
          value.Date,
          value.Count,
          Object.entries(value.Countries).map(([country, count]) => [country, count]),
        ]);
      
        console.log(aggregatedArray);
      
        return aggregatedArray;
      };

      
      
      
      
    // Usage:
    console.log(data)
    const aggregatedData = aggregateDatafromDropdown(data);

    let dataset = [];

    const uniqueCountries = [...new Set(aggregatedData.flatMap((item) => item[2].map(([country]) => country)))];
    if (selectedYAxis === NUMBER_OF_BOOKINGS) {
        dataset = [
            {
                label: 'Number of Bookings',
                data: aggregatedData.map(item => item[1]),
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: false,
            },
        ]; 
      } else if (selectedYAxis === NUMBER_OF_BOOKINGS_LOCAL) {
        dataset = [
            {
              label: `Number of Bookings by Local`,
              data: aggregatedData.map((item) =>
                item[2].find(([c]) => c === 'Singapore') ? item[2].find(([c]) => c === 'Singapore')[1] : 0
              ),
              borderColor: getRandomColor(0), // You can assign a specific color for Local bookings
              borderWidth: 1,
              fill: false,
            },
          ];
      } else if (selectedYAxis === NUMBER_OF_BOOKINGS_TOURIST) {
        dataset = [
            {
              label: `Number of Bookings by Tourist`,
              data: aggregatedData.map((item) => {
                const singaporeCount = item[2].find(([c]) => c === 'Singapore');
                const totalTouristCount = item[1] - (singaporeCount ? singaporeCount[1] : 0);
                return totalTouristCount > 0 ? totalTouristCount : 0;
              }),
              borderColor: getRandomColor(0), // You can assign a specific color for Tourist bookings
              borderWidth: 1,
              fill: false,
            },
          ];
      } else if (selectedYAxis === NUMBER_OF_BOOKINGS_BY_COUNTRY) {
        dataset = aggregatedData[0][2].map(([country]) => ({
            label: `Number of Bookings in ${country}`,
            data: aggregatedData.map((item) =>
            item[2].find(([c]) => c === country) ? item[2].find(([c]) => c === country)[1] : 0
            ),
            borderColor: getRandomColor(uniqueCountries.indexOf(country)),
            borderWidth: 1,
            fill: false,
        }));
      }
    

    

    const lineData = {
        labels: aggregatedData.map((item) => item[0]), // Convert dates to strings
        datasets: dataset,
        };

    console.log(data)

    console.log(data.map(item => item[1]))

    const defaultChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'month',
                    displayFormats: {
                        month: 'yyyy-MM',
                        week: 'YYYY [W]WW', // Adjust the format for weeks
                        year: 'yyyy',
                    },
                },
            },
            y: {
                beginAtZero: true,
            },
        },
    };

    const getChartOptions = () => {
        const chartOptions = {
            ...defaultChartOptions, // Start with the default options
        };

        // Adjust time unit-specific settings
        if (selectedXAxis === WEEKLY) {
            chartOptions.scales.x.time.unit = 'week';
        } else if (selectedXAxis === YEARLY) {
            chartOptions.scales.x.time.unit = 'year';
        } else if (selectedXAxis === MONTHLY) {
            chartOptions.scales.x.time.unit = 'month';
        }

        return chartOptions;
    };

    const handleChangeXAxis = (value) => {
        console.log(value); // { value: "lucy", label: "Lucy (101)" }
        setSelectedXAxis(value.value)
    };

    const handleChangeYAxis = (value) => {
        console.log(value); // { value: "lucy", label: "Lucy (101)" }
        setSelectedYAxis(value.value)
    };



    return (
        <>

            <div style={styles.container}>
                <Typography.Title level={5} style={{marginRight: '10px'}}>X Axis: </Typography.Title>
                <Select
                    labelInValue
                    defaultValue={itemsXAxis[0]}
                    style={{width: 120}}
                    onChange={handleChangeXAxis}
                    options={itemsXAxis}
                />

            </div>
            <br></br>

            <div style={styles.container}>
                <Typography.Title level={5} style={{marginRight: '10px'}}>Y Axis: </Typography.Title>
                <Select
                    labelInValue
                    defaultValue={itemsYAxis[0]}
                    style={{width: 400}}
                    onChange={handleChangeYAxis}
                    options={itemsYAxis}
                />

            </div>


            <div ref={chartRef}  style={styles.line}>
                <Line
                    
                    data={lineData}
                    options={getChartOptions()}
                />
            </div>
        </>
    );
};


const styles = {
    layout: {
        minHeight: '100vh',
        minWidth: '90vw',
        backgroundColor: 'white'
    },
    container: {
        display: 'flex',
        alignItems: 'center'
    },
    content: {
        margin: '1vh 3vh 1vh 3vh',
        marginTop: -10,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 57,
    },
    line: {
        position: 'relative',
        margin: 'auto',
        maxWidth: '80vw',
        height: '300px',
        width: '100%'
    }
}
