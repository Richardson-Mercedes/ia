const btnStart = document.querySelector("#btn-start");
const btnStop = document.querySelector("#btn-stop");
let hideStartButton = false, started = false;

/*btnStart.addEventListener("click", () => {
    if (!hideStartButton) {
        hideStartButton = true;
        btnStart.classList.add("hide");
        btnStop.classList.remove("hide");
    } else {
        hideStartButton = false;
        btnStart.classList.remove("hide");
        btnStop.classList.remove("hide");
    }
});*/

btnStart.addEventListener("click", () => {
    btnStart.textContent = "Starting...";
});

// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

// the link to your model provided by Teachable Machine export panel
//const URL = "../data/";
const URL = "http://127.0.0.1:5500/data/";

let model, webcam, labelContainer, maxPredictions;

// Load the image model and setup the webcam
async function init() {
    if (!started) {
        started = true;

        const modelURL = URL + "model-1.json";
        const metadataURL = URL + "metadata-1.json";

        // load the model and metadata
        // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
        // or files from your local hard drive
        // Note: the pose library adds "tmImage" object to your window (window.tmImage)
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        // Convenience function to setup a webcam
        const flip = true; // whether to flip the webcam
        webcam = new tmImage.Webcam(1000, 700, flip); // width, height, flip /* Original: 200, 200, flip */
        await webcam.setup(); // request access to the webcam
        await webcam.play();
        window.requestAnimationFrame(loop);

        // append elements to the DOM
        document.getElementById("webcam-container").appendChild(webcam.canvas);
        labelContainer = document.getElementById("label-container");
        for (let i = 0; i < maxPredictions; i++) { // and class labels
            labelContainer.appendChild(document.createElement("div"));
        }
    } else {
        console.log("Ya ha iniciado");
    }
}

async function loop() {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
}

// run the webcam image through the image model
async function predict() {
    // predict can take in an image, video or canvas html element
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        //const classPrediction = prediction[i].className + ": " + prediction[i].probability.toFixed(2); - Oroginal
        //labelContainer.childNodes[i].innerHTML = classPrediction; - Oroginal

        const classPrediction2 = `<span class="className">${prediction[i].className}</span><input type="range" id="range-${i}" min="0" max="1" step="0.01" value=${prediction[i].probability.toFixed(2)} readonly>` + (prediction[i].probability * 100).toFixed(0) + "%";
        labelContainer.childNodes[i].innerHTML = classPrediction2;
    }

    // Added

    if (!hideStartButton) {
        hideStartButton = true;
        btnStart.classList.add("hide");
        btnStop.classList.remove("hide");
    }

    document.querySelector("#webcam-container").style.display = "flex";
    document.querySelector("#label-container").style.display = "block";
    //document.querySelector(".go-back").style.display = "block";

}



btnStop.addEventListener("click", () => {
    /*console.log("Cancelar");
    
    if (hideStartButton) {
        hideStartButton = false;
        btnStart.classList.add("hide");
        btnStop.classList.remove("hide");
    }
    
    console.log("Cancelado");*/

    window.location.reload();
});