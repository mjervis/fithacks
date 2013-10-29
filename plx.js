$(document).ready( function () {
   upgradeToPay();
   getTcx();
});

function upgradeToPay()
{
   if (window.user)
   {
      window.user.isFree = false;
   }
}

function getTcx()
{
   var wid = $('input[name=selected-log-id-base]').attr('value');
   if(typeof(ifit) != 'undefined')
   {
      ifit.log.getWorkoutLog(wid, !0, function (dunno, feed) {createTcx(feed)});
   } else {
      createTcx(jQuery.parseJSON($('#foo').val()));
   }   
   
}

function createTcx(feed)
{
  w = feed.workoutLog;
  var tcx = '<?xml version="1.0" encoding="UTF-8"?>\n'
  tcx += '<TrainingCenterDatabase version="1.0" creator="plx (x)" xsi:schemaLocation="http://www.garmin.com/xmlschemas/TrainingCenterDatabase/v2 http://www.garmin.com/xmlschemas/TrainingCenterDatabasev2.xsd" xmlns:ns5="http://www.garmin.com/xmlschemas/ActivityGoals/v1" xmlns:ns3="http://www.garmin.com/xmlschemas/ActivityExtension/v2" xmlns:ns2="http://www.garmin.com/xmlschemas/UserProfile/v2" xmlns="http://www.garmin.com/xmlschemas/TrainingCenterDatabase/v2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:ns4="http://www.garmin.com/xmlschemas/ProfileExtension/v1">\n';
  tcx += "<Activities>\n"
  tcx += "<Activity Sport=\"" + w.type +  "\">\n";
  tcx += '<Id>' + w.timestamp + '</Id>\n';
  tcx += '<Lap StartTime="' + w.timestamp + '">\n' +
        '<TotalTimeSeconds>' + (w.duration / 1000) + '</TotalTimeSeconds>\n' +
        '<DistanceMeters>' + w.distance + '</DistanceMeters>\n' +
        '<AverageHeartRateBpm>\n' + 
          '<Value>' + Math.round(w.avg_hr) + '</Value>\n' +
        '</AverageHeartRateBpm>\n' +
        '<MaximumHeartRateBpm>\n' +
          '<Value>' + w.max_hr + '</Value>\n' +
        '</MaximumHeartRateBpm>\n' +
        '<TriggerMethod>Manual</TriggerMethod>\n' +
        '<Track>';
        
  tcx += trackPoints(w.stats);
  
  tcx += '</Track>\n'+
'      </Lap>\n'+
'    </Activity>\n'+
'  </Activities>\n'+
'</TrainingCenterDatabase>';
   displayTcx(tcx);
}

function displayTcx(tcx)
{
   if(!$('#foo2').length)
   {
      var foo = $('<textarea id="foo2" rows="20" cols="80"></textarea>');
      $('body').append(foo);
   }
    $('#foo2').val(tcx);
}

function trackPoints(stats)
{
   var points = '';
   for(i = 0; i < stats.bpm.values.length; i++)
   {
      time = stats.bpm.values[i][0];
      bpm = stats.bpm.values[i][1];
      distance = stats.meters.values[i][1];
      points += trackPoint(d(time), bpm, distance);
   }
   return points;
}

function d(t)
{
   var date = new Date(t);
   date = date.getFullYear() + '-' + zpad(date.getMonth()) + '-' + zpad(date.getDate()) + 'T' + zpad(date.getHours()) + ':' +
      zpad(date.getMinutes()) + ':' + zpad(date.getSeconds()) + 'Z';
   return date;
}

function zpad(n)
{
   n = '' + n;
   while(n.length < 2)
   {
      n = '0' + n;
   }
   return n;
}

function trackPoint(time, bpm, distance)
{
   var point = '<Trackpoint>\n' + 
          '  <Time>' + time + '</Time>\n' +
          '  <HeartRateBpm>\n' +
          '    <Value>' + bpm + '</Value>\n' +
          '  </HeartRateBpm>\n' +
          '  <DistanceMeters>' + distance + '</DistanceMeters>\n' +
          '</Trackpoint>\n';
   return point;
}