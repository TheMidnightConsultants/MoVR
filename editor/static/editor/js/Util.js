var Util = Util || {};

Util.POST = function(url, args, callback) {
    var req = new XMLHttpRequest();
	var csrftoken = Util.getCookie('csrftoken');
    req.open('post', url, true);
    req.responseType = 'json'; 
	req.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
	req.setRequestHeader('X-CSRFToken', csrftoken);
    req.onload = function() {
      var status = req.status;
      if (status == 200) {
        callback(null, req.response);
      } else {
        callback(status);
      }
    };
	var data = JSON.stringify(args);
	console.log(data);
    req.send(data);
};

Util.getCookie = function (name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}