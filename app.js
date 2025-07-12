/*
function getWeatherData(location) {
    const apiKey = "452a37930b3c429384e160439230210"; // Replace with your API key
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=no`;
    return fetch(url)
      .then(response => response.json())
      .then(data => {
        const weatherData = {
          temperature: data.current.temp_c,
          condition: data.current.condition.text,
          location: data.location.name,
        };
        return weatherData;
      });
  }

function updateUI(weatherData) {
    const temperature = document.querySelector("#temperature");
    const condition = document.querySelector("#condition");
    const location = document.querySelector("#location");

    temperature.textContent = `${weatherData.temperature}°C`;
    condition.textContent = weatherData.condition;
    location.textContent = weatherData.location;
}

const searchBtn = document.querySelector("#search-btn");
const searchBar = document.querySelector("#search-bar");

searchBtn.addEventListener("click", () => {
    const location = searchBar.value;
    getWeatherData(location)
      .then(weatherData => {
        updateUI(weatherData);
      })
      .catch(error => {
        console.log(error);
      });
});
*/

console.log("Cyberpunk page loaded!");

function displayGeneratedPassword() {
  var passwordLength = document.getElementById("passwordLength").value;
  var generatedPassword = generatePassword(passwordLength);
  document.getElementById("generatedPassword").innerText = generatedPassword;
}

function generatePassword(length) {
  if (length < 1 || length > 20) {
      length = 12; // Set default length if input is out of range
  }
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var symbols = '_!)(&';
  var password = '';

  // Ensure at least one symbol is included
  password += symbols.charAt(Math.floor(Math.random() * symbols.length));
  length--;

  for (var i = 0; i < length; i++) {
      password += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  // Shuffle password to mix symbols and characters
  password = password.split('').sort(function(){return 0.5-Math.random()}).join('');

  return password;
}

// Existing app.js content (e.g., password generator if you still have it)

// Function to display temporary messages (reused from SatWeather project)
function showMessageBox(message, type = 'info') {
  const msgBox = document.getElementById('form-status'); // Target the form status div
  if (!msgBox) return; // Exit if element not found

  msgBox.textContent = message;
  msgBox.className = `message-box ${type}`; // Apply type class for styling
  msgBox.style.opacity = '1';

  setTimeout(() => {
      msgBox.style.opacity = '0';
  }, 3000); // Hide after 3 seconds
}


// Contact Form Submission Logic
document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('form-status');

  if (contactForm) { // Ensure the form element exists on the page
      contactForm.addEventListener('submit', async function(event) {
          event.preventDefault(); // Prevent default form submission

          // IMPORTANT: Replace 'YOUR_FORMSPREE_FORM_ID' with your actual Formspree ID
          const formspreeUrl = 'https://formspree.io/f/YOUR_FORMSPREE_FORM_ID';

          const formData = new FormData(contactForm);

          try {
              const response = await fetch(formspreeUrl, {
                  method: 'POST',
                  body: formData,
                  headers: {
                      'Accept': 'application/json'
                  }
              });

              if (response.ok) {
                  showMessageBox('Message sent successfully!', 'success');
                  contactForm.reset(); // Clear the form fields
              } else {
                  const data = await response.json();
                  if (data.errors) {
                      showMessageBox(`Error: ${data.errors.map(error => error.message).join(', ')}`, 'error');
                  } else {
                      showMessageBox('Oops! There was an error sending your message.', 'error');
                  }
              }
          } catch (error) {
              console.error('Network or submission error:', error);
              showMessageBox('Network error. Please try again later.', 'error');
          }
      });
  }
});



