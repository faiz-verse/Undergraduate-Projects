//guess the number game!
function guess_the_number_game() {
    console.log("guess the number game!");
    let random_number = Math.round(Math.random() * 100);
    let chances = 0;
    while (chances < 10) {
        let guessed_number = prompt("Guess the number between 1 and 100 ^_^");
        
        //if prompt is cancelled!
        if (guessed_number === null) {
            alert("Game cancelled!");
            break;
        }
        guessed_number = Number(guessed_number);

        //comparisions
        if (guessed_number > random_number) {
            chances += 1;
            alert("Your guess is greater than the number! \nChances left: " + (10 - chances));
        }
        else if (guessed_number < random_number) {
            chances += 1;
            alert("Your guess is less than the number! \nChances left: " + (10 - chances));
        }
        else if (guessed_number > 100) {
            alert("Please enter a number between 1 to 100!");
        }
        else if (guessed_number == random_number) {
            alert("Your guess is correct!");
            alert("The actual number was " + random_number + "\nYou took " + chances + " chances out of 10 chances \nYour score is " + (10 - chances));
            break;
        }
        else if (chances == 10) {
            alert("You have exhausted your chances *_*");
            alert("The actual number was " + random_number);
            break;
        }
    }
    return;
}

// rock paper scissor game
function rock_paper_scissor_game() {
    console.log("Rock/Paper/Scissor game!");
    let rps = ["rock", "paper", "scissor"];
    let rps_chances = 0;
    let draws = 0;
    let player_score = 0;
    let bot_score = 0;
    while (rps_chances < 5) {

        let rps_choosen = prompt("Rock, Paper or Scissor?");
        
        //if prompt is cancelled!
        if (rps_choosen === null) {
            alert("Game cancelled!");
            break;
        }
        rps_choosen = String(rps_choosen);

        //bot's choice
        let random_rps = Math.round(Math.random() * 2);
        let bot_choice = rps[random_rps];

        //comparisions
        if (rps_choosen.toLowerCase() == bot_choice) {
            rps_chances += 1;
            draws += 1;
            alert("Its a draw! \nBot chose " + bot_choice + " \nChances left: " + (5 - rps_chances));
        }
        else if (rps_choosen.toLowerCase() == "rock" && bot_choice == "paper") {
            rps_chances += 1;
            bot_score += 1;
            alert("You lost! \nBot chose " + bot_choice + " \nChances left: " + (5 - rps_chances));
        }
        else if (rps_choosen.toLowerCase() == "rock" && bot_choice == "scissor") {
            rps_chances += 1;
            player_score += 1;
            alert("You won! \nBot chose " + bot_choice + " \nChances left: " + (5 - rps_chances));
        }
        else if (rps_choosen.toLowerCase() == "paper" && bot_choice == "scissor") {
            rps_chances += 1;
            bot_score += 1;
            alert("You lost! \nBot chose " + bot_choice + " \nChances left: " + (5 - rps_chances));
        }
        else if (rps_choosen.toLowerCase() == "paper" && bot_choice == "rock") {
            rps_chances += 1;
            player_score += 1;
            alert("You won! \nBot chose " + bot_choice + " \nChances left: " + (5 - rps_chances));
        }
        else if (rps_choosen.toLowerCase() == "scissor" && bot_choice == "rock") {
            rps_chances += 1;
            bot_score += 1;
            alert("You lost! \nBot chose " + bot_choice + " \nChances left: " + (5 - rps_chances));
        }
        else if (rps_choosen.toLowerCase() == "scissor" && bot_choice == "paper") {
            rps_chances += 1;
            player_score += 1;
            alert("You won! \nBot chose " + bot_choice + " \nChances left: " + (5 - rps_chances));
        }
    }

    // if cancelled
    if (rps_choosen === null) { alert("Game cancelled!"); }

    //displaying outcome i.e. score
    if (player_score == bot_score) {
        alert("Its a DRAW! No one won! \nTotal draws: " + draws + "\nYour score: " + player_score + "\nBot's score: " + bot_score);
    }
    else if (player_score > bot_score) {
        alert("Congratulations! You WON! \nTotal draws: " + draws + "\nYour score: " + player_score + "\nBot's score: " + bot_score);
    }
    else if (player_score < bot_score) {
        alert("Lol! You LOST! \nTotal draws: " + draws + "\nYour score: " + player_score + "\nBot's score: " + bot_score);
    }
    return;
}

