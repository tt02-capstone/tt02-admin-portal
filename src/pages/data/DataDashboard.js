import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DownOutlined, SmileOutlined, DashboardOutlined } from '@ant-design/icons';
import { Row, Col, Dropdown, Button, Menu, Layout, Typography, Select, DatePicker} from 'antd';
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
import moment from "moment";
import {BookingBreakdown} from "./BookingBreakdown";
import {RevenueBreakdown} from "./RevenueBreakdown";
import { Retention } from './Retention';
import ExportModal from './ExportModal';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";


const { RangePicker } = DatePicker;



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
const BOOKINGS_BREAKDOWN = "Platform Bookings Breakdown by Category, Nationality, Status";
const REVENUE_BREAKDOWN = "Platform Revenue Breakdown by Category, Nationality, Status";
const CUSTOMER_RETENTION = "Customer Retention (Number of Repeat Bookings Over Time)";

const DataDashboard = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [data, setData] = useState([]);
  const [selectedDataUseCase, setSelectedDataUseCase] = useState(TOTAL_BOOKINGS_OVER_TIME);
  const [startDate, setStartDate] = useState(new Date(2023, 0, 1));
  const [endDate, setEndDate] = useState( new Date(2023, 9, 31));
  const [loading, setLoading] = useState(true);
  const chartRef = useRef(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    function onClickCancelManageExportButton() {
        setIsExportModalOpen(false);
    }

    function onClickManageExportButton() {
        setIsExportModalOpen(true);
    }

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
            const response = await getPlatformData(dataUseCase, startDate, endDate);
            if (response.status) {
                console.log(response.data)
                setData(response.data)
                setLoading(false)

            } else {
                console.log("Wat");
                setLoading(false)
            }

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    callGetData();
}, [selectedDataUseCase, startDate, endDate]);

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

async function onClickSubmitExport(exportDetails) {
  try {

      console.log(exportDetails);

      if (exportDetails.fileType == "pdf") {

          html2canvas(chartRef.current).then((canvas) => {
              const imgData = canvas.toDataURL("image/png");
              const pdf = new jsPDF("landscape");
              pdf.addImage(imgData, "PNG", 10, 10, 190, 100);
              pdf.save(exportDetails.fileName + ".pdf");
            });

      } else if (exportDetails.fileType == "csv") {

          if (selectedDataUseCase == TOTAL_BOOKINGS_OVER_TIME) {
              const header = "Date,Country";

              const csv = data.map((row) => row.join(",")).join("\n");

              const csvContent = header + "\n" + csv;

              const blob = new Blob([csvContent], { type: "text/csv" });

              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.style.display = "none";
              a.href = url;
              a.download = `${exportDetails.fileName}.csv`;

              document.body.appendChild(a);
              a.click();

              document.body.removeChild(a);
              URL.revokeObjectURL(url);
          }



      } else if (exportDetails.fileType == "png") {
          html2canvas(chartRef.current).then((canvas) => {
              const imgData = canvas.toDataURL(`image/${exportDetails.fileType}`);
              const a = document.createElement("a");
              a.href = imgData;
              a.download = `${exportDetails.fileName}.${exportDetails.fileType}`;
              a.click();
            });
      } else if (exportDetails.fileType == "jpeg") {
          html2canvas(chartRef.current).then((canvas) => {
              const imgData = canvas.toDataURL(`image/${exportDetails.fileType}`);
              const a = document.createElement("a");
              a.href = imgData;
              a.download = `${exportDetails.fileName}.${exportDetails.fileType}`;
              a.click();
            });

      }

      setIsExportModalOpen(false);


  } catch (error) {
      toast.error(error, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1500
      });
  }


}


const handleChangeDataUseCase = (value) => {
  setLoading(true)
  console.log(value); // { value: "lucy", label: "Lucy (101)" }
  setSelectedDataUseCase(value.value)
};
// Usage:

function onCalendarChange(dates) {
  console.log("onCalendarChange", dates);
  if (dates[0] !== null) {
      const start_time = moment(dates[0].$d);
      setStartDate(new Date(start_time))

  }

  if (dates[1] !== null) {
      const end_time = moment(dates[1].$d)
      setEndDate(new Date(end_time))
  }
}

const returnChart = () => {
  if(selectedDataUseCase === TOTAL_BOOKINGS_OVER_TIME) {
      return  <PlatformBookingsTimeSeries chartRef={chartRef} data={data}/>
  } else if (selectedDataUseCase === REVENUE_OVER_TIME) {
    return <PlatformRevenueTimeSeries chartRef={chartRef} data={data}/>
  } else if (selectedDataUseCase === BOOKINGS_BREAKDOWN) {
    return <BookingBreakdown data={data[0][0]} />
  } else if (selectedDataUseCase === REVENUE_BREAKDOWN) {
    return <RevenueBreakdown data={data[0][0]} />
  } else if (selectedDataUseCase === CUSTOMER_RETENTION) {
    return <Retention chartRef={chartRef} data={data} />
  }
}

return (
  <Layout style={styles.layout}>
      <CustomHeader items={dataBreadCrumb}/>
      <Content style={styles.content}>
          <div>
              
                  <div>
                     

                  <Row justify="space-between" style={{ marginRight: 50, marginTop: 20 }}>
                                <Col>
                                    <div style={styles.container}>
                                        <Typography.Title level={5} style={{ marginRight: 5}}>Chart Type : </Typography.Title>
                                        <Select
                                            labelInValue
                                            defaultValue={items[0]}
                                            style={{ width: 400 }}
                                            onChange={handleChangeDataUseCase}
                                            options={items}
                                        />
                                    </div>
                                </Col>
                                <Col style={{ marginLeft: 'auto', marginRight: 16 }}>
                                    <CustomButton text="Export Report" icon={<DashboardOutlined />} onClick={onClickManageExportButton} />
                                </Col>
                                
                            </Row>
                            <Row style={{marginBottom: 50, marginTop: 10}}>
                            {isExportModalOpen &&
                                <ExportModal
                                    isExportModalOpen={isExportModalOpen}
                                    onClickSubmitExport={onClickSubmitExport}
                                    onClickCancelManageExportButton={onClickCancelManageExportButton}
                                />
                            }
                            <Col>
                                    <div style={styles.container}>
                                        <Typography.Title level={5} style={{ marginRight: 5}} >Date Range : </Typography.Title>
                                        <RangePicker
                                            format="YYYY-MM-DD"
                                            onCalendarChange={onCalendarChange}
                                            // defaultValue={[moment('2023-01-01', 'YYYY-MM-DD'),moment('2023-01-15', 'YYYY-MM-DD')]}
                                        />
                                    </div>
                                </Col>
                            </Row>
                            {/*<div style={{ backgroundColor: '#ffc069', padding: '30px' }}>*/}
                                {loading? null: returnChart()}
                            {/*</div>*/}
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
