const saturate = document.getElementById("saturate");
const contrast = document.getElementById("contrast");
const brightness = document.getElementById("brightness");
const sepia = document.getElementById("sepia");
const grayscale = document.getElementById("grayscale");
const blurr = document.getElementById("blur");
const hueRotate = document.getElementById("hue-rotate");

const filters = document.querySelectorAll(".filter");
const image = document.getElementById("img");
const imgBox = document.querySelector(".img-box");

const downloadBtn = document.getElementById("download");
const uploadBtn = document.getElementById("upload");
const resetBtn = document.getElementById("reset");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

window.onload = () => {
    downloadBtn.style.display = "none";
    resetBtn.style.display = "none";
    imgBox.style.display = "none";
};

uploadBtn.addEventListener("change", () => {
    downloadBtn.style.display = "block";
    resetBtn.style.display = "block";
    imgBox.style.display = "block";
    let file = new FileReader();
    file.readAsDataURL(uploadBtn.files[0]);
    file.onload = () => {
        img.src = file.result;
    };
    image.onload = () => {
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        image.style.display = "none";
    };
});
