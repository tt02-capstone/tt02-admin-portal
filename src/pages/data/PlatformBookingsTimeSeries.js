import React, {useState, useRef, useEffect} from 'react';
import {Dropdown, Button, Menu, Layout, Select, Typography, Table, Row, Col} from 'antd';
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
import moment from "moment";


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

const WEEKLY = 'Week';
const YEARLY = 'Year';
const MONTHLY = 'Month';
const NUMBER_OF_BOOKINGS = "Number of Bookings";
const NUMBER_OF_BOOKINGS_LOCAL = "Number of Bookings by Local";
const NUMBER_OF_BOOKINGS_TOURIST = "Number of Bookings by Tourist";
const NUMBER_OF_BOOKINGS_BY_COUNTRY = "Number of Bookings by Country";
const NUMBER_OF_BOOKINGS_BY_CATEGORY = "Number of Bookings by Category";
const NUMBER_OF_BOOKINGS_BY_VENDOR = "Number of Bookings by Vendor";

export const PlatformBookingsTimeSeries = (props) => {
    const chartRef = props.chartRef;
    const data = props.data
    const [selectedXAxis, setSelectedXAxis] = useState(MONTHLY);
    const [selectedYAxis, setSelectedYAxis] = useState(NUMBER_OF_BOOKINGS);
    const [selectedDataset, setSelectedDataset] = useState([{}]);
    const [yData, setYData] = useState([]);


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
        {
            value: NUMBER_OF_BOOKINGS_BY_CATEGORY,
            label: NUMBER_OF_BOOKINGS_BY_CATEGORY,
        },
        {
            value: NUMBER_OF_BOOKINGS_BY_VENDOR,
            label: NUMBER_OF_BOOKINGS_BY_VENDOR,
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
        const aggregatedData = new Map(); 
      

        data.forEach((item) => {
          const [date, country, category, subcategory, vendor] = item; 
          let xAxisKey;
            if (selectedXAxis === MONTHLY) {
                xAxisKey = date.substr(0, 7); 
            } else if (selectedXAxis === YEARLY) {
                xAxisKey = date.substr(0, 4); 
            } else if (selectedXAxis === WEEKLY) {
                const currdate = moment(date)
                xAxisKey = currdate.clone().startOf('week').format('YYYY-MM-DD').toString()
                console.log(xAxisKey)
            }
          if (!aggregatedData.has(xAxisKey)) {

            aggregatedData.set(xAxisKey, { Date: xAxisKey, Count: 0, Countries: {}, Categories: {}, Subcategories: {}, Vendors: {} });
          }
      

          aggregatedData.get(xAxisKey).Count++;
      

          if (!aggregatedData.get(xAxisKey).Countries[country]) {
            aggregatedData.get(xAxisKey).Countries[country] = 1;
          } else {
            aggregatedData.get(xAxisKey).Countries[country]++;
          }

          if (!aggregatedData.get(xAxisKey).Categories[category]) {
            aggregatedData.get(xAxisKey).Categories[category] = 1;
          } else {
            aggregatedData.get(xAxisKey).Categories[category]++;
          }

          if (!aggregatedData.get(xAxisKey).Subcategories[subcategory]) {
            aggregatedData.get(xAxisKey).Subcategories[subcategory] = 1;
          } else {
                aggregatedData.get(xAxisKey).Subcategories[subcategory]++;
            }

            if (!aggregatedData.get(xAxisKey).Vendors[vendor]) {
                aggregatedData.get(xAxisKey).Vendors[vendor] = 1;
            }
            else {
                aggregatedData.get(xAxisKey).Vendors[vendor]++;
            }

        });
      

        const aggregatedArray = Array.from(aggregatedData.values()).map((value) => [
          value.Date,
          value.Count,
          Object.entries(value.Countries).map(([country, count]) => [country, count]),
            Object.entries(value.Categories).map(([category, count]) => [category, count]),
            Object.entries(value.Subcategories).map(([subcategory, count]) => [subcategory, count]),
            Object.entries(value.Vendors).map(([vendor, count]) => [vendor, count]),

        ]);
      
        console.log(aggregatedArray);
      
        return aggregatedArray;
      };

      
      
      
      

    console.log(data)
    const aggregatedData = aggregateDatafromDropdown(data);

    let dataset = [];

    const uniqueCountries = [...new Set(aggregatedData.flatMap((item) => item[2].map(([country]) => country)))];
    const uniqueCategories = [...new Set(aggregatedData.flatMap((item) => item[3].map(([category]) => category)))];
    const uniqueSubcategories = [...new Set(aggregatedData.flatMap((item) => item[4].map(([subcategory]) => subcategory)))];
    const uniqueVendors = [...new Set(aggregatedData.flatMap((item) => item[5].map(([vendor]) => vendor)))];

    if (selectedYAxis === NUMBER_OF_BOOKINGS) {
        dataset = [
            {
                label: 'Number of Bookings',
                data: aggregatedData.map(item => item[1]),
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: false,
                backgroundColor: 'rgba(75, 192, 192, 1)',
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
                backgroundColor: getRandomColor(0), // You can assign a specific color for Local bookings
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
              backgroundColor: getRandomColor(0), // You can assign a specific color for Tourist bookings

            },
          ];
      } else if (selectedYAxis === NUMBER_OF_BOOKINGS_BY_COUNTRY) {
        dataset = uniqueCountries.map((country) => ({
            label: `Number of Bookings in ${country}`,
            data: aggregatedData.map((item) =>
                item[2].find(([c]) => c === country) ? item[2].find(([c]) => c === country)[1] : 0
            ),
            borderColor: getRandomColor(uniqueCountries.indexOf(country)),
            borderWidth: 1,
            fill: false,
            backgroundColor: getRandomColor(uniqueCountries.indexOf(country)),
        }));
      } else if (selectedYAxis === NUMBER_OF_BOOKINGS_BY_CATEGORY) {
        dataset = uniqueCategories.map((category) => ({

            label: `Number of Bookings in ${category}`,
            data: aggregatedData.map((item) =>
                item[3].find(([c]) => c === category) ? item[3].find(([c]) => c === category)[1] : 0
            ),
            borderColor: getRandomColor(uniqueCategories.indexOf(category)),
            borderWidth: 1,
            fill: false,
            backgroundColor: getRandomColor(uniqueCategories.indexOf(category)),
        }));
        } else if (selectedYAxis === NUMBER_OF_BOOKINGS_BY_VENDOR) {
            dataset = uniqueVendors.map((vendor) => ({
                label: `Number of Bookings in ${vendor}`,
                data: aggregatedData.map((item) =>
                    item[5].find(([c]) => c === vendor) ? item[5].find(([c]) => c === vendor)[1] : 0
                ),
                borderColor: getRandomColor(uniqueVendors.indexOf(vendor)),
                borderWidth: 1,
                fill: false,
                backgroundColor: getRandomColor(uniqueVendors.indexOf(vendor)),
            }));
        }
    

    

    const lineData = {
        labels: aggregatedData.map((item) => item[0]), 
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
                        week: 'yyyy-MM-dd', // Adjust the format for weeks
                        year: 'yyyy',
                    },
                },
            },
            y: {
                beginAtZero: true,
            },
        },
    };

    const columns = [
        {
            title: selectedXAxis,
            dataIndex: 'month',
            key: 'month',
        },
        {
            title: selectedYAxis === NUMBER_OF_BOOKINGS_BY_COUNTRY? NUMBER_OF_BOOKINGS : selectedYAxis,
            dataIndex: 'total',
            key: 'total',
        },
    ];

    const expandedRowRender = (record) => {
        if (selectedYAxis == NUMBER_OF_BOOKINGS_BY_COUNTRY) {
            const nestedcolumns = [
                {
                    title: 'Country',
                    dataIndex: 'country',
                    key: 'country',
                },
                {
                    title: 'Number of Bookings',
                    dataIndex: 'count',
                    key: 'count',
                },
            ];
    
            const mappedNestedData = record.nestedData.map(([country, count], index) => ({
                key: index,
                country,
                count,
            }));

            return (
                <Table
                    columns={nestedcolumns}
                    dataSource={mappedNestedData}
                    pagination={false}
                    size="small"
                />
            );
        } else if (selectedYAxis == NUMBER_OF_BOOKINGS_BY_CATEGORY) {
            const nestedcolumns = [
                {
                    title: 'Category',
                    dataIndex: 'category',
                    key: 'category',
                },
                {
                    title: 'Number of Bookings',
                    dataIndex: 'count',
                    key: 'count',
                },
            ];
    
            const mappedNestedData = record.nestedData.map(([category, count], index) => ({
                key: index,
                category,
                count,
            }));

            return (
                <Table
                    columns={nestedcolumns}
                    dataSource={mappedNestedData}
                    pagination={false}
                    size="small"
                />
            );
        } else if (selectedYAxis == NUMBER_OF_BOOKINGS_BY_VENDOR) {
            const nestedcolumns = [
                {
                    title: 'Vendor',
                    dataIndex: 'vendor',
                    key: 'vendor',
                },
                {
                    title: 'Number of Bookings',
                    dataIndex: 'count',
                    key: 'vendor',
                },
            ];
    
            const mappedNestedData = record.nestedData.map(([vendor, count], index) => ({
                key: index,
                vendor,
                count,
            }));

            return (
                <Table
                    columns={nestedcolumns}
                    dataSource={mappedNestedData}
                    pagination={false}
                    size="small"
                />
            );
        }
        

        
    };

    const tableData = yData.map(([month, total, countries, categories, subcategories, vendors], index) => {
        let nestedData;
    
 
        if (selectedYAxis === NUMBER_OF_BOOKINGS_BY_COUNTRY) {
            nestedData = countries;
        } else if (selectedYAxis === NUMBER_OF_BOOKINGS_BY_CATEGORY) {
            nestedData = categories
        } else if (selectedYAxis === NUMBER_OF_BOOKINGS_BY_VENDOR) {

            nestedData = vendors;
        }
    
        return {
            key: index,
            month,
            total,
            nestedData, 
        };
    });

    console.log(tableData)
    

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
        updateYaxisDropdown(value.value)
    };

    useEffect(() => {
        updateYaxisDropdown(selectedYAxis);
    }, [selectedXAxis]);

    const updateYaxisDropdown = (yaxis) => {
        console.log("In y axis", yaxis)
        let newData = []
        newData = aggregatedData
        if (yaxis === NUMBER_OF_BOOKINGS) {
            newData = aggregatedData
        } else if (yaxis === NUMBER_OF_BOOKINGS_LOCAL) {
            newData = aggregatedData.filter(item => {
                console.log(item)
                const countries = Object.keys(item[2]);
                return countries.includes("Singapore");
            });
            console.log(newData)

        } else if (yaxis === NUMBER_OF_BOOKINGS_TOURIST) {
            newData = aggregatedData.filter(item => {
                const countries = Object.keys(item[2]);
                return !countries.includes("Singapore");
            });
        } else if (yaxis === NUMBER_OF_BOOKINGS_BY_COUNTRY) {
            newData = aggregatedData
        }

        setYData(newData)

    }

    useEffect(() => {
        const chart = chartRef.current;

        console.log(chart)

    }, []);




    return (
        <>
            <div ref={chartRef}>
                <Row style={{marginRight: 50}}>
                    <Col style={{marginLeft: 'auto', marginRight: 16}}>
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
                    </Col>
                    <Col>
                        <div style={styles.container}>
                            <Typography.Title level={5} style={{marginRight: '10px'}}>Y Axis: </Typography.Title>
                            <Select
                                labelInValue
                                defaultValue={itemsYAxis[0]}
                                style={{width: 300}}
                                onChange={handleChangeYAxis}
                                options={itemsYAxis}
                            />
                        </div>
                    </Col>

                </Row>

                <br></br>

                <div  style={styles.line}>
                    <Line

                        data={lineData}
                        options={getChartOptions()}
                    />
                </div>



                <br></br>

            </div>
            <Row style={{marginLeft: 30, marginTop: 20, width: '100%'}}>
                <Table dataSource={tableData} columns={columns} bordered
                       style={{
                           width: '90%',
                       }}
                       expandable={!((selectedYAxis == NUMBER_OF_BOOKINGS) || (selectedYAxis == NUMBER_OF_BOOKINGS_LOCAL) || (selectedYAxis == NUMBER_OF_BOOKINGS_TOURIST))  ? { expandedRowRender } : undefined}
                       className="ant-table ant-table-bordered ant-table-striped"
                />
            </Row>
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
