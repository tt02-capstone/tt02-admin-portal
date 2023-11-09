import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DownOutlined, SmileOutlined, DashboardOutlined } from '@ant-design/icons';
import {Dropdown, Button, Menu, Layout, Typography, Select} from 'antd';
import 'chartjs-adapter-date-fns'; // Import the date adapter
import CustomButton from "../../components/CustomButton";
import CustomHeader from "../../components/CustomHeader";
import {Content} from "antd/es/layout/layout";
import { PlatformBookingsTimeSeries } from './PlatformBookingsTimeSeries';
import { PlatformRevenueTimeSeries } from './PlatformRevenueTimeSeries';
import { Chart as ChartJS, LineController,LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend,TimeScale} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { getData, subscribe, getSubscription, getPlatformData } from "../../redux/dataRedux";
import { set } from 'date-fns';
import { ToastContainer, toast } from 'react-toastify';

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

const TOTAL_BOOKINGS_OVER_TIME = "Platform Bookings Over Time";
const REVENUE_OVER_TIME = "Platform Revenue Over Time";
const BOOKINGS_BREAKDOWN = "Bookings Breakdown by Activity, Nationality, Age";
const REVENUE_BREAKDOWN = "Revenue Breakdown by Activity, Nationality, Age";
const CUSTOMER_RETENTION = "Customer Retention (Number of Repeat Bookings Over Time)";

const DataDashboard = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [data, setData] = useState([]);
  const [selectedDataUseCase, setSelectedDataUseCase] = useState(TOTAL_BOOKINGS_OVER_TIME);

  const dataBreadCrumb = [
    {
        title: 'Dashboard',
    }
];

  useEffect(() => {
    // Fetch user subscription status here
    const callGetData = async () => {
        try {

            let dataUseCase = selectedDataUseCase

            if (!dataUseCase) {
              dataUseCase = TOTAL_BOOKINGS_OVER_TIME;
              setSelectedDataUseCase(TOTAL_BOOKINGS_OVER_TIME);
            }

            // Replace this with your API call to fetch user subscription status
            const response = await getPlatformData(dataUseCase,  new Date(2023, 0, 1) , new Date(2023, 9, 31));
            if (response.status) {
                console.log(response.data)
                setData(response.data)

            } else {
                console.log("Wat");

            }

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    callGetData();
}, [selectedDataUseCase]);

const items = [
  {
      label: TOTAL_BOOKINGS_OVER_TIME,
      value: TOTAL_BOOKINGS_OVER_TIME
  },

  {
      label: REVENUE_OVER_TIME,
      value: REVENUE_OVER_TIME

  },
  {
      label: REVENUE_BREAKDOWN,
      value: REVENUE_BREAKDOWN

  },
  {
      label: BOOKINGS_BREAKDOWN,
      value: BOOKINGS_BREAKDOWN

  },

  {
    label: CUSTOMER_RETENTION,
    value: CUSTOMER_RETENTION

},

];


const handleChangeDataUseCase = (value) => {
  console.log(value); // { value: "lucy", label: "Lucy (101)" }
  setSelectedDataUseCase(value.value)
};
// Usage:

const returnChart = () => {
  if(selectedDataUseCase === TOTAL_BOOKINGS_OVER_TIME) {
      return  <PlatformBookingsTimeSeries data={data}/>
  } else if (selectedDataUseCase === REVENUE_OVER_TIME) {
    return <PlatformRevenueTimeSeries data={data}/>
  }
}

return (
  <Layout style={styles.layout}>
      <CustomHeader items={dataBreadCrumb}/>
      <Content style={styles.content}>
          <div>
              
                  <div>
                     

                      <div style={styles.container}>
                          <Typography.Title level={5} style={{marginRight: '10px'}}>Chart Type: </Typography.Title>
                          <Select
                              labelInValue
                              defaultValue={items[0]}
                              style={{width: 400}}
                              onChange={handleChangeDataUseCase}
                              options={items}
                          />
                      </div>


                      <br></br>
                      <br></br>
                      {returnChart()}
                       <ToastContainer />

                  </div>
              
          </div>
      </Content>
  </Layout>
);

};

export default DataDashboard;

const styles = {
layout: {
  minHeight: '100vh',
  minWidth: '90vw',
  backgroundColor: 'white'
},
content: {
  margin: '1vh 3vh 1vh 3vh',
  marginTop: -10,
  justifyContent: 'center',
  alignItems: 'center',
  marginLeft: 57,
},
container: {
  display: 'flex',
  alignItems: 'center'
},
line: {
  position: 'relative',
  margin: 'auto',
  maxWidth: '80vw',
  height: '300px',
  width: '100%'
}
}
