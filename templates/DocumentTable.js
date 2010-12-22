// This file was automatically generated from DocumentTable.soy.
// Please don't edit this file by hand.

if (typeof template == 'undefined') { var template = {}; }


template.documentTable = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('\t<div class="document-table-menu"></div><ul class="document-table-list">');
  var docList4 = opt_data.documents;
  var docListLen4 = docList4.length;
  for (var docIndex4 = 0; docIndex4 < docListLen4; docIndex4++) {
    var docData4 = docList4[docIndex4];
    template.documentTableRow({doc: docData4}, output);
  }
  output.append('</ul>');
  if (!opt_sb) return output.toString();
};


template.documentTableRow = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('\t<li class="document-row ', (opt_data.doc.active) ? 'active' : '', '" data-id="', soy.$$escapeHtml(opt_data.doc.id), '"><div class="document-info"><div class="file-name">', soy.$$escapeHtml(opt_data.doc.fileName), '</div><div class="directory">', soy.$$escapeHtml(opt_data.doc.directory), '</div></div><div class="document-close" data-id="', soy.$$escapeHtml(opt_data.doc.id), '"></div></li>');
  if (!opt_sb) return output.toString();
};
