// This file was automatically generated from StartupDialog.soy.
// Please don't edit this file by hand.

if (typeof template == 'undefined') { var template = {}; }


template.startupDialog = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('\t<div class="startup-info">Press ESC to</div><div class="startup-mode-name">enter or exit META-mode</div>');
  if (!opt_sb) return output.toString();
};
