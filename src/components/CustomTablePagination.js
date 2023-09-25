import React, { useState } from "react";
import { Radio, Space, Table, Tag } from 'antd';

export default function CustomTablePagination(props) {

    // data --> actual data to be put in table. Must be in [{}, {}] format
    // showHeader --> true / false to show table header text
    // rowKey --> add the id in
    // style --> css style
    // column --> header for each column
    // e.g.
    // const column = [
    //     {
    //         title: 'Allowed Portal Access',
    //         dataIndex: 'is_blocked',
    //         key: 'is_blocked',
    //         rowKey: 'user_id',
    //         render: (text, record) => {
    //             if (text === "true") {
    //                 return <p>No</p>
    //             } else {
    //                 return <p>Yes</p>
    //             }
    //         }
    //     },
    // ];

    const pagination = {
        pageSize: 10,
    }

    return(
        <div>
            <Table
                style={props.style}
                bordered={true}
                columns={props.column}
                tableLayout="fixed"
                rowKey={props.rowKey}
                pagination={pagination} 
                dataSource={props.data} />
        </div>
    )
}