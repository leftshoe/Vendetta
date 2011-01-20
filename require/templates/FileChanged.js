// This file was automatically generated from FileChanged.soy.
// Please don't edit this file by hand.

if (typeof template == 'undefined') { var template = {}; }


template.fileChanged = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('\t<p>The file ', soy.$$escapeHtml(opt_data.fileName), ' has changed outside of Vendetta.</p><button class="keep-changes close">Stick with my changes</button><button class="revert close">revert to the outside changes</button>');
  if (!opt_sb) return output.toString();
};
