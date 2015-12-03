var missionData = "test";
var url = "http://54.86.175.74:8080/summerMissions";
console.log("Start");

$.ajax({
   url: url,
   type: "GET",
   dataType: "json",
   success: function (data)
    {
        eventsData = data;
        console.log("In callback");
        console.log(data);
        
        var list = $("#list_of_events");
        
        jQuery.each(data, function( key, value ) {
            console.log(key);
            console.log(value["name"]);
            var day = value["startDate"];
            var date = day[8] + day[9];
            
            var html = "<span class=\"fa-stack fa-1.5x\"> <i class=\"fa fa-calendar-o fa-stack-2x\" style=\"color: #dd7d1b;\"></i>"
            + "<strong class=\"fa-stack-1x\" style=\"margin-top: .3em;\">" + date + "</strong> </span>";
            
            list.append("<li id=\"" + key + "\" style=\"padding-bottom: 10px; text-align: bottom;\"><a style=\"text-decoration: none;\" href=\"testEvent1.html\">" + html + "<strong style=\"font-size: 1.5em;\">&nbsp; " + value["name"]
                                        + "</strong></a></li>");
             document.getElementById(key).addEventListener("click", saveData);
        }); 
    }
});

function saveData()
{
   console.log("Hi guys!" + this.id);
   localStorage.setItem('selectedItem', JSON.stringify(missionData[parseInt(this.id, 10)]));
}