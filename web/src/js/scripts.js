
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

// Events expand

$('.event-item').click(function() {
    if(this.children[1].children[0].className === "event-name-box"){
        this.children[1].children[0].className = "event-name-box expanded"; //event-name-box
        this.children[1].children[1].children[0].className = "flipped"; // arrow img
    } else {
        this.children[1].children[0].className = "event-name-box"; //event-name-box
        this.children[1].children[1].children[0].className = ""; // arrow img
    }
});

// Form expand buttons

var formShown = false;
var shownForm = null;

$('#getMentorButton').click(function() {
    if(!formShown){
        shownForm = "get";
        formShown = true;
        $('#getMentorForm').removeClass("expanded");
        $('#beMentorForm').removeClass("expanded");
        $('#getMentorForm').addClass("expanded");
        setTimeout(function(){$('#beMentorForm').removeClass("expanded"); }, 1000);
        
    }
    else if(shownForm == "be") {
        shownForm = "get";
        $('#beMentorForm').removeClass("expanded");
        setTimeout(function(){$('#getMentorForm').addClass("expanded"); }, 1000);
    }
    else {
        formShown = false;
        $('#getMentorForm').removeClass("expanded");
        $('#beMentorForm').removeClass("expanded");
    }
});

$('#beMentorButton').click(function() {
    if(!formShown){
        formShown = true;
        shownForm = "be";
        $('#beMentorForm').removeClass("expanded");
        $('#getMentorForm').removeClass("expanded");
        $('#beMentorForm').addClass("expanded");
        setTimeout(function(){$('#getMentorForm').removeClass("expanded"); }, 1000);
    }
    else if(shownForm == "get") {
        shownForm = "be";
        $('#getMentorForm').removeClass("expanded");
        setTimeout(function(){$('#beMentorForm').addClass("expanded"); }, 1000);
    }
    else {
        formShown = false;
        $('#beMentorForm').removeClass("expanded");
        $('#getMentorForm').removeClass("expanded");
    }
});

function toggleNav() {
    //var container = document.getElementsByClassName("mobile-button-container hide");
    var container = document.getElementById("mbc");
    var head = document.getElementById("head")

    if (container.className === "mobile-button-container border hidden") {
        container.className = "mobile-button-container border";
        head.className = "header";
        document.getElementById("cheems").src = "src/img/hamburger_close.png";
    } else {
        container.className = "mobile-button-container border hidden";
        head.className = "header border";
        document.getElementById("cheems").src = "src/img/hamburger.png";
    }
}

// Calendar

// Calendar API Key - AIzaSyCe46OoHnkodJ_tcuGGSRgxcoG-CMYlLgY
// Calendar ID - ha8s3llrrqnfuq647apbq2l7dc@group.calendar.google.com

function initCalendar(result) {
    
    $.getJSON('https://www.googleapis.com/calendar/v3/calendars/ha8s3llrrqnfuq647apbq2l7dc@group.calendar.google.com/events?key=AIzaSyCe46OoHnkodJ_tcuGGSRgxcoG-CMYlLgY', function(data) {
        // JSON result in `data` variable
        var cal = JSON.parse((JSON.stringify(data)));
        var limit = cal.items.length;

        var currentDate = new Date();

        // Add more events for recurring events (so that it actually recurs)
        for (i = 0; i < limit; i++) {
            if (cal.items[i].recurrence != undefined) {
                for (j = 1; j <= 4; j++) {
                    var temp = JSON.parse(JSON.stringify(cal.items[i]));

                    var year = parseInt(temp.start.dateTime.slice(0,4));
                    var month = parseInt(temp.start.dateTime.slice(5,7) - 1);
                    var day = parseInt(temp.start.dateTime.slice(8,10));

                    var tempDate = new Date(year, month, day);

                    while (currentDate.getFullYear() > tempDate.getFullYear() || currentDate.getMonth() > tempDate.getMonth() || currentDate.getDate() > tempDate.getDate()) {
                        tempDate.setDate(tempDate.getDate() + 7);
                    }

                    year = tempDate.getFullYear();
                    month = tempDate.getMonth() + 1;
                    month = month.toString();
                    if (month.length == 1) {
                        month = "0" + month;
                    }
                    day = tempDate.getDate();
                    day = day.toString();
                    if (day.length == 1) {
                        day = "0" + day;
                    }
                    temp.start.dateTime = temp.start.dateTime.replace(temp.start.dateTime.substr(0,10), (year + "-" + month + "-" + day));

                    cal.items.push(JSON.parse(JSON.stringify(temp)));
                    currentDate.setDate(currentDate.getDate() + 7);
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

        // Remove events that have already passed
        currentDate = new Date();
        for (i = 0; i < events.length; i++) {
            var year = parseInt(events[i].start.dateTime.slice(0,4));
            var month = parseInt(events[i].start.dateTime.slice(5,7) - 1);
            var day = parseInt(events[i].start.dateTime.slice(8,10));

            var tempDate = new Date(year, month, day);

            if (currentDate > tempDate) {
                events.splice(i, 1);
                i--;
            }
        }

        // Initialize the event items in HTML
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
            item[i].children[1].children[0].children[0].innerHTML = events[i].summary;
            item[i].children[1].children[0].children[1].innerHTML = events[i].description;
            item[i].children[1].children[0].children[3].innerHTML = events[i].location;
            item[i].children[1].children[0].children[4].href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(events[i].location);

            // Location Box - old
            //item[i].children[2].href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(events[i].location); // a
            //item[i].children[2].children[0].children[0].innerHTML = events[i].location;
        }
    });
}

initCalendar();