/*!
 * Project : simply-countdown (modified)
 * License : MIT
 * Version : 1.3.2 + elapsed mode
 */

(function (exports) {
    'use strict';

    var extend,
        createElements,
        createCountdownElt,
        simplyCountdown;

    extend = function (out) {
        var i, obj, key;
        out = out || {};

        for (i = 1; i < arguments.length; i += 1) {
            obj = arguments[i];
            if (obj) {
                for (key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        if (typeof obj[key] === 'object') {
                            extend(out[key], obj[key]);
                        } else {
                            out[key] = obj[key];
                        }
                    }
                }
            }
        }
        return out;
    };

    createCountdownElt = function (countdown, parameters, typeClass) {
        var sectionTag = document.createElement('div'),
            amountTag = document.createElement('span'),
            wordTag = document.createElement('span'),
            innerSectionTag = document.createElement('div');

        innerSectionTag.appendChild(amountTag);
        innerSectionTag.appendChild(wordTag);
        sectionTag.appendChild(innerSectionTag);

        sectionTag.classList.add(parameters.sectionClass, typeClass);
        amountTag.classList.add(parameters.amountClass);
        wordTag.classList.add(parameters.wordClass);

        countdown.appendChild(sectionTag);

        return {
            full: sectionTag,
            amount: amountTag,
            word: wordTag
        };
    };

    createElements = function (parameters, countdown) {
        if (!parameters.inline) {
            return {
                days: createCountdownElt(countdown, parameters, 'simply-days-section'),
                hours: createCountdownElt(countdown, parameters, 'simply-hours-section'),
                minutes: createCountdownElt(countdown, parameters, 'simply-minutes-section'),
                seconds: createCountdownElt(countdown, parameters, 'simply-seconds-section')
            };
        }

        var spanTag = document.createElement('span');
        spanTag.classList.add(parameters.inlineClass);
        return spanTag;
    };

    simplyCountdown = function (elt, args) {
        var parameters = extend({
                year: 2026,
                month: 1,
                day: 1,
                hours: 0,
                minutes: 0,
                seconds: 0,
                mode: 'countdown', // 'countdown' | 'elapsed'
                words: {
                    days: 'día',
                    hours: 'hora',
                    minutes: 'minuto',
                    seconds: 'segundo',
                    pluralLetter: 's'
                },
                plural: true,
                inline: false,
                enableUtc: false,
                onEnd: function () {},
                refresh: 1000,
                inlineClass: 'simply-countdown-inline',
                sectionClass: 'simply-section',
                amountClass: 'simply-amount',
                wordClass: 'simply-word',
                zeroPad: false
            }, args),

            interval,
            targetDate,
            targetTmpDate,
            now,
            nowUtc,
            secondsLeft,
            days,
            hours,
            minutes,
            seconds,
            cd = document.querySelectorAll(elt);

        targetTmpDate = new Date(
            parameters.year,
            parameters.month - 1,
            parameters.day,
            parameters.hours,
            parameters.minutes,
            parameters.seconds
        );

        targetDate = parameters.enableUtc
            ? new Date(
                targetTmpDate.getUTCFullYear(),
                targetTmpDate.getUTCMonth(),
                targetTmpDate.getUTCDate(),
                targetTmpDate.getUTCHours(),
                targetTmpDate.getUTCMinutes(),
                targetTmpDate.getUTCSeconds()
              )
            : targetTmpDate;

        Array.prototype.forEach.call(cd, function (countdown) {
            var fullCountDown = createElements(parameters, countdown);

            var refresh = function () {
                var dayWord, hourWord, minuteWord, secondWord;

                now = new Date();

                if (parameters.enableUtc) {
                    nowUtc = new Date(
                        now.getFullYear(),
                        now.getMonth(),
                        now.getDate(),
                        now.getHours(),
                        now.getMinutes(),
                        now.getSeconds()
                    );

                    secondsLeft = parameters.mode === 'elapsed'
                        ? (nowUtc.getTime() - targetDate) / 1000
                        : (targetDate - nowUtc.getTime()) / 1000;

                } else {
                    secondsLeft = parameters.mode === 'elapsed'
                        ? (now.getTime() - targetDate) / 1000
                        : (targetDate - now.getTime()) / 1000;
                }

                if (secondsLeft >= 0 || parameters.mode === 'elapsed') {
                    days = parseInt(secondsLeft / 86400, 10);
                    secondsLeft %= 86400;

                    hours = parseInt(secondsLeft / 3600, 10);
                    secondsLeft %= 3600;

                    minutes = parseInt(secondsLeft / 60, 10);
                    seconds = parseInt(secondsLeft % 60, 10);
                } else {
                    days = hours = minutes = seconds = 0;
                    window.clearInterval(interval);
                    parameters.onEnd();
                }

                if (parameters.plural) {
                    dayWord = days !== 1 ? parameters.words.days + parameters.words.pluralLetter : parameters.words.days;
                    hourWord = hours !== 1 ? parameters.words.hours + parameters.words.pluralLetter : parameters.words.hours;
                    minuteWord = minutes !== 1 ? parameters.words.minutes + parameters.words.pluralLetter : parameters.words.minutes;
                    secondWord = seconds !== 1 ? parameters.words.seconds + parameters.words.pluralLetter : parameters.words.seconds;
                } else {
                    dayWord = parameters.words.days;
                    hourWord = parameters.words.hours;
                    minuteWord = parameters.words.minutes;
                    secondWord = parameters.words.seconds;
                }

                if (parameters.inline) {
                    countdown.innerHTML =
                        days + ' ' + dayWord + ', ' +
                        hours + ' ' + hourWord + ', ' +
                        minutes + ' ' + minuteWord + ', ' +
                        seconds + ' ' + secondWord;
                } else {
                    fullCountDown.days.amount.textContent = days;
                    fullCountDown.days.word.textContent = dayWord;

                    fullCountDown.hours.amount.textContent = hours;
                    fullCountDown.hours.word.textContent = hourWord;

                    fullCountDown.minutes.amount.textContent = minutes;
                    fullCountDown.minutes.word.textContent = minuteWord;

                    fullCountDown.seconds.amount.textContent = seconds;
                    fullCountDown.seconds.word.textContent = secondWord;
                }
            };

            refresh();
            interval = window.setInterval(refresh, parameters.refresh);
        });
    };

    exports.simplyCountdown = simplyCountdown;
}(window));

if (window.jQuery) {
    (function ($, simplyCountdown) {
        $.fn.simplyCountdown = function (options) {
            simplyCountdown(this.selector, options);
            return this;
        };
    }(jQuery, simplyCountdown));
}
