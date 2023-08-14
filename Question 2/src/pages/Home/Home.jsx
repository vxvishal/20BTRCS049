import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
// import Paper from '@mui/material/Paper';
import './styles.css';

function Home() {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_TRAIN_API}`)
            .then((res) => {
                console.log("test")
                console.log(res.data);
                setData(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    return (
        <>
            <table>
                <thead>
                    <tr>
                        <th>Train Name</th>
                        <th>Train Number</th>
                        <th>Departure Time</th>
                        <th>Sleeper Seats Available</th>
                        <th>AC Seats Available</th>
                        <th>Sleeper Price</th>
                        <th>AC Price</th>
                        <th>Delayed By</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((train) => (
                        <tr key={train.trainNumber}>
                            <td>{train.trainName}</td>
                            <td>{train.trainNumber}</td>
                            <td>
                                {train.departureTime.Hours}:{train.departureTime.Minutes}
                            </td>
                            <td>{train.seatsAvailable.sleeper}</td>
                            <td>{train.seatsAvailable.AC}</td>
                            <td>{train.price.sleeper}</td>
                            <td>{train.price.AC}</td>
                            <td>{train.delayedBy}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}

export default Home;