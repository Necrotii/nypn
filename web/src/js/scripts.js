
$(function() {
    $(document).foundation();
});

// Navbar Stuff

$('.hamburger-container').on('click', function() {
    toggleNav();
});

$('.mobile-button-container .nav-button').on('click', function() {
    toggleNav();
});

function toggleNav() {
    //var container = document.getElementsByClassName("mobile-button-container hide");
    var container = document.getElementById("mbc");
    var head = document.getElementById("head")

    if (container.className === "mobile-button-container border hidden") {
        container.className = "mobile-button-container border";
        head.className = "header"
        document.getElementById("cheems").src = "src/img/hamburger_close.png";
    } else {
        container.className = "mobile-button-container border hidden";
        head.className = "header border"
        document.getElementById("cheems").src = "src/img/hamburger.png";
    }
}

// Calendar

// Calendar API Key - AIzaSyCe46OoHnkodJ_tcuGGSRgxcoG-CMYlLgY
// Calendar ID - ha8s3llrrqnfuq647apbq2l7dc@group.calendar.google.com

function getCalendar(result) {
    $.getJSON('https://www.googleapis.com/calendar/v3/calendars/ha8s3llrrqnfuq647apbq2l7dc@group.calendar.google.com/events?key=AIzaSyCe46OoHnkodJ_tcuGGSRgxcoG-CMYlLgY', function(data) {
        // JSON result in `data` variable
        var cal = JSON.parse((JSON.stringify(data)));
        var limit = cal.items.length

        // Add 2 more events for recurring events (so that it actually recurs)
        for (i = 0; i < limit; i++) {
            if (cal.items[i].recurrence != undefined) {
                for (j = 1; j <= 2; j++) { // twice
                    var temp = JSON.parse(JSON.stringify(cal.items[i]));

                    var year = parseInt(temp.start.dateTime.slice(0,4));
                    var month = parseInt(temp.start.dateTime.slice(5,7));
                    var dayLimit;
                    var day = parseInt(temp.start.dateTime.slice(8,10));
                    switch (month) {
                        case 1:  dayLimit = 31; break;
                        case 2:  dayLimit = 28; break;
                        case 3:  dayLimit = 31; break;
                        case 4:  dayLimit = 30; break;
                        case 5:  dayLimit = 31; break;
                        case 6:  dayLimit = 30; break;
                        case 7:  dayLimit = 31; break;
                        case 8:  dayLimit = 31; break;
                        case 9:  dayLimit = 30; break;
                        case 10: dayLimit = 31; break;
                        case 11: dayLimit = 30; break;
                        case 12: dayLimit = 31; break;
                    }

                    day += 7 * j;
                    if (day > dayLimit) {
                        month++;
                        day -= dayLimit;
                    }
                    if (month > 12) {
                        year++;
                        month -= 12;
                    }

                    year = year.toString();
                    month = month.toString();
                    if (month.length == 1) {
                        month = "0" + month;
                    }
                    day = day.toString();
                    if (day.length == 1) {
                        day = "0" + day;
                    }
                    temp.start.dateTime = temp.start.dateTime.replace(temp.start.dateTime.substr(0,10), (year + "-" + month + "-" + day));

                    cal.items.push(JSON.parse(JSON.stringify(temp)));
                }
            }
        }

        // Sort the events by start date/time
        var events = [JSON.parse(JSON.stringify(cal.items[0]))];
        for (i = 1; i < cal.items.length; i++) {
            j = 0;
            while (j <= events.length -1 && events[j].start.dateTime < cal.items[i].start.dateTime) {
                j++;
            }
            events.splice(j,0,JSON.parse(JSON.stringify(cal.items[i])));
        }

        // Initialize the event items in HTML

        //!!  !!  Plan is to have nice square that when hovered shows location part

        item = document.getElementsByClassName("event-item");
        for (i = 0; i <= 2; i++) { // for all 3 events
            // Date Box
            item[i].children[0].children[0].innerHTML = parseInt(events[i].start.dateTime.slice(8,10)); // days

            monthWord = "September";
            
            switch ((parseInt(events[i].start.dateTime.slice(5,7)))) {
                case 1:  monthWord = "January"; break;
                case 2:  monthWord = "February"; break;
                case 3:  monthWord = "March"; break;
                case 4:  monthWord = "April"; break;
                case 5:  monthWord = "May"; break;
                case 6:  monthWord = "June"; break;
                case 7:  monthWord = "July"; break;
                case 8:  monthWord = "August"; break;
                case 9:  monthWord = "September"; break;
                case 10: monthWord = "October"; break;
                case 11: monthWord = "November"; break;
                case 12: monthWord = "December"; break;
            };
            
            item[i].children[0].children[1].innerHTML = monthWord // month

            // Name Box
            item[i].children[1].children[0].innerHTML = events[i].summary;
            item[i].children[1].children[1].innerHTML = events[i].description;

            // Location Box
            item[i].children[2].href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(events[i].location); // a
            item[i].children[2].children[0].children[0].innerHTML = events[i].location;
        }


    });
}

getCalendar();