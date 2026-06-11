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
