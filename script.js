var file_upload, convert_button, download_button;
var canvas, context;
var file;
var image, img = [];

function init() {
	setupElements();
	setupListeners();
}

function setupElements() {
	file_upload = document.getElementById("file_upload");
	convert_button = document.getElementById("convert_button");
	download_button = document.getElementById("download_button");
	canvas = document.getElementById("canvas");
	context = canvas.getContext ("2d");
}

function setupListeners() {
	file_upload.addEventListener ("change", function() {
		this.disabled = true;
		convert_button.disabled = false;

		file = file_upload.files[0];

		var reader = new FileReader();

		reader.onload = (function (f) {
			return function (event) {
				var image = new Image;

				image.onload = function() {
					canvas.width = image.width;
					canvas.height = image.height;

					context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height); // Or at whatever offset you like
				};
  
				image.src = event.target.result;
			};
		}) (file);

		reader.readAsDataURL (file);
	}, false);

	convert_button.addEventListener ("click", function() {
		this.disabled = true;
		download_button.disabled = false;

		getImageMatrix();
		cartoonify();
		putImageMatrix();
	}, false);

	download_button.addEventListener ("click", function() {
		this.disabled = true;
	}, false);
}

function getImageMatrix() {
	image = context.getImageData (0, 0, canvas.width, canvas.height);
	var r, g, b, a;
	var index = 0;

	console.log (image.width + " " + image.height + " " + image.data.length);

	for (var i = 0; i < image.height; i++) {
		img.push ([]);

		for (var j = 0; j < image.width; j++) {
			r = image.data [index];
			g = image.data [index + 1];
			b = image.data [index + 2];
			a = image.data [index + 3];

			img [i].push (new Pixel (r, g, b, a));
			index +=  4;
		}
	}

	console.log (img.length + " " + img[0].length + " " + 4 * img.length * img[0].length);
	console.log (img);
}

function cartoonify() {
	var i, j;
	var r, g, b, a;
	var random;

	for (i = 1; i < image.height - 1; i++) {
		for (j = 1; j < image.width - 1; j++) {
			random = Math.floor (Math.random() * (127 - 0 + 1)) + 0;

			r = random ^ (img[i - 1][j - 1].red + img[i - 1][j].red + img[i - 1][j + 1].red + img[i][j - 1].red + 2 * img[i][j].red + img[i][j + 1].red + img[i + 1][j - 1].red + img[i + 1][j].red + img[i + 1][j + 1].red) / 10;
			g = random ^ (img[i - 1][j - 1].green + img[i - 1][j].green + img[i - 1][j + 1].green + img[i][j - 1].green + 2 * img[i][j].green + img[i][j + 1].green + img[i + 1][j - 1].green + img[i + 1][j].green + img[i + 1][j + 1].green) / 10;
			b = random ^ (img[i - 1][j - 1].blue + img[i - 1][j].blue + img[i - 1][j + 1].blue + img[i][j - 1].blue + 2 * img[i][j].blue + img[i][j + 1].blue + img[i + 1][j - 1].blue + img[i + 1][j].blue + img[i + 1][j + 1].blue) / 10;
			a = random ^ (img[i - 1][j - 1].alpha + img[i - 1][j].alpha + img[i - 1][j + 1].alpha + img[i][j - 1].alpha + 2 * img[i][j].alpha + img[i][j + 1].alpha + img[i + 1][j - 1].alpha + img[i + 1][j].alpha + img[i + 1][j + 1].alpha) / 10;

			img[i][j].red = r;
			img[i][j].green = g;
			img[i][j].blue = b;
			img[i][j].alpha = a;
		}
	}
}

function putImageMatrix() {
	var i, j;
	var index = 0;

	for (i = 0; i < image.height; i++) {
		for (j = 0; j < image.width; j++) {
			image.data [index] = img [i][j].red;
			image.data [index + 1] = img [i][j].green;
			image.data [index + 2] = img [i][j].blue;
			image.data [index + 3] = img [i][j].alpha;

			index +=  4;
		}
	}

	context.putImageData (image, 0, 0, 0, 0, image.width, image.height);
}

class Pixel {
	constructor(r, g, b, a) {
		this.red = r;
		this.green = g;
		this.blue = b;
		this.alpha = a;
	}
}