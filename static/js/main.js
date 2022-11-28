

$("input[type='image']").click(function() {
    $("input[id='my_file']").click();
});

$(document).ready(function() {
    $(function() { 
        $('#theText').draggable({
            containment: 'parent'     // set draggable area.
        }); 
    });
});

let textContainer;
    let t = 'sample text';

    // Get the values that you have entered in the textarea and
    // write it in the DIV over the image.

    let writeText = (ele) => {
        t = ele.value;
        document.getElementById('theText').innerHTML = t.replace(/\n\r?/g, '<br />');
    }
 
    // Finally, save the image with text over it.
    let saveImageWithText = () => {
        textContainer = document.getElementById('theText');     // The element with the text.
    
        // Create an image object.
        let img = new Image();
        img.src = document.getElementById('myimage').src;
        console.log(img.src);
        // Create a canvas object.
        var canvas = document.getElementById('imageCanvas');
        
        // Wait till the image is loaded.
        img.onload = function(){
            drawImage();
            downloadImage(img.src.replace(/^.*[\\\/]/, ''));    // Download the processed image.
        }
        
        // Draw the image on the canvas.
        let drawImage = () => {
            let ctx = canvas.getContext("2d");	// Create canvas context.
            var image=document.getElementById("mainimage");
            // Assign width and height.
            canvas.width = img.width;
            canvas.height = img.height;

          	// Draw the image.
            ctx.drawImage(image, 0, 0);
            
            textContainer.style.border = 0;
            
            // Get the padding etc.
            let left = parseInt(window.getComputedStyle(textContainer).left);
            let right = textContainer.getBoundingClientRect().right;
            let top = parseInt(window.getComputedStyle(textContainer).top, 0);
            let center = textContainer.getBoundingClientRect().width / 2;

            let paddingTop = window.getComputedStyle(textContainer).paddingTop.replace('px', '');
            let paddingLeft = window.getComputedStyle(textContainer).paddingLeft.replace('px', '');
            let paddingRight = window.getComputedStyle(textContainer).paddingRight.replace('px', '');
            
            // Get text alignement, colour and font of the text.
            let txtAlign = window.getComputedStyle(textContainer).textAlign;
            let color = window.getComputedStyle(textContainer).color;
            //let fnt = window.getComputedStyle(textContainer).font;
            
            // Assign text properties to the context.
            ctx.font = "bold 60px verdena, Stylish";
            ctx.fillStyle = color;
            ctx.textAlign = txtAlign;
			
            // Now, we need the coordinates of the text.
            let x; 		// coordinate.
            if (txtAlign === 'right') {
            	x = right + parseInt(paddingRight) - 11;
            }
            if (txtAlign === 'left') {
            	x = left + parseInt(paddingLeft);
            }
            if (txtAlign === 'center') {
            	x = center + left;
            }

            // Get the text (it can a word or a sentence) to write over the image.
            let str = t.replace(/\n\r?/g, '<br />').split('<br />');

            // finally, draw the text using Canvas fillText() method.
            for (let i = 0; i <= str.length - 1; i++) {
            	
                ctx.fillText(
                    str[i]
                        .replace('</div>','')
                        .replace('<br>', '')
                        .replace(';',''), 
                    x+25, 
                    parseInt(paddingTop, 10) + parseInt(top, 10) + 10 + (i * 15)+25);
            }
            

            //document.body.append(canvas);  // Show the image with the text on the Canvas.
        }
        let downloadImage = (img_name) => {
            let a = document.createElement('a');
            a.href = canvas.toDataURL("image/png");
            a.download = img_name;
            document.body.appendChild(a);
            a.click();        
        }
    }