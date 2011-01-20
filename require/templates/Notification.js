// This file was automatically generated from Notification.soy.
// Please don't edit this file by hand.

if (typeof template == 'undefined') { var template = {}; }


template.notification = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('\t<span class="msg">', soy.$$escapeHtml(opt_data.msg), '</span>');
  if (!opt_sb) return output.toString();
};
