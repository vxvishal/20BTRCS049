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
    try {
        const response = await axios.get(process.env.TRAIN_API, {
            headers: {
                Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
            },
        });

        console.log(response)

        // This code block is filtering out the response.data array to only include trains that do not leave in the next 30 minutes.
        const trains = response.data.filter((train) => {
            const currentTime = new Date();
            const currentHours = currentTime.getHours();
            const currentMinutes = currentTime.getMinutes();

            if (Math.abs(train.departureTime.Hours - currentHours) > 1) {
                return false;
            } else if (
                Math.abs(train.departureTime.Minutes - currentMinutes) >= 30
            ) {
                return false;
            } else {
                return true;
            }
        });

        // This is sorting the array based on the ticket price, total number of tickets available and departure time.
        const sortedTrains = trains.sort((a, b) => {
            const aPrice = a.price.sleeper + a.price.AC;
            const bPrice = b.price.sleeper + b.price.AC;

            if (aPrice < bPrice) {
                return -1;
            } else if (aPrice > bPrice) {
                return 1;
            }

            const aTotalTickets = a.seatsAvailable.sleeper + a.seatsAvailable.AC;
            const bTotalTickets = b.seatsAvailable.sleeper + b.seatsAvailable.AC;

            if (aTotalTickets > bTotalTickets) {
                return -1;
            } else if (aTotalTickets < bTotalTickets) {
                return 1;
            }

            const aDepartureTime = new Date();
            aDepartureTime.setHours(
                a.departureTime.Hours,
                a.departureTime.Minutes,
                a.departureTime.Seconds
            );

            const bDepartureTime = new Date();
            bDepartureTime.setHours(
                b.departureTime.Hours,
                b.departureTime.Minutes,
                b.departureTime.Seconds
            );

            if (aDepartureTime > bDepartureTime) {
                return -1;
            } else if (aDepartureTime < bDepartureTime) {
                return 1;
            }

            return 0;
        });

        res.send(sortedTrains);
    } catch (error) {
        console.log(error);
        res.status(500).send('Server error');
    }
});

//This route returns the details the train with the given train number.
app.get('/train/trains/:trainNumber', async (req, res) => {
    const trainNumber = req.params.trainNumber;

    try {
        const response = await axios.get(
            `${process.env.TRAIN_API}/${trainNumber}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
                },
            }
        );

        const trainDetails = response.data;
        res.send(trainDetails);
    } catch (error) {
        console.log(error);
        res.status(500).send('Server error');
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});