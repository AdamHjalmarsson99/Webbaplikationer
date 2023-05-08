
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 8080;

app.use(express.static(path.join(__dirname + '/public')));
app.use(express.json());

app.get('/showBookedTimes', (req, res) => {
    const data = fs.readFileSync('data.json', 'utf8');
    res.end(data);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'register.html'));
});

app.get('/fEnd.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'fEnd.js'), {
    headers: {
      'Content-Type': 'text/javascript',
    }
  });
});

app.post('/add-user', (req, res) => {
    console.log('förfrågan fungerar');
    const name = req.body.name;
    const mail = req.body.mail;
    const time = req.body.time;
    const court = req.body.court;
    const day = req.body.day;

    fs.readFile('data.json', (err, data) =>{
        if (err) throw err;
        const users = JSON.parse(data);

        // Kolla om det redan är en bokning vid det tillfället
        const existingBooking = users.find(booking => booking.time === time && booking.court === court && booking.day === day);
        if (existingBooking) {
          res.status(400).send('There is already a booking at the selected time and court');
          //Om inte så skicka bokningen till arrayen i json filen
        } else {
          const newUser = {
              name : name,
              mail : mail,
              time : time,
              court : court,
              day : day
          };
          users.push(newUser);

          fs.writeFile('data.json', JSON.stringify(users), (err) =>{
            if (err) throw err;
            console.log('Booking Confirmed');
            res.status(200).send('Booking Confirmed'); 
          });
          
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});





