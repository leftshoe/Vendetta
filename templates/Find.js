// This file was automatically generated from Find.soy.
// Please don't edit this file by hand.

if (typeof template == 'undefined') { var template = {}; }


template.find = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('\t<div id="find-dialog-buttons"><div id="find-close"></div></div><div id="up-down"><div id="up"></div><div id="down"></div></div><div id="find-replace"><span class="label">Find</span><input type="text" id="find-input"><span class="label">Replace</span><input type="text" id="replace-input"></div><div id="find-options"><div id="check-regex" class="find-check"></div><span class="label">regex</span><div id="check-wrap" class="find-check"></div><span class="label">wrap</span><div id="check-case" class="find-check"></div><span class="label">case</span></div><div id="find-buttons"><div id="replace" class="button">replace</div><div id="replace-all" class="button">replace all</div></div>');
  if (!opt_sb) return output.toString();
};
