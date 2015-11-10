function changeTextTest()
{
    document.getElementById("hello").innerHTML = "Hi User";
}
window.onload = function()
{    
    addingEventToCalendar();
}
function addingEventToCalendar()
{
  console.log("Adding to event");
  var startDate = new Date("November 10, 2015 13:00:00");
  var endDate = new Date("November 10, 2015 14:30:00");
  var title = "My nice event";
  var location = "Home";
  var notes = "Some notes about this event.";
  var success = function(message) { alert("Success: " + JSON.stringify(message)); };
  var error = function(message) { alert("Error: " + message); };

  // create
  window.plugins.calendar.createEvent(title,location,notes,startDate,endDate,success,error);
}