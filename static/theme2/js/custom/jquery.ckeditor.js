$(document).ready(function() {

});
function initEditor(index, elementId, placeholder, needToFlush, onChangeCallback){
	console.log(elementId + ' = ' + placeholder);

	const targetEl = document.querySelector('#' + elementId);
	if (!targetEl || typeof ClassicEditor === "undefined") {
		console.warn("initEditor skipped: element or ClassicEditor missing", elementId);
		return Promise.resolve(null);
	}

	if (index == 1 && editor1) {
		editor1.destroy();
	}
	if (index == 2 && editor2) {
		editor2.destroy();
	}
	if (index == 3 && editor3) {
		editor3.destroy();
	}
	if (index == 4 && editor4) {
		editor4.destroy();
	}

	if (needToFlush) {
		$('#' + elementId).html('');
	}

	return ClassicEditor
		.create(targetEl, {
			placeholder: placeholder,
			
		})
		.then(editor => {
			window.editor = editor;
			if (index == 1) {
				editor1 = editor;
			} else if (index == 2) {
				editor2 = editor;
			} else if (index == 3) {
				editor3 = editor;
			} else if (index == 4) {
				editor4 = editor;
			}
			if (typeof onChangeCallback === "function") {
				editor.model.document.on('change:data', () => {
					onChangeCallback(editor, elementId, elementId+"Counter");
				});
			}

			return editor;  // This return is now properly connected to the function
		})
		.catch(err => {
			console.error(err.stack);
		});
}
