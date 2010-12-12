// This file was automatically generated from FileBrowser.soy.
// Please don't edit this file by hand.

if (typeof template == 'undefined') { var template = {}; }


template.fileBrowser = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('\t');
  if (opt_data.file.isDirectory) {
    if (opt_data.file.open) {
      output.append('<div class="folder-open"><div class="folder-name" data-fullFileName="', soy.$$escapeHtml(opt_data.file.fullFileName), '">', soy.$$escapeHtml(opt_data.file.fileName), '</div>');
      var subfileList13 = opt_data.file.files;
      var subfileListLen13 = subfileList13.length;
      for (var subfileIndex13 = 0; subfileIndex13 < subfileListLen13; subfileIndex13++) {
        var subfileData13 = subfileList13[subfileIndex13];
        template.fileBrowser({file: subfileData13}, output);
      }
      output.append('</div>');
    } else {
      output.append('<div class="folder-close"><div class="folder-name" data-fullFileName="', soy.$$escapeHtml(opt_data.file.fullFileName), '">', soy.$$escapeHtml(opt_data.file.fileName), '</div></div>');
    }
  } else {
    output.append('<div class="file js">', soy.$$escapeHtml(opt_data.file.fileName), '</div>');
  }
  if (!opt_sb) return output.toString();
};
