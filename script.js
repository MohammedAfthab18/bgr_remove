document.getElementById('imageUpload').addEventListener('change', handleImageUpload);

async function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = async () => {
            const inputCanvas = document.getElementById('inputImage');
            const outputCanvas = document.getElementById('outputImage');
            const inputCtx = inputCanvas.getContext('2d');
            const outputCtx = outputCanvas.getContext('2d');

            inputCanvas.width = img.width;
            inputCanvas.height = img.height;
            outputCanvas.width = img.width;
            outputCanvas.height = img.height;

            inputCtx.drawImage(img, 0, 0);

            const net = await bodyPix.load();

            const segmentation = await net.segmentPerson(img);

            const imageData = inputCtx.getImageData(0, 0, img.width, img.height);
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
                if (!segmentation.data[i / 4]) {
                    data[i + 3] = 0;
                }
            }
            outputCtx.putImageData(imageData, 0, 0);
        }
    }
}
