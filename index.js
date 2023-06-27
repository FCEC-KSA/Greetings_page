var languageStrings = {
    en: {
        greetingTitle: "Eid Greetings Page",
        enterYourName: "Enter your name:",
        chooseTemplate: "Choose a template:",
        generate: "Generate",
        pleaseSelectTemplate: "Please select a template"
    },
    ar: {
        greetingTitle: "صفحة تهاني العيد",
        enterYourName: "أدخل أسمك",
        chooseTemplate: "اختر قالبًا",
        generate: "يولد",
        pleaseSelectTemplate: "اختر قالبًا",
        fontFamily: 'Sakkal Majalla, sans-serif !important',
    }
};

function changeLanguage() {
    var lang = document.getElementById('language').value;
    var strings = languageStrings[lang];

    document.querySelector('h1').innerText = strings.greetingTitle;
    document.querySelector('label[for="name"]').innerText = strings.enterYourName;
    document.querySelector('label[for="template"]').innerText = strings.chooseTemplate;
    document.querySelector('.create').value = strings.generate;

    if (lang === 'ar') {
        document.querySelector('.container').style.direction = 'rtl';
    } else {
        document.querySelector('.container').style.direction = 'ltr';
    }
}


document.getElementById('language').addEventListener('change', changeLanguage);

// Call the function to set the initial language
changeLanguage();


var canvas = new fabric.Canvas('greetingDisplay');

let templateOptions = document.querySelectorAll('.template-option');
templateOptions.forEach(function(templateOption) {
    templateOption.addEventListener('click', function(event) {
        // Remove the 'selected' class from all the template options
        templateOptions.forEach(function(to) {
            to.classList.remove('selected');
        });

        // Add the 'selected' class to the clicked template option
        this.classList.add('selected');
    });
});



document.getElementById("greetingForm").addEventListener("submit", function(event){
    event.preventDefault();
    var name = document.getElementById("name").value;
    var selectedTemplate = document.querySelector('.template-option.selected');

    var lang = document.getElementById('language').value;
    var strings = languageStrings[lang];

        if (!selectedTemplate) {
        // Handle case when no template is selected
        alert(strings.pleaseSelectTemplate);
        return;
        }

         var template = selectedTemplate.dataset.template;

        // We wrap fabric.Image.fromURL in a promise
             new Promise((resolve, reject) => {
            fabric.Image.fromURL('assets/' + template, function(img) {
             resolve(img);
          });
        })
        .then(img => {
            // set the image dimensions to match the image
            canvas.setWidth(img.width);
            canvas.setHeight(img.height);
            img.set({
                width: img.width,
                height: img.height
            });
            canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));

            // create a text object
            var text = new fabric.IText(name, { left: 50,
                 top: 50,
                fontSize: 65,
                fill: '#035CA3',
                fontFamily: 'GraphikWide-Thin,sans-serif',  });

            text.set({

                globalAlpha: 0.5,
                // These two settings enable dragging
                hasBorders: true,
                lockMovementX: false,
                lockMovementY: false,

                // These settings keep the text within the canvas
                lockScalingX: true,
                lockScalingY: true,
                lockRotation: true,
                perPixelTargetFind: true,
            });

            canvas.centerObjectH(text);

            // Center the text vertically and adjust the position to just below center
             canvas.centerObjectV(text);
             text.top += text.height * 6.5;

            // add the text to the canvas
            canvas.add(text);

            // Event listener for moving the text
            canvas.on('object:moving', function(e) {
                var obj = e.target;
                // if object is too big ignore
                if(obj.currentHeight > obj.canvas.height || obj.currentWidth > obj.canvas.width){
                    return;
                }
                obj.setCoords();
                // top-left  corner
                if(obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0){
                    obj.top = Math.max(obj.top, obj.top-obj.getBoundingRect().top);
                    obj.left = Math.max(obj.left, obj.left-obj.getBoundingRect().left);
                }
                // bot-right corner
                if(obj.getBoundingRect().top+obj.getBoundingRect().height  > obj.canvas.height || obj.getBoundingRect().left+obj.getBoundingRect().width  > obj.canvas.width){
                    obj.top = Math.min(obj.top, obj.canvas.height-obj.getBoundingRect().height+obj.top-obj.getBoundingRect().top);
                    obj.left = Math.min(obj.left, obj.canvas.width-obj.getBoundingRect().width+obj.left-obj.getBoundingRect().left);
                }
            });

            // Download the canvas as an image
            let dataURL = canvas.toDataURL();

            // Save the dataURL to localStorage
            localStorage.setItem("generatedImage", dataURL);

            // Redirect the user to imagePage.html
            window.location.href = "imagePage.html";
        })
        .catch(error => {
            console.error('Error loading image:', error);
        });
});
