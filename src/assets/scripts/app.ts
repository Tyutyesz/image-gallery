import {IImage} from "./models/Image";

const $loader = document.querySelector(".loader");
const $activeElement = document.querySelector(".gallery__actualItem");
const $galleryImages = document.querySelector(".gallery__images");
const $next = document.querySelector(".gallery__button--next");
const $prev = document.querySelector(".gallery__button--prev");

let images: any[] | IImage[];
let isLoading = true;
let activeImage: IImage = {} as IImage;
let activeSmallImage;
let activeIndex = 0;

async function getImages() {
    const response = await fetch(`https://api.thecatapi.com/v1/images/search?limit=10`);
    return await response.json();
}
const init = () => {
    getImages().then((data: IImage[]) => {
        images = [...data];
        isLoading = false;
        toggleLoader();
        initGallery();
    })
}
const toggleLoader = () => {
    if(isLoading){
        $loader.classList.remove("d-none");
    } else {
        $loader.classList.add("d-none");
    }
}

const initGallery = () => {
    buildGalleryLayout();
}
const setActive = (newActive: IImage) => {
    activeImage = newActive;
    $activeElement.setAttribute("src", activeImage.url);

}
const buildGalleryLayout = () => {
    let element = undefined;
    images.forEach((image: IImage, index) => {
        element = document.createElement("img");
        element.setAttribute("src", image.url);
        element.setAttribute("alt", image.id);
        element.setAttribute("id", image.id);
        element.classList.add("gallery__image");
        if(index === activeIndex){
            element.classList.add("gallery__image--active");
            activeSmallImage = element;
            setActive(images[activeIndex]);
        }

        element.addEventListener("click", (e) => {
            //window.location.href = `#${image.id}`;
            clickImage(e.target, image);
            activeIndex = index;
        })

        $galleryImages.appendChild(element);

        element = undefined;

    })
    $next.addEventListener("click", next);
    $prev.addEventListener("click", prev);
}
const clickImage = (imgElement, img) => {
    if (activeSmallImage === imgElement){
        return;
    }
    activeSmallImage.classList.remove("gallery__image--active");
    activeSmallImage = imgElement;
    activeSmallImage.classList.add("gallery__image--active");
    setActive(img);
}
const next = () => {
    if(activeIndex < images.length - 1) {
        activeIndex ++;
    }
    setActive(images[activeIndex]);
    setActiveSmallImage(activeIndex);
}
const prev = () => {
    if(activeIndex > 0) {
        activeIndex --;
    }
    setActive(images[activeIndex]);
    setActiveSmallImage(activeIndex);
}
const setActiveSmallImage = (index) => {
    activeSmallImage.classList.remove("gallery__image--active");
    activeSmallImage = document.getElementById(images[index].id);
    activeSmallImage.classList.add("gallery__image--active");
}

window.addEventListener("DOMContentLoaded", init)
