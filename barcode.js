var video;
var canvas;
var barcodeDetector;
var barcodeValue;
var barcodeBox;
var errorDiv;

function setup() {
	noCanvas();
	
	errorDiv = document.getElementById('error');
	canvas = document.getElementById('canvas');
	
	var constraints = {video: {facingMode: 'environment'}};
	navigator.mediaDevices.getUserMedia(constraints)
		.then(function(mediaStream) {
			var video = document.getElementById('video');
			video.srcObject = mediaStream;
			video.onloadedmetadata = function(e) {
				video.play();
			};
		})
		.catch(function(err) { errorDiv.innerText = err.name + ': ' + err.message; }); 
}

function draw() {	
	if(typeof barcodeBox !== 'undefined'){
		var ctx = canvas.getContext('2d');
		ctx.beginPath();
		ctx.lineWidth='6';
		ctx.strokeStyle='red';
		ctx.rect(barcodeBox.x,barcodeBox.y,barcodeBox.width,barcodeBox.height); 
		ctx.stroke();
		ctx.font='20px Arial';
		ctx.fillStyle = 'red';
		ctx.fillText(barcodeValue,barcodeBox.x-5,(barcodeBox.y+barcodeBox.height+20));
	}
}
	
async function getBarcode(){
	try {
		barcodeDetector = new BarcodeDetector();
		const barcodes = await barcodeDetector.detect(canvas);
		barcodes.forEach(barcode => {
			barcodeValue = barcode.rawValue;
			barcodeBox = barcode.boundingBox;
		});
	} catch (exception) {
		errorDiv.innerText = exception;
	}
}

setInterval(function(){ 
	getBarcode() 
}, 100);