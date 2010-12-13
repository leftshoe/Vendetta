// This file was automatically generated from FileBrowser.soy.
// Please don't edit this file by hand.

if (typeof template == 'undefined') { var template = {}; }


template.fileBrowser = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('\t');
  if (opt_data.file.isDirectory) {
    output.append('<div class="folder-name ', (opt_data.file.open) ? ' folder-open ' : ' folder-close ', '" data-fullFileName="', soy.$$escapeHtml(opt_data.file.fullFileName), '">', soy.$$escapeHtml(opt_data.file.fileName), '</div>');
    if (opt_data.file.open) {
      output.append('<div class="folder-contents">');
      var subfileList20 = opt_data.file.files;
      var subfileListLen20 = subfileList20.length;
      for (var subfileIndex20 = 0; subfileIndex20 < subfileListLen20; subfileIndex20++) {
        var subfileData20 = subfileList20[subfileIndex20];
        template.fileBrowser({file: subfileData20}, output);
      }
      output.append('</div>');
    }
  } else {
    output.append('<div class="file js">', soy.$$escapeHtml(opt_data.file.fileName), '</div>');
  }
  if (!opt_sb) return output.toString();
};
