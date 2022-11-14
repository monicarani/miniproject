# coding=utf-8
import os
import cv2

# Flask utils
from flask import Flask, request, render_template,send_from_directory
from werkzeug.utils import secure_filename

# Define a flask app
app = Flask(__name__, static_url_path='')
app.secret_key = os.urandom(24)

app.config['CARTOON_FOLDER'] = 'cartoon_images'
app.config['UPLOAD_FOLDER'] = 'uploads'

@app.route('/', methods=['GET'])
def index():
    # Main page
    return render_template('index.html')
    
@app.route('/uploads/<filename>')
def upload_img(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/cartoon_images/<filename>')
def cartoon_img(filename):
    return send_from_directory(app.config['CARTOON_FOLDER'], filename)

def cartoonize(img):
    grayScaleImage = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    smoothGrayScale = cv2.medianBlur(grayScaleImage, 5)
    getEdge = cv2.adaptiveThreshold(smoothGrayScale, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY, 9, 9)
    colorImage = cv2.bilateralFilter(img, 9, 300, 300)
    cartoonImage = cv2.bitwise_and(colorImage, colorImage, mask=getEdge)
    return cartoonImage

@app.route('/predict', methods=['GET', 'POST'])
def predict():
    if request.method == 'POST':
        # Get the file from post request
        f = request.files['file']
        # Save the file to ./uploads
        basepath = os.path.dirname(__file__)
        file_path = os.path.join(basepath, 'uploads', secure_filename(f.filename))
        f.save(file_path)
        file_name=os.path.basename(file_path)
        # reading the uploaded image
        img = cv2.imread(file_path)
        cart_fname =file_name + "_style_cartoon.jpg"
        cartoonized = cartoonize(img)
        cartoon_path = os.path.join(basepath, 'cartoon_images', secure_filename(cart_fname))
        fname=os.path.basename(cartoon_path)
        cv2.imwrite(cartoon_path,cartoonized)
        return render_template('predict.html',file_name=file_name, cartoon_file=fname)
    return ""

if __name__ == '__main__':
    app.run(debug=True, host="localhost", port=8080)