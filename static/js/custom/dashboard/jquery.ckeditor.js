$(document).ready(function() {
});
function initEditor(index, elementId, placeholder, needToFlush){
	console.log(elementId+' = '+placeholder)
	if(index==1 && editor1){
		editor1.destroy();
	}
	if(index==2 && editor2){
		editor2.destroy();
	}
	if(index==3 && editor3){
		editor3.destroy();
	}
	if(index==4 && editor4){
		editor4.destroy();
	}
	if(needToFlush){
		$('#'+elementId).html('');
	}
	ClassicEditor
		.create( document.querySelector( '#'+elementId ), {
			 placeholder: placeholder
			// toolbar: [ 'heading', '|', 'bold', 'italic', 'link' ]
		} )
		.then( editor => {
			window.editor = editor;
		    if(index==1){
		    	editor1=editor;
			}else if(index==2){
		    	editor2=editor;
			}else if(index==3){
				editor3=editor;
			}else if(index==4){
		    	editor4=editor;
			}
		} )
		.catch( err => {
			console.error( err.stack );
		} );

}
