// Define messages here
const splashMessages = [
    "🎉 Congrats to our Summer 2026 Winning Games: BABOOM! by Monke (1st)",
    "🎉 Congrats to our Summer 2026 Winning Games: Hot Reels by Glurima (2nd)",
    "🎉 Congrats to our Summer 2026 Winning Games: Bad Tanks by Team Strawberry (3rd)"
];

// Var to store the current message index
var splashIndex = 0;

// Rotate the splash text every 10 seconds
var x = setInterval(function () {
    switch(splashIndex) {
        case 0:
            splashIndex = 1;
            break;
        case 1:
            splashIndex = 2;
            break;
        default:
            splashIndex = 0;
    }
    document.getElementById("splash-text").innerHTML = splashMessages[splashIndex];
}, 10000);