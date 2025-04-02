// JavaScript code to track study plan progress
// Add logic to track scroll progress, update completion status, etc.
// This file is included at the bottom of studyPlan.ejs



// // Send timely notifications
// function sendNotification(message) {
//     // Check if notifications are enabled
//     if (Notification.permission === 'granted') {
//         // Send notification
//         var notification = new Notification('Study Plan Reminder', {
//             body: message,
//         });
//     }
// }


// // Update progress display
// function updateProgressDisplay(progress) {
//     // Update progress bar or display
//     // For example:
//     document.getElementById('progressBar').style.width = progress + '%';
// }



// // Check if user has checked notification checkbox
// var notificationCheckbox = document.getElementById('notificationCheckbox');
// notificationCheckbox.addEventListener('change', function () {
//     if (notificationCheckbox.checked) {
//         // Request permission for notifications
//         Notification.requestPermission().then(function (permission) {
//             // Check if permission is granted
//             if (permission === 'granted') {
//                 console.log('Notifications enabled');
//             }
//         });
//     }
// });









// // ----- FOR CALCULATING AND DISPLAYING THE COMPLETION PROGRESS -----
// // Update progress display based on scroll progress
// window.addEventListener('scroll', function () {
//     // Calculate scroll progress
//     var scrollHeight = document.documentElement.scrollHeight;
//     var clientHeight = document.documentElement.clientHeight;
//     var scrollTop = document.documentElement.scrollTop;
//     var scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;

//     // Update progress display
//     updateProgressDisplay(scrollPercentage);
// });

// // Function to update the progress display
// function updateProgressDisplay(progress) {
//     // Update progress bar or display
//     var progressBar = document.getElementById('progressBar');
//     if (progressBar) {
//         progressBar.style.width = progress + '%'; // Assuming progress is a percentage value
//     }
// }
