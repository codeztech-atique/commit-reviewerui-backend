const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

function sortChatData(a, b) {
   return a.time - b.time;
}

exports.jwtDecode = (jwtToken) => {
    var decoded = jwt.decode(jwtToken);
    return decoded;
}

// Split name
exports.splitName = (fullName) => {
    const nameParts = fullName.split(' ');
  
    let firstName = '';
    let lastName = '';
  
    if (nameParts.length === 1) {
      // If there's only one part, consider it as the first name.
      firstName = nameParts[0];
    } else if (nameParts.length > 1) {
      // If there are multiple parts, consider the last part as the last name.
      lastName = nameParts.pop(); // Remove and assign the last part to the last name.
      firstName = nameParts.join(' '); // Join the remaining parts as the first name.
    }
  
    return {
      firstName: firstName,
      lastName: lastName,
    };
}

exports.getFileExtension = (fileName) => {
  const lastDotIndex = fileName.lastIndexOf('.');
  if (lastDotIndex === -1) {
    return ''; // Return an empty string if there's no file extension
  }
  return fileName.slice(lastDotIndex);
}

// Regenerate the fileName
exports.getNewFileName = (fileData) => {
    // Replace special characters and emojis with underscores
    var firstWordFileName = Math.random().toString(32).substring(2, 8);
  
    // Its a first word
   
    const uuniqueId = uuidv4();
        
    // Generate an 8-character UUID
    const uniqueId =  uuniqueId.slice(0, 8);

    const extension = this.getFileExtension(fileData.file.name);
    
    // Construct the new file name
    const updatedFileName = `${firstWordFileName}_${uniqueId}${extension}`;
    return updatedFileName;
}

exports.getSubscriptionDate = () => {
  // Get the current date and time
  const currentDate = new Date();

  // Set createdAt to the current date and time (formatted as an ISO 8601 string)
  const createdAt = currentDate.toISOString();

  // Calculate the expiration date (7 days from the current date)
  const expirationDate = new Date(currentDate);
  expirationDate.setDate(currentDate.getDate() + 7);

  // Set expiresIn to the calculated expiration date (formatted as an ISO 8601 string)
  const expiresIn = expirationDate.toISOString();

  return {
    subscriptionStartDate: createdAt,
    subscriptionEndDate: expiresIn
  }
}

exports.addHoursToTotalTime = (totalTime, hoursToAdd) => {
   // Regular expression to match and extract hours, minutes, and seconds
  
   let hoursRegex = /(\d+)\s*hr/i;
   let minutesRegex = /(\d+)\s*minutes?/i;
   let secondsRegex = /(\d+)\s*seconds?/i;

  
   let totalHours = parseInt((totalTime.match(hoursRegex) || [])[1] || 0);
   let totalMinutes = parseInt((totalTime.match(minutesRegex) || [])[1] || 0);
   let totalSeconds = parseInt((totalTime.match(secondsRegex) || [])[1] || 0);

   console.log(totalHours, totalMinutes, totalSeconds)
 
   // Add the hours you want to add
   totalHours += hoursToAdd;

  
  // Format the new totalTime string
  let newTotalTime = '';
 
  if (totalHours > 0) {
     newTotalTime += `${totalHours} hr`;
     if (totalMinutes > 0 || totalSeconds > 0) {
       newTotalTime += ' ';
     }
  }
  if (totalMinutes > 0) {
     newTotalTime += `${totalMinutes} minute${totalMinutes > 1 ? 's' : ''}`;
     if (totalSeconds > 0) {
       newTotalTime += ' ';
     }
  }
  if (totalSeconds > 0) {
     newTotalTime += `${totalSeconds} second${totalSeconds > 1 ? 's' : ''}`;
  }

  return newTotalTime;
}

exports.isTimeGreaterThanFiveMinutes = (timeString) => {
  // Regular expressions to match hours, minutes, and seconds
  const hoursRegExp = /(\d+)\s*hr/;
  const minutesRegExp = /(\d+)\s*minutes?/;
  const secondsRegExp = /(\d+)\s*seconds?/;

  // Initialize variables for hours, minutes, and seconds
  let hours = 0;
  let minutes = 0;
  let seconds = 0;

  // Extract hours, minutes, and seconds from the input string
  const hoursMatch = hoursRegExp.exec(timeString);
  if (hoursMatch) {
    hours = parseInt(hoursMatch[1]);
  }

  const minutesMatch = minutesRegExp.exec(timeString);
  if (minutesMatch) {
    minutes = parseInt(minutesMatch[1]);
  }

  const secondsMatch = secondsRegExp.exec(timeString);
  if (secondsMatch) {
    seconds = parseInt(secondsMatch[1]);
  }

  // Calculate the total time in seconds
  const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;

  // Check if the total time is greater than 5 minutes (300 seconds)
  return totalTimeInSeconds > 300;
}

exports.formattedCustomerSubscription_Details = (data) => {
  const subscriptionName = data.subscriptionName;
  let subscriptionDetails = "";

  // Add subscription details based on subscriptionName
  switch (subscriptionName) {
    case "Freemium-USD-Daily":
      subscriptionDetails = "Trail (for 7 days)";
      break;
    case "Base-Plan-Monthly":
      subscriptionDetails = "Base (for 30 days)";
      break;
    case "Pro-Plan-Monthly":
      subscriptionDetails = "Pro (for 30 days)";
      break;
    case "Enterprise-Plan-Monthly":
        subscriptionDetails = "Enterprise (for 30 days)";
        break;
    default:
      subscriptionDetails = "Unknown subscription";
  }

  let formattedTime = data.totalTime;

  if (data.totalTime.includes('minutes')) {
    formattedTime = formattedTime.replace('minutes', 'min');
  }

  if (data.totalTime.includes('seconds')) {
    formattedTime = formattedTime.replace('seconds', 'sec');
  }

  data.subscriptionName = subscriptionDetails;
  data.totalTime = formattedTime;

  return data;
}