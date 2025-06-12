// Project Knucklebones [Tabletop RPG Dice Emulator] //
// 2024 StrayDog Syndications LLC. All Rights Reserved //
import { showD20FumbleEffect, showD20CritEffect } from './d20-effects.js';
(function () {
    "use strict";
    // rainbow 'on-click'
    let rainbow = ["red", "dkorange", "dkpurple", "green", "dkblue", "indigo", "silver", "navy", "dkgreen", "orange", "dkgold",
        "black", "violet", "fire", "yellow", "dkslate", "blue"];
    let currentColor = 0;

    // jQuery script for each button

    $('#btn4').click(handleRollButtonClick4);
    function handleRollButtonClick4() {
        $('#num4').html(roll4());
        $('#num4').removeClass(rainbow[currentColor]);
        if (currentColor === rainbow.length) {
            currentColor = 0;
        } else {
            currentColor++;
        }
        $('#num4').addClass(rainbow[currentColor]);

    }
    //1d4

    $('#btn6').click(handleRollButtonClick6);
    function handleRollButtonClick6() {
        $('#num6').html(roll6());
        $('#num6').removeClass(rainbow[currentColor]);
        if (currentColor === rainbow.length) {
            currentColor = 0;
        } else {
            currentColor++;
        }
        $('#num6').addClass(rainbow[currentColor]);
    }//1d6

    $('#btn8').click(handleRollButtonClick8);
    function handleRollButtonClick8() {
        $('#num8').html(roll8());
        $('#num8').removeClass(rainbow[currentColor]);
        if (currentColor === rainbow.length) {
            currentColor = 0;
        } else {
            currentColor++;
        }
        $('#num8').addClass(rainbow[currentColor]);
    }//1d8

    $('#btn10').click(handleRollButtonClick10);
    function handleRollButtonClick10() {
        $('#num10').html(roll10());
        $('#num10').removeClass(rainbow[currentColor]);
        if (currentColor === rainbow.length) {
            currentColor = 0;
        } else {
            currentColor++;
        }
        $('#num10').addClass(rainbow[currentColor]);
    }//1d10

    $('#btn12').click(handleRollButtonClick12);
    function handleRollButtonClick12() {
        $('#num12').html(roll12());
        $('#num12').removeClass(rainbow[currentColor]);
        if (currentColor === rainbow.length) {
            currentColor = 0;
        } else {
            currentColor++;
        }
        $('#num12').addClass(rainbow[currentColor]);
    }//1d12

    $('#btn20').click(handleRollButtonClick20);
    function handleRollButtonClick20() {
        const result = roll20();
        $('#num20').html(result);
        $('#num20').removeClass(rainbow[currentColor]);
        if (currentColor === rainbow.length) {
            currentColor = 0;
        } else {
            currentColor++;
        }
        $('#num20').addClass(rainbow[currentColor]);
        // Special d20 effects
        const num20Elem = document.getElementById('num20');
        if (result === 1) {
            showD20FumbleEffect(num20Elem);
        } else if (result === 20) {
            showD20CritEffect(num20Elem);
        }
    }//1d20

    $('#btn100').click(handleRollButtonClick100);
    function handleRollButtonClick100() {
        $('#num100').html(roll100() + '%');
        $('#num100').removeClass(rainbow[currentColor]);
        if (currentColor === rainbow.length) {
            currentColor = 0;
        } else {
            currentColor++;
        }
        $('#num100').addClass(rainbow[currentColor]);
    }//1d00%


    // each dice function
    function roll3() {
        return Math.floor(3 * Math.random()) + 1;
    }
    function roll4() {
        return Math.floor(4 * Math.random()) + 1;
    }
    function roll6() {
        return Math.floor(6 * Math.random()) + 1;
    }
    function roll8() {
        return Math.floor(8 * Math.random()) + 1;
    }
    function roll10() {
        return Math.floor(10 * Math.random()) + 1;
    }
    function roll12() {
        return Math.floor(12 * Math.random()) + 1;
    }
    function roll20() {
        return Math.floor(20 * Math.random()) + 1;
    }
    function roll100() {
        return Math.floor(100 * Math.random()) + 1;
    }

    // &copy; 2024 StrayDog Syndications LTD. All Rights Reserved
}());