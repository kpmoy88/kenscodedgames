/* 
 * Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 * 
 * Made by Kenneth Moy, kpmoy88@gmail.com, Bronx, New York, 06.2014
 */

 
$('.playgame').click(startgame);

$('.highlowgame').hide();
$('.compArea .compbet').hide();
$('.userArea .userbet').hide();
$('.rollArea').hide();
$('.outcome').hide();
$('.roundMenu').hide();
$('.endgame').hide();

$('.startgame').show();

$('.move h3').click(selectMove);
$('.submitBet h2').click(submitBet);
$('.rollDice').click(playRound);
$('.quit a').click(quitGame);
$('.continue').click(setUpRound);
$('.replay a').click(restartGame);

$(window).bind("resize", function(){ //Adjusts HTML elemnets when browser is resized
        formatWindow();
    });
$(window).trigger('resize.simplemodal'); 
startScreenSpinDice(); // Start Spinning Dice on Start Screen


$('.okay').click(function() { 
    $.unblockUI();  // Unblocks the modal on screen
}); 

// Variables for Game Summary
var roundNum = 0; // Number of Rounds
var userHighBal = 0;
var userHighBet = 0;
var compHighBal = 0;
var compHighBet = 0;

// Variables for in-game
var startBalance = "1000";
var compName = "";
var userName = "";

function startgame() {
	$('.startgame').toggle();
    gameSetUp(startBalance);
    resetDieImage();
	$('.highlowgame').toggle();
}

function gameSetUp(balance) {
    setText('.compBalance', balance);
    setText('.userBalance', balance);
    userHighBal = getUserBalNum();
    compHighBal = getCompBalNum();
    userName = getUserName();
    compName = getCompName();
    setText('.userName', userName+"\'s");
    setText('.compName', compName+"\'s");
}

// Reset all variables, fields and areas for a new game session
function restartGame() {
    roundNum = 0;
    userHighBal = 0;
    userHighBet = 0;
    compHighBal = 0;
    compHighBet = 0;
    setText('.compBalance', startBalance);
    setText('.userBalance', startBalance);
    userHighBal = getUserBalNum();
    compHighBal = getCompBalNum();
    setText('.userName', userName);
    setText('.compName', compName);
    resetTextInfo();
    resetDieImage();
    resetAnimateDice();
    resetBetScreen();
    $('.compbet').toggle();
    $('.userbet').toggle();
    $('.betArea').toggle();
    $('.outcome').toggle();
    $('.roundMenu').toggle();
    $('.endgame').toggle();
    $('.highlowgame').toggle();
}

// Highlights selected Bet Type when User Clicks
function selectMove() {
    var betType = $(this).children().attr('href'); // Get selected Bet Type
    $(this).parent().siblings().children().removeClass('on'); // Remove 'on' if previously selected
    $(this).addClass('on'); 
}

// After User sumbits Bet, generates bet for Computer and displays both bets on screen
function submitBet() {
    var betAmount = $('.inputBet').val();
    if(checkBetType()) {
        if(checkAmountEmpty(betAmount)) {
            if(checkAmountNumeric(betAmount)) {
                if(checkInteger(betAmount)) {
                    if(checkAmountToBalance(betAmount)) {
                        getCompBet(); // Give computer a bet
                        $('.compbet').toggle();
                        getUserBet(parseInt(betAmount)); // Take User input and fill text fields
                        $('.userbet').toggle();
                        $('.betArea').toggle();
                        $('.inputBet').val(''); // Empty Bet Amount field
                        $('.move li').children().removeClass('on') // Clear Bet Type field
                        formatBetScreen();
                        $('.rollArea').toggle();
                        checkHighBet();
                        setDiceRoll();
                    }
                }
            }
        }
    }
}

// Set HTML element with content
function setText(htmlElement,content) {
    $(htmlElement).text(content);
}

// Generate Computer's Bet and set HTML content
function getCompBet() {
    setText('.compBetType', generateBetType()); // Set HTML elements with Computer's Bet Type
    var compBet = generateBetAmount(getCompBalNum());
    setText('.compBalance', (getCompBalNum() - compBet)); // Set HTML elements with Computer's Balance minus Bet Amount
    setText('.compBetAmount', compBet); // Set HTML elements with Computer's Bet Amount
}

// Get User's Bet from fields and set HTML content
function getUserBet(betAmount) {
    setText('.userBetType', $('.move').find('.on').attr('id')); // Set HTML elements with User's Bet Type
    setText('.userBalance', (getUserBalNum() - betAmount)); // Set HTML elements with User's Balance minus Bet Amount
    setText('.userBetAmount', betAmount); // Set HTML elements with User's Bet Amount
}

