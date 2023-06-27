document.querySelectorAll(".template-option").forEach(function(templateOption) {
    templateOption.addEventListener("click", function(event){
        document.querySelector(".template-option.selected")?.classList.remove("selected");
        this.classList.add("selected");
    });
});

var canvas = new fabric.Canvas('greetingDisplay', {
    preserveObjectStacking: true,
});

document.getElementById("greetingForm").addEventListener("submit", function(event){
    event.preventDefault();
    var name = document.getElementById("name").value;
    var selectedTemplate = document.querySelector('.template-option.selected');
    if (selectedTemplate) {
        var template = selectedTemplate.dataset.template;

        fabric.Image.fromURL('assets/' + template, function(img) {
            // Get the scale
            var scale = Math.min(
                canvas.getWidth() / img.getWidth(),
                canvas.getHeight() / img.getHeight()
            );

            // Set the image dimensions to the scale
            img.set({
                scaleX: scale,
                scaleY: scale
            });

            canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));

            // create a text object
            var text = new fabric.IText(name, {
                left: 10,
                top: 10,
                fontSize: 30,
                fill: 'white',
                borderColor: 'black',
                cornerColor: 'black',
                cornerSize: 12,
                transparentCorners: false,
                hasRotatingPoint: false,
            });

            canvas.add(text);

            canvas.on('object:moving', function (e) {
                var obj = e.target;
                // if object is too large ignore
                if(obj.getHeight() > obj.canvas.getHeight() || obj.getWidth() > obj.canvas.getWidth()){
                    return;
                }
                obj.setCoords();
                // top-left corner
                if(obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0){
                    obj.top = Math.max(obj.top, obj.top-obj.getBoundingRect().top);
                    obj.left = Math.max(obj.left, obj.left-obj.getBoundingRect().left);
                }
                // bot-right corner
                if(obj.getBoundingRect().height+obj.getBoundingRect().top  > obj.canvas.getHeight() || obj.getBoundingRect().width+obj.getBoundingRect().left  > obj.canvas.getWidth()){
                    obj.top = Math.min(obj.top, obj.canvas.getHeight()-obj.getBoundingRect().height+obj.top-obj.getBoundingRect().top);
                    obj.left = Math.min(obj.left, obj.canvas.getWidth()-obj.getBoundingRect().width+obj.left-obj.getBoundingRect().left);
                }
            });

            // Displaying the canvas after image has been loaded
            document.getElementById("greetingDisplay").style.display = 'block';
            document.getElementById("downloadBtn").style.display = 'block';
        });
    } else {
        // Handle case when no template is selected
        alert("Please select a template");
    }
});

document.getElementById("downloadBtn").addEventListener("click", function(event){
    // Download the canvas as an image
    let dataURL = canvas.toDataURL({format: 'png', quality: 0.8});
    let a = document.createElement('a');
    a.href = dataURL;
    a.download = 'greeting-card.png';
    a.click();
});
