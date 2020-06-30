$(function() {
    $(document).foundation();
});

function showNav() {
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