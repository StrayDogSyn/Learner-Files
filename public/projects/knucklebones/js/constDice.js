/* Knuckle Bones of Ficklest Fortunes
 * Tabletop RPG Dice Emulator
 * StrayDog Syndications L.L.C.
 * Copyright 2024
 * All Rights Reserved
 */
// rainbow 'on-click'
let rainbow = ["red", "dkorange", "dkpurple", "green", "dkblue", "indigo", "silver", "navy", "dkgreen", "orange", "dkgold",
    "black", "violet", "fire", "yellow", "dkslate", "blue"];
let currentColor = 0;

// class Dice

class Dice {
    constructor(sides) {
        this.sides = sides;
    }
    //getter
    get roll() {
        return this.rollDiceMethod();
    }
    //method
    rollDiceMethod() {
        return Math.floor(this.sides * Math.random() + 1);
    }
}
// single Dice declarations
const dTwo = new Dice(2);
dTwo.sides = 2;
// dTwo
const dThree = new Dice(3);
dThree.sides = 3;
// dThree
const dFour = new Dice(4);
dFour.sides = 4;
// dFour
const dSix = new Dice(6);
dSix.sides = 6;
// dSix
const dEight = new Dice(8);
dEight.sides = 8;
// dEight
const dTen = new Dice(10);
dTen.sides = 10;
// dTen
const dTwelve = new Dice(12);
dTwelve.sides = 12;
// dTwelve
const dTwenty = new Dice(20);
dTwenty.sides = 20;
// dTwenty
const dPercent = new Dice(100);
dPercent.sides = 100;

// call dice functions
dThree.roll;
dFour.roll;
dSix.roll;
dEight.roll;
dTen.roll;
dTwelve.roll;
dTwenty.roll;
dPercent.roll;

// jQuery steps
// (needs refactoring)

// 6d4
$('#btn4a').click(handleRollButtonClick4a);
function handleRollButtonClick4a() {
    $('#num4a').html(dFour.roll);
    $('#num4a').removeClass(rainbow[currentColor]);
    if (currentColor === rainbow.length) {
        currentColor = 0;
    } else {
        currentColor++;
    }
    $('#num4a').addClass(rainbow[currentColor]);
}//1d4

$('#btn4b').click(handleRollButtonClick4b);
function handleRollButtonClick4b() {
    $('#num4b').html(dFour.roll);
    $('#num4b').removeClass(rainbow[currentColor]);
    if (currentColor === rainbow.length) {
        currentColor = 0;
    } else {
        currentColor++;
    }
    $('#num4b').addClass(rainbow[currentColor]);
}//1d4

$('#btn4c').click(handleRollButtonClick4c);
function handleRollButtonClick4c() {
    $('#num4c').html(dFour.roll);
    $('#num4c').removeClass(rainbow[currentColor]);
    if (currentColor === rainbow.length) {
        currentColor = 0;
    } else {
        currentColor++;
    }
    $('#num4c').addClass(rainbow[currentColor]);
}//1d4

$('#btn4d').click(handleRollButtonClick4d);
function handleRollButtonClick4d() {
    $('#num4d').html(dFour.roll);
    $('#num4d').removeClass(rainbow[currentColor]);
    if (currentColor === rainbow.length) {
        currentColor = 0;
    } else {
        currentColor++;
    }
    $('#num4d').addClass(rainbow[currentColor]);
}//1d4

$('#btn4e').click(handleRollButtonClick4e);
function handleRollButtonClick4e() {
    $('#num4e').html(dFour.roll);
    $('#num4e').removeClass(rainbow[currentColor]);
    if (currentColor === rainbow.length) {
        currentColor = 0;
    } else {
        currentColor++;
    }
    $('#num4e').addClass(rainbow[currentColor]);
}//1d4

$('#btn4f').click(handleRollButtonClick4f);
function handleRollButtonClick4f() {
    $('#num4f').html(dFour.roll);
    $('#num4f').removeClass(rainbow[currentColor]);
    if (currentColor === rainbow.length) {
        currentColor = 0;
    } else {
        currentColor++;
    }
    $('#num4f').addClass(rainbow[currentColor]);
}//1d4

