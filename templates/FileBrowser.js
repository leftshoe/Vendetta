// This file was automatically generated from FileBrowser.soy.
// Please don't edit this file by hand.

if (typeof template == 'undefined') { var template = {}; }


template.fileBrowser = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('\t');
  if (opt_data.file.isDirectory) {
    output.append('<div class="folder-open"><div class="folder-name">', soy.$$escapeHtml(opt_data.file.fileName), '</div>');
    var subfileList9 = opt_data.file.files;
    var subfileListLen9 = subfileList9.length;
    for (var subfileIndex9 = 0; subfileIndex9 < subfileListLen9; subfileIndex9++) {
      var subfileData9 = subfileList9[subfileIndex9];
      template.FileBrowser({file: subfileData9}, output);
    }
    output.append('</div>');
  } else {
    output.append('<div class="file js">', soy.$$escapeHtml(opt_data.file.fileName), '</div>');
  }
  if (!opt_sb) return output.toString();
};
