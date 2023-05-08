const form = document.getElementById('user-form');
const showBknBtn = document.getElementById('showBkn');
const bookingsTableBody = document.getElementById('bookings-table-tbody');

//skapar eventlyssnare för knappen submit
form.addEventListener('submit', (event) => {
  event.preventDefault();
  //kalla på funktionen för att lägga till användare
  addUser();
  //Tömmer alla inputfält efter bokning
  form.reset();
});

//Skapa funktion för att lägga till user/bokning
async function addUser() {
  let user = {
    name: document.getElementById('nameInput').value,
    mail: document.getElementById('mailInput').value,
    time: document.getElementById('timeInput').value, 
    court : document.getElementById('courtInput').value,
    day : document.getElementById('dayInput').value,
  };

  const bookingsData = await fetch('/showBookedTimes').then(response => response.json());
  const isBookingAvailable = bookingsData.every(booking => {
    return !(booking.day === user.day && booking.time === user.time && booking.court === user.court)
  });

  if (!isBookingAvailable) {
    alert('This option is already taken!');
    return;
  }

  const response = await fetch('/add-user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  
  const jsonData = await response.json();
  console.log(jsonData);
  
  
}



// skapar en eventlyssnare för knappen som visar existerande bokningar
showBknBtn.addEventListener('click', async () => {
  // Fetch bookings data from server
  const response = await fetch('/showBookedTimes');
  const bookingsData = await response.json();
  

  
  bookingsTableBody.innerHTML = '';

  
  //Skapar nya tabellrader med existerande bokningar
  bookingsData.forEach((booking) => {
    const row = document.createElement('tr');

    const nameCell = row.insertCell();
    nameCell.classList.add('booking-name');
    nameCell.textContent = booking.name;

    const timeCell = row.insertCell();
    timeCell.classList.add('booking-time');
    timeCell.textContent = booking.time;

    const dayCell = row.insertCell();
    dayCell.classList.add('booking-day');
    dayCell.textContent = booking.day;

    const courtCell = row.insertCell();
    courtCell.classList.add('booking-court');
    courtCell.textContent = booking.court;

    
    bookingsTableBody.appendChild(row);
  });
});