// 6d6
$('#btn6a').click(handleRollButtonClick6a);
function handleRollButtonClick6a() {
    $('#num6a').html(dSix.roll);
    $('#num6a').removeClass(rainbow[currentColor]);
    if (currentColor === rainbow.length) {
        currentColor = 0;
    } else {
        currentColor++;
    }
    $('#num6a').addClass(rainbow[currentColor]);
}//1d6

$('#btn6b').click(handleRollButtonClick6b);
function handleRollButtonClick6b() {
    $('#num6b').html(dSix.roll);
    $('#num6b').removeClass(rainbow[currentColor]);
    if (currentColor === rainbow.length) {
        currentColor = 0;
    } else {
        currentColor++;
    }
    $('#num6b').addClass(rainbow[currentColor]);
}//1d6

$('#btn6c').click(handleRollButtonClick6c);
function handleRollButtonClick6c() {
    $('#num6c').html(dSix.roll);
    $('#num6c').removeClass(rainbow[currentColor]);
    if (currentColor === rainbow.length) {
        currentColor = 0;
    } else {
        currentColor++;
    }
    $('#num6c').addClass(rainbow[currentColor]);
}//1d6

$('#btn6d').click(handleRollButtonClick6d);
function handleRollButtonClick6d() {
    $('#num6d').html(dSix.roll);
    $('#num6d').removeClass(rainbow[currentColor]);
    if (currentColor === rainbow.length) {
        currentColor = 0;
    } else {
        currentColor++;
    }
    $('#num6d').addClass(rainbow[currentColor]);
}//1d6

$('#btn6e').click(handleRollButtonClick6e);
function handleRollButtonClick6e() {
    $('#num6e').html(dSix.roll);
    $('#num6e').removeClass(rainbow[currentColor]);
    if (currentColor === rainbow.length) {
        currentColor = 0;
    } else {
        currentColor++;
    }
    $('#num6e').addClass(rainbow[currentColor]);
}//1d6

$('#btn6f').click(handleRollButtonClick6f);
function handleRollButtonClick6f() {
    $('#num6f').html(dSix.roll);
    $('#num6f').removeClass(rainbow[currentColor]);
    if (currentColor === rainbow.length) {
        currentColor = 0;
    } else {
        currentColor++;
    }
    $('#num6f').addClass(rainbow[currentColor]);
}//1d6

// 6d8
$('#btn8a').click(handleRollButtonClick8a);
function handleRollButtonClick8a() {
    $('#num8a').html(dEight.roll);
    $('#num8a').removeClass(rainbow[currentColor]);
    if (currentColor === rainbow.length) {
        currentColor = 0;
    } else {
        currentColor++;
    }
    $('#num8a').addClass(rainbow[currentColor]);
}//1d8

$('#btn8b').click(handleRollButtonClick8b);
function handleRollButtonClick8b() {
    $('#num8b').html(dEight.roll);
    $('#num8b').removeClass(rainbow[currentColor]);
    if (currentColor === rainbow.length) {
        currentColor = 0;
    } else {
        currentColor++;
    }
    $('#num8b').addClass(rainbow[currentColor]);
}//1d8

$('#btn8c').click(handleRollButtonClick8c);
function handleRollButtonClick8c() {
    $('#num8c').html(dEight.roll);
    $('#num8c').removeClass(rainbow[currentColor]);
    if (currentColor === rainbow.length) {
        currentColor = 0;
    } else {
        currentColor++;
    }
    $('#num8c').addClass(rainbow[currentColor]);
}//1d8

$('#btn8d').click(handleRollButtonClick8d);
function handleRollButtonClick8d() {
    $('#num8d').html(dEight.roll);
    $('#num8d').removeClass(rainbow[currentColor]);
    if (currentColor === rainbow.length) {
        currentColor = 0;
    } else {
        currentColor++;
    }
    $('#num8d').addClass(rainbow[currentColor]);
}//1d8

$('#btn8e').click(handleRollButtonClick8e);
function handleRollButtonClick8e() {
    $('#num8e').html(dEight.roll);
    $('#num8e').removeClass(rainbow[currentColor]);
    if (currentColor === rainbow.length) {
        currentColor = 0;
    } else {
        currentColor++;
    }
    $('#num8e').addClass(rainbow[currentColor]);
}//1d8

