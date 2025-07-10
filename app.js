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

function copyToClipboard() {
  // The email address to copy
  const email = "jacob.p.wibe@gmail.com";

  // Create a temporary textarea element to hold the email address
  const tempTextArea = document.createElement("textarea");
  tempTextArea.value = email;

  // Add the textarea to the document body and select the text
  document.body.appendChild(tempTextArea);
  tempTextArea.select();

  try {
      // Copy the text to clipboard
      document.execCommand("copy");

      // Notify the user that the email was copied
      const notification = document.getElementById("copy-notification");
      notification.style.opacity = "1"; // Show the notification

      // Hide the notification after 2 seconds
      setTimeout(() => {
          notification.style.opacity = "0";
      }, 2000);
  } catch (err) {
      console.error("Failed to copy the email address", err);
  }

  // Remove the temporary textarea
  document.body.removeChild(tempTextArea);
}