// Set Dice images to the sides of the window
function setDiceRoll() {
    $('.dice').addClass('roll');
    $('#dice1').addClass('roll');
    $('#dice2').addClass('roll');
}

// Generate dice rolls and display outcome
function playRound() {
    var numRand1 = Math.floor(Math.random()*6)+1;
    var numRand2 = Math.floor(Math.random()*6)+1;

    placeDieImage('#dice1',numRand1);
    placeDieImage('#dice2',numRand2);

    $('.rollArea').toggle();

    // Move dice inwards
    var percent = getAnimatePercent()
    var rollWidth = $( window ).width()*percent;
    $('#dice1').animate({ marginLeft: "+="+rollWidth});  
    $('#dice2').animate({ marginRight: "+="+rollWidth});

    awardPayoffs(numRand1, numRand2);
    checkHighBalance();
    roundNum++;
    if(!checkWinLose()) {
        $('.outcome').toggle();
        $('.roundMenu').toggle();
    }
}

// Calculate the bet type for the round and reward payoffs
function awardPayoffs(die1, die2) {
    var betType = convertBet(die1+die2);
    $('.diceInfo').text("The dice total is " + (die1+die2) + ".");
    $('.roundInfo').text("This round goes to " + betType + ".");
    setPayOff("comp", $('.compBetType').text(), betType, parseInt($('.compBetAmount').text()));
    setPayOff("user", $('.userBetType').text(), betType, parseInt($('.userBetAmount').text()));
}

//  Sets information fields to be displayed
function setPayOff(player, playerBetType, betTypeRound, betAmount) {
    if(player == "comp") {
        name = compName;
    } else {
        name = userName;
    }
    var prevBalance = $('.' + player + 'Balance').text(); // Get current balance
    $('.' + player + 'Bet').text(name + " bets " + betAmount + " on " + playerBetType + ".");
    if(playerBetType != betTypeRound) {
        $('.' + player + 'Info').text(name + " loses this bet.");
        $('.' + player + 'Money').text(name + " is rewarded no money, balance remains at " + prevBalance + ".");
    } else {
        $('.' + player + 'Info').text(name + " wins this bet.");
        var payoff = calculatePayOff(playerBetType, betAmount); // Calculate payoff of winning bets
        setText('.' + player + 'Balance', (parseInt($('.' + player + 'Balance').text()) + payoff)); // Set HTML elements with User's Balance with Payoff
        $('.' + player + 'Money').text(name + " is rewarded " + payoff + ".");
        $('.' + player + 'BalanceInfo').text(name + "\'s previous balance was " + prevBalance + ",\n the current balance is " + $('.' + player + 'Balance').text()  + ".");
    }
}

// Determine if a Win or Lose condition has occurred
function checkWinLose() {
    if(getCompBalNum() == 0 && getUserBalNum() == 0) {
        endGame("tie");
        return true;
    } else if(getCompBalNum() == 0) {
        endGame("win");
        return true;
    } else if (getUserBalNum() == 0) {
        endGame("lose");
        return true;
    } else {
        return false;
    }
}

// Calculates payoff based on Payoff odds (Low & High: 1:1, Seven: 4:1)
function calculatePayOff(playerBetType, betAmount) {
    if(playerBetType == "seven") {
        return ((betAmount * 4) + betAmount); // Payoff of 4:1
    } else {
        return (betAmount * 2); // Payoff of 1:1
    }
}

// Restart areas for new round
function setUpRound() {
    $('.compbet').toggle();
    $('.userbet').toggle();
    $('.outcome').toggle();
    $('.roundMenu').toggle();
    resetAnimateDice();
    resetDieImage();
    resetTextInfo();
    $('.betArea').toggle();
    formatBetScreen();
}

// Get end screen with quit wording
function quitGame() {
    endGame("quit");
}

// Display End Screen on Quit, Win or Lose with Game Summary
function endGame(endState) {
    if(endState == "quit") {
        textState = "You Quit!"
        $('.compEndInfo').text(compName + "\'s current balance was " + getCompBalNum() + ".");
        $('.userEndInfo').text(userName + "\'s current balance was " + getUserBalNum() + ".");
        $('.endgame .outcome').hide();
    } else if (endState == "win") {
        textState = "You Win!";
        $('.compEndInfo').text('');
        $('.userEndInfo').text(userName + " won with " + getUserBalNum() + " remaining.");
        $('.endgame .outcome').show();
    }
    else if (endState == "lose") {
        textState = "You Lose!";
        $('.compEndInfo').text(compName + " won with " + getCompBalNum() + " remaining.");
        $('.userEndInfo').text('');
        $('.endgame .outcome').show();
    } else {
        textState = "You Tied!";
        $('.compEndInfo').text('');
        $('.userEndInfo').text(compName + " & " + userName + " both lost all their money.");
        $('.endgame .outcome').show();
    }
    round = getRoundWord();

    $('.roundNumInfo').text("Played for " + roundNum + " " + round + ".");
    $('.comphighBalance').text(compName + "\'s highest balance was " + compHighBal + ".");
    $('.comphighBet').text(compName + "\'s highest bet was " + compHighBet + ".");
    $('.userhighBalance').text(userName + "'\s highest balance was " + userHighBal + ".");
    $('.userhighBet').text(userName + "\'s highest bet was " + userHighBet + ".");
    $('.endState').text(textState);
    $('.highlowgame').toggle();
    $('.endgame').toggle();
}

