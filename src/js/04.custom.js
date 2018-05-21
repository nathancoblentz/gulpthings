function updateURL() {
	str.replace("css/style.min.css", "https://wvholdings.sharepoint.com/rovia/support/siteassets/css/.css");
}

$(document).ready(function () {
    if(window.location.href.indexOf("sharepoint") > -1) {
	updateURL();
};});

