// This file was automatically generated from PromptToSave.soy.
// Please don't edit this file by hand.

if (typeof template == 'undefined') { var template = {}; }


template.promptToSave = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('\t<p>You have unsaved changes</p><button class="save close">save</button><button class="close-anyway close">close anyway</button><button class="cancel close">cancel</button>');
  if (!opt_sb) return output.toString();
};