// Convert Dice Total to string Bet Type
function convertBet(diceTotal) {
    if(diceTotal < 7) {
        return "low";
    } else if (diceTotal > 7) {
        return "high";
    } else {
        return "seven";
    }
}

// Generate a Bet Type for the Computer
function generateBetType() {
    var num = Math.floor(Math.random()*3)+1;
    if(num == 1) {
        return "low";
    } else if (num == 2) {
        return "seven";
    } else {
        return "high";
    }
}

// Generate a Bet Amount for the Computer
function generateBetAmount(amount) {
    if(amount < 6) {
        return 1;
    } else {
        var partamount = amount / 5;
        var betAmount = Math.floor(Math.random()*partamount); // Max Bet Amount is half of current balance
        console.log("Bet Amount:" + betAmount);
        if( betAmount == 0) {
            generateBetAmount(amount);
        }
        return betAmount;
    }
}

// Checks if Player placed a Higher Bet
function checkHighBet() {
    if(userHighBet < parseInt($('.compBetAmount').text())) {
        userHighBet = parseInt($('.compBetAmount').text());
    }
    if(compHighBet < parseInt($('.userBetAmount').text())) {
        compHighBet = parseInt($('.userBetAmount').text());
    }
}

// Checks if Player obtained a new Higher Balance
function checkHighBalance() {
    if(userHighBal < getUserBalNum()) {
        userHighBal = getUserBalNum();
    }
    if(compHighBal < getCompBalNum()) {
        compHighBal = getCompBalNum();
    }
}

// Check User's Amount is not greater than User's Balance
function checkAmountToBalance(betAmount) {
    var userBalance = getUserBalNum();
    if(parseInt(betAmount) > userBalance) {
        messageDisplay("Error", "Please enter a number less than or equal to " + userBalance  + ".");
        return false; // Return false when Number in Bet Amount is greater than User's Balance
    }
    return true;
}

// Check if user input has decimal numbers
function checkInteger(betAmount) {
    if ((parseFloat(betAmount) % 1) != 0) {
         messageDisplay("Error", "Please enter a number that contains no numbers after the decimal");
        return false; // Return false when Number in Bet Amount has decimal values greater than .00
    }
    return true;
}

// Check if Bet Amount is a number and greater than 0
function checkAmountNumeric(betAmount) {
    if(!($.isNumeric(betAmount) && (parseInt(betAmount) > 0))) {
        messageDisplay("Error", "Please enter a integer value greater than 0 in the Bet Amount field.");
        return false; // Return false when Number in Bet Amount is not a number and greater than 0
    }
    return true;
}

// Check if Bet Type was selected
function checkBetType() {
    if(!$('.move li').children().hasClass('on')) {
        messageDisplay("Error", "Please select a Bet Type in the Bet Type field.");
        return false; // Return false when Bet Type not selected
    }
    return true;
}

// Check if Bet Amount Field is empty
function checkAmountEmpty(betAmount) {
    if( betAmount == "") {
        messageDisplay("Error", "Please enter a value in the Bet Amount field.");
        return false; // Return false when Empty Field
    }
    return true;
}

// Display errors to user
function messageDisplay(title, message) {
    $('.modalTitle').text(title);
    $('.modalContent').text(message);
    $.blockUI.defaults.css = { };
    $.blockUI({ message: $('#error-modal'), overlayCSS: { cursor: 'default' }});
    $('.blockUI.blockMsg').center();
}


// Gets Integer value of Comp Balance
function getCompBalNum() {
    return parseInt($('.compBalance').text());
}

// Gets Integer value of User Balance
function getUserBalNum() {
    return parseInt($('.userBalance').text());
}

// Get user name from input otherwie use generic name
function getUserName() {
    if($('.inputName').val() != "") {
        return $('.inputName').val();
    } else {
        return "User";
    }
}

// Give Computer Name on startup
function getCompName() {
    if(userName == "Ken") {
        return "Kenny";
    } else {
        return "Ken";
    }
}

// Get right string word for round(s)
function getRoundWord() {
    if (roundNum > 1) {
        return "rounds";
    } else {
        return "round";
    }
}

