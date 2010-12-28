// This file was automatically generated from FileBrowser.soy.
// Please don't edit this file by hand.

if (typeof template == 'undefined') { var template = {}; }


template.fileBrowser = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('\t<div class="file-browser-menu"><div class="file-browser-path">', soy.$$escapeHtml(opt_data.file.fullFileName), '</div><div class="file-browser-change-button">Change</div></div><div class="file-browser-scroller"><div class="file-browser-inner">');
  template.file({file: opt_data.file}, output);
  output.append('</div></div>');
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
        var subfileList29 = opt_data.file.files;
        var subfileListLen29 = subfileList29.length;
        for (var subfileIndex29 = 0; subfileIndex29 < subfileListLen29; subfileIndex29++) {
          var subfileData29 = subfileList29[subfileIndex29];
          template.file({file: subfileData29}, output);
        }
        output.append('</div>');
      }
    } else {
      output.append('<div class="file" data-fullFileName="', soy.$$escapeHtml(opt_data.file.fullFileName), '"><span class="extension ', soy.$$escapeHtml(opt_data.file.extension), '">', soy.$$escapeHtml(opt_data.file.extension), '</span>', soy.$$escapeHtml(opt_data.file.fileName), '</div>');
    }
  }
  if (!opt_sb) return output.toString();
};
