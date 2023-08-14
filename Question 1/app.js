import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());

app.get('/', (req, res) => {
    res.send('APIs are up and running');
});

app.get('/train/trains', async (req, res) => {

    let trains = [];

    await axios.get(
        process.env.TRAIN_API,
        {
            headers: {
                Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
            }
        }
    )
        .then((response) => {
            trains = response.data;
            // filtering out trains departing in the next 30 minutes
            const filteredTrains = trains.filter(train => {
                const currentTime = new Date();
                const currentHours = currentTime.getHours();
                const currentMinutes = currentTime.getMinutes();
                // check if the departure time is in the next 30 minutes from now and ignore it if it is
                if (Math.abs(train.departureTime.Hours - currentHours) > 1) {
                    return false;
                }
                else if (Math.abs(train.departureTime.Minutes - currentMinutes) >= 30) {
                    return false;
                }

                else {
                    return true;
                }
            });

            const sortedTrains = filteredTrains.sort((a, b) => {
                // sort by ascending order of price
                if (a.price.sleeper + a.price.AC < b.price.sleeper + b.price.AC) {
                    return -1;
                }
                if (a.price.sleeper + a.price.AC > b.price.sleeper + b.price.AC) {
                    return 1;
                }

                // sort by descending order of tickets
                const aTotalTickets = a.seatsAvailable.sleeper + a.seatsAvailable.AC;
                const bTotalTickets = b.seatsAvailable.sleeper + b.seatsAvailable.AC;
                if (aTotalTickets > bTotalTickets) {
                    return -1;
                }
                if (aTotalTickets < bTotalTickets) {
                    return 1;
                }

                // sort by descending order of departure time
                const aDepartureTime = new Date();
                aDepartureTime.setHours(a.departureTime.Hours, a.departureTime.Minutes, a.departureTime.Seconds);
                const bDepartureTime = new Date();
                bDepartureTime.setHours(b.departureTime.Hours, b.departureTime.Minutes, b.departureTime.Seconds);
                if (aDepartureTime > bDepartureTime) {
                    return -1;
                }
                if (aDepartureTime < bDepartureTime) {
                    return 1;
                }

                return 0;
            });

            console.log(sortedTrains);

            // // including the trains that fulfill the allowed time windows
            // const apiResponse = sortedTrains.filter(train => {
            //     const departureTime = new Date(train.departureTime);
            //     const currentTime = new Date();
            //     const timeDiff = (departureTime.getTime() - currentTime.getTime()) / (1000 * 60);
            //     const delay = train.delay || 0;
            //     return timeDiff + delay <= 120;
            // });

            // checking with log
            console.log(sortedTrains);
            res.send(sortedTrains);
        })
        .catch((error) => {
            console.log(error);
        });
});

app.get('/train/trains/:trainNumber', async (req, res) => {
    const trainNumber = req.params.trainNumber;

    await axios.get(
        `${process.env.TRAIN_API}/${trainNumber}`,
        {
            headers: {
                Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
            }
        }
    )
        .then((response) => {
            const trainDetails = response.data;
            console.log(trainDetails);
            res.send(trainDetails);
        })
        .catch((error) => {
            console.log(error);
        });
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});