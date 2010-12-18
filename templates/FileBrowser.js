// This file was automatically generated from FileBrowser.soy.
// Please don't edit this file by hand.

if (typeof template == 'undefined') { var template = {}; }


template.fileBrowser = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('\t<div class="file-browser-inner">');
  template.file({file: opt_data.file}, output);
  output.append('</div>');
  if (!opt_sb) return output.toString();
};


template.file = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('\t');
  if (! opt_data.file.hidden) {
    if (opt_data.file.isDirectory) {
      output.append('<div class="folder-name ', (opt_data.file.open) ? ' folder-open ' : ' folder-close ', '" data-fullFileName="', soy.$$escapeHtml(opt_data.file.fullFileName), '">', soy.$$escapeHtml(opt_data.file.fileName), '</div>');
      if (opt_data.file.open) {
        output.append('<div class="folder-contents">');
        var subfileList27 = opt_data.file.files;
        var subfileListLen27 = subfileList27.length;
        for (var subfileIndex27 = 0; subfileIndex27 < subfileListLen27; subfileIndex27++) {
          var subfileData27 = subfileList27[subfileIndex27];
          template.file({file: subfileData27}, output);
        }
        output.append('</div>');
      }
    } else {
      output.append('<div class="file" data-fullFileName="', soy.$$escapeHtml(opt_data.file.fullFileName), '"><span class="extension ', soy.$$escapeHtml(opt_data.file.extension), '">', soy.$$escapeHtml(opt_data.file.extension), '</span>', soy.$$escapeHtml(opt_data.file.fileName), '</div>');
    }
  }
  if (!opt_sb) return output.toString();
};