$('#btn8f').click(handleRollButtonClick8f);
function handleRollButtonClick8f() {
    $('#num8f').html(dEight.roll);
    $('#num8f').removeClass(rainbow[currentColor]);
    if (currentColor === rainbow.length) {
        currentColor = 0;
    } else {
        currentColor++;
    }
    $('#num8f').addClass(rainbow[currentColor]);
}//1d8

// 6d10
$('#btn10a').click(handleRollButtonClick10a);
function handleRollButtonClick10a() {
    $('#num10a').html(dTen.roll);
    $('#num10a').removeClass(rainbow[currentColor]);
    if (currentColor === rainbow.length) {
        currentColor = 0;
    } else {
        currentColor++;
    }
    $('#num10a').addClass(rainbow[currentColor]);
}//1d10

$('#btn10b').click(handleRollButtonClick10b);
function handleRollButtonClick10b() {
    $('#num10b').html(dTen.roll);
    $('#num10b').removeClass(rainbow[currentColor]);
    if (currentColor === rainbow.length) {
        currentColor = 0;
    } else {
        currentColor++;
    }
    $('#num10b').addClass(rainbow[currentColor]);
}//1d10

$('#btn10c').click(handleRollButtonClick10c);
function handleRollButtonClick10c() {
    $('#num10c').html(dTen.roll);
    $('#num10c').removeClass(rainbow[currentColor]);
    if (currentColor === rainbow.length) {
        currentColor = 0;
    } else {
        currentColor++;
    }
    $('#num10c').addClass(rainbow[currentColor]);
}//1d10

$('#btn10d').click(handleRollButtonClick10d);
function handleRollButtonClick10d() {
    $('#num10d').html(dTen.roll);
    $('#num10d').removeClass(rainbow[currentColor]);
    if (currentColor === rainbow.length) {
        currentColor = 0;
    } else {
        currentColor++;
    }
    $('#num10d').addClass(rainbow[currentColor]);
}//1d10

$('#btn10e').click(handleRollButtonClick10e);
function handleRollButtonClick10e() {
    $('#num10e').html(dTen.roll);
    $('#num10e').removeClass(rainbow[currentColor]);
    if (currentColor === rainbow.length) {
        currentColor = 0;
    } else {
        currentColor++;
    }
    $('#num10e').addClass(rainbow[currentColor]);
}//1d10

$('#btn10f').click(handleRollButtonClick10f);
function handleRollButtonClick10f() {
    $('#num10f').html(dTen.roll);
    $('#num10f').removeClass(rainbow[currentColor]);
    if (currentColor === rainbow.length) {
        currentColor = 0;
    } else {
        currentColor++;
    }
    $('#num10f').addClass(rainbow[currentColor]);
}//1d10

// 6d12
$('#btn12a').click(handleRollButtonClick12a);
function handleRollButtonClick12a() {
    $('#num12a').html(dTwelve.roll);
    $('#num12a').removeClass(rainbow[currentColor]);
    if (currentColor === rainbow.length) {
        currentColor = 0;
    } else {
        currentColor++;
    }
    $('#num12a').addClass(rainbow[currentColor]);
}//1d12

$('#btn12b').click(handleRollButtonClick12b);
function handleRollButtonClick12b() {
    $('#num12b').html(dTwelve.roll);
    $('#num12b').removeClass(rainbow[currentColor]);
    if (currentColor === rainbow.length) {
        currentColor = 0;
    } else {
        currentColor++;
    }
    $('#num12b').addClass(rainbow[currentColor]);
}//1d12

$('#btn12c').click(handleRollButtonClick12c);
function handleRollButtonClick12c() {
    $('#num12c').html(dTwelve.roll);
    $('#num12c').removeClass(rainbow[currentColor]);
    if (currentColor === rainbow.length) {
        currentColor = 0;
    } else {
        currentColor++;
    }
    $('#num12c').addClass(rainbow[currentColor]);
}//1d12

$('#btn12d').click(handleRollButtonClick12d);
function handleRollButtonClick12d() {
    $('#num12d').html(dTwelve.roll);
    $('#num12d').removeClass(rainbow[currentColor]);
    if (currentColor === rainbow.length) {
        currentColor = 0;
    } else {
        currentColor++;
    }
    $('#num12d').addClass(rainbow[currentColor]);
}//1d12

