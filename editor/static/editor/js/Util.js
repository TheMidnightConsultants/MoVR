var Util = Util || {};

Util.getJson = function(url, callback) {
    var req = new XMLHttpRequest();
    req.open("get", url, true);
    req.responseType = "json";
    req.onload = function() {
      var status = req.status;
      if (status == 200) {
        callback(null, req.response);
      } else {
        callback(status);
      }
    };
    req.send();
};
