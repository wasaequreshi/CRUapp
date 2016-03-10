var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

var events = angular.module("EventCtrl");
describe('EventCtrl', function() {
  	describe('Checks if calendar dates are correctly formatted', function() {
    	it('checks if the time and date are correctly split', function() {
    		var array = events.getTimeAndDate("2015-10-15T19:00:00.000Z");
    		var date = array[0];
      		expect(date[0]).toEqual("2015");
      		expect(date[1]).toEqual("10");
      		expect(date[2]).toEqual("15");
      		expect(date[3]).toEqual(undefined);

      		var time = array[1];
      		expect(time[0]).toEqual("19");
      		expect(time[1]).toEqual("00");
      		expect(time[2]).toEqual("00.000Z");
      		expect(time[3]).toEqual(undefined);
    	});

    	it('checks if the date is correctly made for the plugin to use', function (){
			var array = events.getTimeAndDate("2015-10-15T19:00:00.000Z");
			var date = array[0];
			var time = array[1];
    		var dateFormatForPlugin = events.createDate(date, time);
    		var day = days[dateFormatForPlugin.getDay()];
    		var year = dateFormatForPlugin.getFullYear();
    		var hour = dateFormatForPlugin.getHours();
    		var min = dateFormatForPlugin.getMinutes();
    		var month = months[dateFormatForPlugin.getMonth()];

    		expect(day).toEqual("Thursday");
    		expect(year).toEqual(2015);
    		expect(hour).toEqual(19);
    		expect(min).toEqual(0);
    		expect(month).toEqual("October");

    	});
  });
});