$('#btn12e').click(handleRollButtonClick12e);
function handleRollButtonClick12e() {
    $('#num12e').html(dTwelve.roll);
    $('#num12e').removeClass(rainbow[currentColor]);
    if (currentColor === rainbow.length) {
        currentColor = 0;
    } else {
        currentColor++;
    }
    $('#num12e').addClass(rainbow[currentColor]);
}//1d12

$('#btn12f').click(handleRollButtonClick12f);
function handleRollButtonClick12f() {
    $('#num12f').html(dTwelve.roll);
    $('#num12f').removeClass(rainbow[currentColor]);
    if (currentColor === rainbow.length) {
        currentColor = 0;
    } else {
        currentColor++;
    }
    $('#num12f').addClass(rainbow[currentColor]);
}//1d12

// 4d00%
$('#btn100a').click(handleRollButtonClick100a);
function handleRollButtonClick100a() {
    $('#num100a').html(dPercent.roll + '%');
    $('#num100a').removeClass(rainbow[currentColor]);
    if (currentColor === rainbow.length) {
        currentColor = 0;
    } else {
        currentColor++;
    }
    $('#num100a').addClass(rainbow[currentColor]);
}//d00%

$('#btn100b').click(handleRollButtonClick100b);
function handleRollButtonClick100b() {
    $('#num100b').html(dPercent.roll + '%');
    $('#num100b').removeClass(rainbow[currentColor]);
    if (currentColor === rainbow.length) {
        currentColor = 0;
    } else {
        currentColor++;
    }
    $('#num100b').addClass(rainbow[currentColor]);
}//d00%

$('#btn100c').click(handleRollButtonClick100c);
function handleRollButtonClick100c() {
    $('#num100c').html(dPercent.roll + '%');
    $('#num100c').removeClass(rainbow[currentColor]);
    if (currentColor === rainbow.length) {
        currentColor = 0;
    } else {
        currentColor++;
    }
    $('#num100c').addClass(rainbow[currentColor]);
}//1d00%

$('#btn100d').click(handleRollButtonClick100d);
function handleRollButtonClick100d() {
    $('#num100d').html(dPercent.roll + '%');
    $('#num100d').removeClass(rainbow[currentColor]);
    if (currentColor === rainbow.length) {
        currentColor = 0;
    } else {
        currentColor++;
    }
    $('#num100d').addClass(rainbow[currentColor]);
}//1d00%

// 4d20
$('#btn20a').click(handleRollButtonClick20a);
function handleRollButtonClick20a() {
    $('#num20a').html(dTwenty.roll);
    $('#num20a').removeClass(rainbow[currentColor]);
    if (currentColor === rainbow.length) {
        currentColor = 0;
    } else {
        currentColor++;
    }
    $('#num20a').addClass(rainbow[currentColor]);
}//1d20

$('#btn20b').click(handleRollButtonClick20b);
function handleRollButtonClick20b() {
    $('#num20b').html(dTwenty.roll);
    $('#num20b').removeClass(rainbow[currentColor]);
    if (currentColor === rainbow.length) {
        currentColor = 0;
    } else {
        currentColor++;
    }
    $('#num20b').addClass(rainbow[currentColor]);
}//1d20

$('#btn20c').click(handleRollButtonClick20c);
function handleRollButtonClick20c() {
    $('#num20c').html(dTwenty.roll);
    $('#num20c').removeClass(rainbow[currentColor]);
    if (currentColor === rainbow.length) {
        currentColor = 0;
    } else {
        currentColor++;
    }
    $('#num20c').addClass(rainbow[currentColor]);
}//1d20

$('#btn20d').click(handleRollButtonClick20d);
function handleRollButtonClick20d() {
    $('#num20d').html(dTwenty.roll);
    $('#num20d').removeClass(rainbow[currentColor]);
    if (currentColor === rainbow.length) {
        currentColor = 0;
    } else {
        currentColor++;
    }
    $('#num20d').addClass(rainbow[currentColor]);
}//1d20

// $('#dice').css({background, 'red'})