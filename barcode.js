var video;
var canvas;
var detectedBarcodes;
var errorDiv;
var barcodeDetector;

function setup() {
	noCanvas();
	
	errorDiv = document.getElementById('error');
	canvas = document.getElementById('canvas');
	video = document.getElementById('video');

	var constraints = {video: {facingMode: 'environment'}};
	navigator.mediaDevices.getUserMedia(constraints)
		.then(function(mediaStream) {
			video.srcObject = mediaStream;
			video.onloadedmetadata = function(e) {
				video.play();
				canvas.width = video.videoWidth;
				canvas.height = video.videoHeight;
			};
		})
		.catch(function(err) {  }); 
}

function draw() {	
	if(typeof detectedBarcodes !== 'undefined'){
		for(barcode of detectedBarcodes){
			var ctx = canvas.getContext('2d');
			ctx.beginPath();
			ctx.lineWidth='6';
			ctx.strokeStyle='red';
			ctx.rect(barcode.boundingBox.x,barcode.boundingBox.y,barcode.boundingBox.width,barcode.boundingBox.height); 
			ctx.stroke();
			ctx.font='20px Arial';
			ctx.fillStyle = 'red';
			ctx.fillText(barcode.rawValue,barcode.boundingBox.x-5,(barcode.boundingBox.y+barcode.boundingBox.height+20));
		}
	}
}
	
async function getBarcodes(){
	canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
	
	if(!video.paused){
		try{
			barcodeDetector = new BarcodeDetector();
			const barcodes = await barcodeDetector.detect(canvas);
			detectedBarcodes = barcodes;
		}
		catch(exception) {
			errorDiv.innerText = exception;
		};
	}
}

setInterval(function(){ 
	getBarcodes() 
}, 200);