// Returns the percent of the window width to move dice
function getAnimatePercent() {
    if(window.matchMedia('(max-width: 480px)').matches) {
        return .30;
    } else if (window.matchMedia('(max-width: 1000px)').matches) {
        return .10 + (($(window).width() / 360)  * .1);
    } else if (window.matchMedia('(min-width: 1220px)').matches) {
        return .32 + ((($(window).width()-1000) / 225)  * .05);
    } else if (window.matchMedia('(min-width: 1001px)').matches) {
        return .35 + ((($(window).width()-1000) / 200)  * .05);
    }
}

// Reset field after roll because only shown when player wins a round
function resetTextInfo() {
    $('.compBalanceInfo').text("");
    $('.userBalanceInfo').text("");
}

// Remove Dice in animated position when window resizes
function resetAnimateDice() {
    $('.dice').removeClass('roll');
    $('#dice1').removeClass('roll');
    $('#dice2').removeClass('roll');
    $('#dice1').css("margin-left", "0");
    $('#dice2').css("margin-right", "0");
}

// Adjust HTML elements on Window Resize
function formatWindow() {
    resetAnimateDice();
    formatDie();
    formatBetScreen();
    formatModal();
}

// Adjust Modal when displayed and user resizes window
function formatModal() {
    $('.blockUI.blockMsg').center(); // method for jquery plugin (See Below)
}

// After User submits a bet, change the format of the screen to incorporate bet type and bet amount.
// If returning to the bet screen remove the class
function formatBetScreen() {
    if((window.matchMedia('(min-width: 480px)').matches) && $('.betArea').css('display') == 'none') {
        $('.userArea').addClass("on");
        $('.compArea').addClass("on");
        $('.userArea h2').addClass("on");
        $('.compArea h2').addClass("on");
        $('.user h2').addClass("on");
    } else {
        resetBetScreen();
    }
}

// Reset Roll Screen to Bet Screen
function resetBetScreen() {
    $('.userArea').removeClass("on");
    $('.compArea').removeClass("on");
    $('.userArea h2').removeClass("on");
    $('.compArea h2').removeClass("on");
    $('.user h2').removeClass("on");
}

// Change Dice size on Window Resize
function formatDie() {
    dice1 = $('#dice1').attr('alt');
    if(dice1 == "?") {
        resetDieImage();
    } else {
        dice2 = $('#dice2').attr('alt');
        placeDieImage('#dice1', parseInt(dice1));
        placeDieImage('#dice2', parseInt(dice2));
    }
}
    
// Change die image based on screen size
function getScreenSize() {
    if(window.matchMedia('(min-width: 480px)').matches) {
        return "";
    }
    else {
        return "_60";
    }
}

function resetDieImage() {
    var imgSize = getScreenSize();
    $('#dice1').attr({src: "../question_side_die" + imgSize + ".png", alt: "?"});
    $('#dice2').attr({src: "../question_side_die" + imgSize + ".png", alt: "?"});
}

// Change die image based on random number
function placeDieImage(dice, number) {
    var imgSize = getScreenSize();
    if(number == 1) {
        $(dice).attr({src: "../one_side_die" + imgSize + ".png", alt: "1"});
    } else if (number == 2) {
        $(dice).attr({src: "../two_side_die" + imgSize + ".png", alt: "2"});
    } else if (number == 3) {
        $(dice).attr({src: "../three_side_die" + imgSize + ".png", alt: "3"});
    } else if (number == 4) {
        $(dice).attr({src: "../four_side_die" + imgSize + ".png", alt: "4"});
    } else if (number == 5) {
        $(dice).attr({src: "../five_side_die" + imgSize + ".png", alt: "5"});
    } else {
        $(dice).attr({src: "../six_side_die" + imgSize + ".png", alt: "6"});
    }
}

// Rotate dice on Start Screen
// Uses jquery plugin jQueryRotate for rotation
function startScreenSpinDice() {
    // Rotate die image infinitely (Clockwise Motion)
    var clockAngle = 0;
    setInterval( function() {
          clockAngle+=3;
         $('.spindiceclock').rotate(clockAngle);
    }, 25);

    //Rotate die image infinitely (Counter Clockwise Motion)
    var counterAngle = 180;
    setInterval( function() {
          counterAngle-=3;
         $('.spindicecounter').rotate(counterAngle);
    }, 25);
}



// Centering blockUI plugin for window dialog(https://forum.jquery.com/topic/blockui-centering-the-dialog-window by user:dachande)
$.fn.center = function () {
    this.css("position","absolute");
    this.css("top", ( $(window).height() - this.height() ) / 2+$(window).scrollTop() + "px");
    this.css("left", ( $(window).width() - this.width() ) / 2+$(window).scrollLeft() + "px");
    return this;
}
;
