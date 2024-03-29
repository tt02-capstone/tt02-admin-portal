import React, {useState, useRef, useEffect} from 'react';
import {Dropdown, Button, Menu, Layout, Select, Typography, Row, Col, Table} from 'antd';
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
const TOTAL_REVENUE = "Total Revenue";
const TOTAL_REVENUE_SEGMENT = "Total Revenue from Customer Segment";
const TOTAL_REVENUE_TOURIST = "Total Revenue from  Tourist";
const TOTAL_REVENUE_BY_COUNTRY = "Total Revenue from  Country";
const TOTAL_REVENUE_BY_CATEGORY = "Total Revenue from Category";
const TOTAL_REVENUE_BY_VENDOR = "Total Revenue from  Vendor";



export const PlatformRevenueTimeSeries = (props) => {
    const chartRef = props.chartRef;
    const data = props.data
    const [selectedXAxis, setSelectedXAxis] = useState(MONTHLY);
    const [selectedYAxis, setSelectedYAxis] = useState(TOTAL_REVENUE);
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
            value: TOTAL_REVENUE,
            label: TOTAL_REVENUE,
        },
        {
            value: TOTAL_REVENUE_SEGMENT,
            label: TOTAL_REVENUE_SEGMENT,
        },
        {
            value: TOTAL_REVENUE_BY_COUNTRY,
            label: TOTAL_REVENUE_BY_COUNTRY,
        },
        {
            value: TOTAL_REVENUE_BY_CATEGORY,
            label: TOTAL_REVENUE_BY_CATEGORY,
        },
        {
            value: TOTAL_REVENUE_BY_VENDOR,
            label: TOTAL_REVENUE_BY_VENDOR,
        }

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
            const [date, country, revenue, category, subcategory, vendor] = item; 
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

                aggregatedData.set(xAxisKey, {Date: xAxisKey, Revenue: 0, Count: 0, Countries: {} , Categories: {}, Subcategories: {}, Vendors: {}});
            }


            aggregatedData.get(xAxisKey).Revenue += parseFloat(revenue);
            aggregatedData.get(xAxisKey).Count++;


            if (!aggregatedData.get(xAxisKey).Countries[country]) {
                aggregatedData.get(xAxisKey).Countries[country] = {Count: 1, Revenue: parseFloat(revenue)};
            } else {
                aggregatedData.get(xAxisKey).Countries[country].Count++;
                aggregatedData.get(xAxisKey).Countries[country].Revenue += parseFloat(revenue);
            }

            if (!aggregatedData.get(xAxisKey).Categories[category]) {
                aggregatedData.get(xAxisKey).Categories[category] = {Count: 1, Revenue: parseFloat(revenue)};
            } else {
                aggregatedData.get(xAxisKey).Categories[category].Count++;
                aggregatedData.get(xAxisKey).Categories[category].Revenue += parseFloat(revenue);
            }

            if (!aggregatedData.get(xAxisKey).Subcategories[subcategory]) {
                aggregatedData.get(xAxisKey).Subcategories[subcategory] = {Count: 1, Revenue: parseFloat(revenue)};
            } else {
                aggregatedData.get(xAxisKey).Subcategories[subcategory].Count++;
                aggregatedData.get(xAxisKey).Subcategories[subcategory].Revenue += parseFloat(revenue);
            }

            if (!aggregatedData.get(xAxisKey).Vendors[vendor]) {
                aggregatedData.get(xAxisKey).Vendors[vendor] = {Count: 1, Revenue: parseFloat(revenue)};
            } else {
                aggregatedData.get(xAxisKey).Vendors[vendor].Count++;
                aggregatedData.get(xAxisKey).Vendors[vendor].Revenue += parseFloat(revenue);
            }
        });

        console.log(Array.from(aggregatedData.values()))


        return Array.from(aggregatedData.values());
    };


    // Usage:
    console.log(data)
    const aggregatedData = aggregateDatafromDropdown(data);
    console.log(aggregatedData)
    console.log(aggregatedData.map(item => item.Revenue))
    let dataset = [];

    //const uniqueCountries = [...new Set(aggregatedData.flatMap((item) => item[2].map(([country]) => country)))];
    const uniqueCountries = [...new Set(data.map((item) => item[1]))];
    const uniqueCategories = [...new Set(data.map((item) => item[3]))];
    const uniqueVendors = [...new Set(data.map((item) => item[5]))];
    console.log(uniqueCountries);
    if (selectedYAxis === TOTAL_REVENUE) {
        dataset = [
            {
                label: 'Total Revenue',
                data: aggregatedData.map(item => item.Revenue),
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: false,
                backgroundColor: 'rgba(75, 192, 192, 1)',
            },
        ];
    } else if (selectedYAxis === TOTAL_REVENUE_SEGMENT) {

        let localDataset = {
            label: `Total Revenue from Local`,
            data: aggregatedData.map((item) => {
                if (item.Countries && item.Countries.Singapore) {
                    return item.Countries.Singapore.Revenue || 0; // Use 0 if Revenue is null or undefined
                } else {
                    return 0; // Handle the case where item.Countries.Singapore is null or undefined
                }
                }
                
            ),
            borderColor: getRandomColor(0), 
            borderWidth: 1,
            fill: false,
            backgroundColor: getRandomColor(0), 
        };
        
        let touristDataset = {
            label: `Total Revenue from Tourist`,
            data: aggregatedData.map((item) => {
                if (item.Countries && item.Countries.Singapore) {
                    const touristRevenue = item.Revenue - (item.Countries.Singapore.Revenue || 0);
                    return touristRevenue; 
                } else {
                    return item.Revenue; 
                }
            }),
            borderColor: getRandomColor(1), 
            borderWidth: 1,
            fill: false,
            backgroundColor: getRandomColor(1), 
        };
        

        let combinedDataset = [localDataset, touristDataset];

        dataset = combinedDataset
    
    } else if (selectedYAxis === TOTAL_REVENUE_TOURIST) {
        dataset = [
            {
                label: `Total Revenue from Tourist`,
                data: aggregatedData.map((item) => {
                    if (item.Countries && item.Countries.Singapore) {
                        const touristRevenue = item.Revenue - (item.Countries.Singapore.Revenue || 0);
                        return touristRevenue; 
                    } else {
                        return item.Revenue; 
                    }
                }),
                borderColor: getRandomColor(0), 
                borderWidth: 1,
                fill: false,
                backgroundColor: getRandomColor(0), 
            },
        ];
    } else if (selectedYAxis === TOTAL_REVENUE_BY_COUNTRY) {
        dataset = uniqueCountries.map((country) => {
            return {
                label: `Total Revenue from ${country}`,
                data: aggregatedData.map((item) => {
                    const countryData = item.Countries[country];
                    return countryData ? countryData.Revenue : 0;
                }),
                borderColor: getRandomColor(uniqueCountries.indexOf(country)),
                borderWidth: 1,
                fill: false,
                backgroundColor: getRandomColor(uniqueCountries.indexOf(country)),
            };
        });
    } else if (selectedYAxis === TOTAL_REVENUE_BY_CATEGORY) {
        dataset = uniqueCategories.map((category) => {
            return {
                label: `Total Revenue from ${category}`,
                data: aggregatedData.map((item) => {
                    const categoryData = item.Categories[category];
                    return categoryData ? categoryData.Revenue : 0;
                }),
                borderColor: getRandomColor(uniqueCategories.indexOf(category)),
                borderWidth: 1,
                fill: false,
                backgroundColor: getRandomColor(uniqueCategories.indexOf(category)),
            };
        });
    } else if (selectedYAxis === TOTAL_REVENUE_BY_VENDOR) {
        dataset = uniqueVendors.map((vendor) => {
            return {
                label: `Total Revenue from ${vendor}`,
                data: aggregatedData.map((item) => {
                    const vendorData = item.Vendors[vendor];
                    return vendorData ? vendorData.Revenue : 0;
                }),
                borderColor: getRandomColor(uniqueVendors.indexOf(vendor)),
                borderWidth: 1,
                fill: false,
                backgroundColor: getRandomColor(uniqueVendors.indexOf(vendor)),
            };
        });
    }


    const lineData = {
        labels: aggregatedData.map((item) => item.Date), 
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
        console.log(value); 
        setSelectedXAxis(value.value)
    };

    const handleChangeYAxis = (value) => {
        console.log(value); 
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
        if (yaxis === TOTAL_REVENUE) {
            newData = aggregatedData
        } else if (yaxis === TOTAL_REVENUE_SEGMENT) {
            newData = aggregatedData.filter(item => {
                console.log(item)
                const countries = Object.keys(item.Countries);
                return countries.includes("Singapore");
            });
            console.log(newData)

        } else if (yaxis === TOTAL_REVENUE_TOURIST) {
            newData = aggregatedData.filter(item => {
                const countries = Object.keys(item.Countries);
                return !countries.includes("Singapore");
            });
        } else if (yaxis === TOTAL_REVENUE_BY_COUNTRY) {
            newData = aggregatedData
        }

        setYData(newData)

    }

    useEffect(() => {
        const chart = chartRef.current;

        console.log(chart)

    }, []);

    const expandedRowRender = (record) => {
        if (selectedYAxis == TOTAL_REVENUE_BY_COUNTRY) {
            const nestedColumns = [
                {
                    title: 'Country',
                    dataIndex: 'country',
                    key: 'country',
                },
                {
                    title: 'Revenue',
                    dataIndex: 'revenue',
                    key: 'revenue',
                },
                {
                    title: 'Number of Bookings',
                    dataIndex: 'count',
                    key: 'count',
                },
            ];
    
            const mappedCountries = Object.entries(record.Countries).map(([country, data], index) => ({
                key: index,
                country,
                count: data.Count,
                revenue: data.Revenue.toFixed(2),
            }));
    
            return (
                <Table
                    columns={nestedColumns}
                    dataSource={mappedCountries}
                    pagination={false}
                    size="small"
                />
            );
        } else if (selectedYAxis == TOTAL_REVENUE_BY_CATEGORY) {
            const nestedColumns = [
                {
                    title: 'Category',
                    dataIndex: 'category',
                    key: 'category',
                },
                {
                    title: 'Revenue',
                    dataIndex: 'revenue',
                    key: 'revenue',
                },
                {
                    title: 'Number of Bookings',
                    dataIndex: 'count',
                    key: 'count',
                },
            ];
    
            const mappedCategories = Object.entries(record.Categories).map(([category, data], index) => ({
                key: index,
                category,
                count: data.Count,
                revenue: data.Revenue.toFixed(2),
            }));
    
            return (
                <Table
                    columns={nestedColumns}
                    dataSource={mappedCategories}
                    pagination={false}
                    size="small"
                />
            );
        } else if (selectedYAxis == TOTAL_REVENUE_BY_VENDOR) {
            console.log(record)
            const nestedColumns = [
                {
                    title: 'Vendor',
                    dataIndex: 'vendor',
                    key: 'vendor',
                },
                {
                    title: 'Revenue',
                    dataIndex: 'revenue',
                    key: 'revenue',
                },
                {
                    title: 'Number of Bookings',
                    dataIndex: 'count',
                    key: 'count',
                },
            ];
    
            const mappedVendors = Object.entries(record.Vendors).map(([vendor, data], index) => ({
                key: index,
                vendor,
                count: data.Count,
                revenue: data.Revenue.toFixed(2),
            }));
    
            return (
                <Table
                    columns={nestedColumns}
                    dataSource={mappedVendors}
                    pagination={false}
                    size="small"
                />
            );
        } else if (selectedYAxis == TOTAL_REVENUE_SEGMENT) {
            const nestedColumns = [
                {
                    title: 'Customer Segment',
                    dataIndex: 'segment',
                    key: 'segment',
                },
                {
                    title: 'Revenue',
                    dataIndex: 'revenue',
                    key: 'revenue',
                },
                {
                    title: 'Number of Bookings',
                    dataIndex: 'count',
                    key: 'count',
                },
            ];

            let localData = { count: 0, revenue: 0 };
            let touristData = { count: 0, revenue: 0 };

            Object.entries(record.Countries).forEach(([country, data]) => {
                if (country === 'Singapore') {
                    // Aggregate data for Local
                    localData.count += data.Count;
                    localData.revenue += data.Revenue;
                } else {
                    // Aggregate data for Tourist
                    touristData.count += data.Count;
                    touristData.revenue += data.Revenue;
                }
            });

            const nestedData = [];
            if (localData.count > 0) {
                nestedData.push({
                    key: 'local',
                    segment: 'Local',
                    count: localData.count,
                    revenue: localData.revenue.toFixed(2),
                });
            }
            if (touristData.count > 0) {
                nestedData.push({
                    key: 'tourist',
                    segment: 'Tourist',
                    count: touristData.count,
                    revenue: touristData.revenue.toFixed(2),
                });
            }
            
    
            return (
                <Table
                    columns={nestedColumns}
                    dataSource={nestedData}
                    pagination={false}
                    size="small"
                />
            );
        }
        
    };

    const columns = [
        {
            title: selectedXAxis,
            dataIndex: 'Date',
            key: 'Date',
        },
        {
            title: selectedYAxis === TOTAL_REVENUE_BY_COUNTRY? TOTAL_REVENUE: selectedYAxis,
            dataIndex: 'Revenue',
            key: 'Revenue',
        },
        {
            title: 'Number of Bookings',
            dataIndex: 'Count',
            key: 'Count',
        },
    ];

    const tableData = aggregatedData.map(({Date, Revenue, Count, Countries, Categories, Subcategories, Vendors}, index) => ({
        key: index,
        Date,
        Revenue: Revenue.toFixed(2),
        Count,
        Countries,
        Categories,
        Subcategories,
        Vendors
    }));


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
                       expandable={!(selectedYAxis == TOTAL_REVENUE)  ? { expandedRowRender } : undefined}
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
