/* eslint-env jquery */
// eslint-disable-next-line no-unused-vars
function CamaGetTinymceSettings(settings) {
  if (!settings) settings = {}
  const def = {
    selector: '.tinymce_textarea',
    plugins: 'advlist autolink lists link image charmap print preview hr anchor pagebreak searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking save table contextmenu directionality emoticons template paste textcolor colorpicker textpattern filemanager',
    menubar: 'edit insert view format table tools',
    image_advtab: true,
    statusbar: true,
    paste: true,
    toolbar_items_size: 'small',
    content_css: tinymce_global_settings.custom_css.join(','),
    convert_urls: false,
    // forced_root_block: '',
    extended_valid_elements: 'i[*],div[*],p[*],li[*],a[*],ol[*],ul[*],span[*]',
    toolbar: 'bold italic | alignleft aligncenter alignright alignjustify | fontselect fontsizeselect | bullist numlist | outdent indent | undo redo | link unlink image media | forecolor backcolor | styleselect template ' + tinymce_global_settings.custom_toolbar.join(','),
    image_caption: true,
    language: CURRENT_LOCALE,
    relative_urls: false,
    remove_script_host: false,
    browser_spellcheck: true,
    language_url: tinymce_global_settings.language_url,
    file_browser_callback: function (fieldName, url, type, win) {
      $.fn.upload_filemanager({
        formats: type,
        selected: function (file, response) {
          $('#' + fieldName).val(file.url)
        }
      })
    },
    fix_list_elements: true,
    setup: function (editor) {
      editor.on('blur', function () {
        tinymce.triggerSave()
        $('textarea#' + editor.id).trigger('change')
      })

      editor.on('PostProcess', function (ed) {
        ed.content = ed.content.replace(/(<p><\/p>)/gi, '<br />')
      })

      editor.ui.registry.addMenuItem('append_line', {
        text: 'New line at the end',
        context: 'insert',
        onclick: function () { editor.dom.add(editor.getBody(), 'p', {}, '-New line-'); }
      });
      editor.ui.registry.addMenuItem('add_line', {
        text: 'New line',
        context: 'insert',
        onclick: function () { editor.insertContent('<p>-New line-</p>'); }
      });

      // eval all extra setups
      for (const ff in tinymce_global_settings.setups) tinymce_global_settings.setups[ff](editor)

      editor.on('init', function (e) {
        for (const ff in tinymce_global_settings.init) tinymce_global_settings.init[ff](editor)
      })
    }
  }
  for (const ff in tinymce_global_settings.settings) tinymce_global_settings.settings[ff](settings, def)
  return $.extend({}, def, settings)
}
