"use strict";


window.addEventListener("load", setupGallery);

function setupGallery() {
  let imageCount = imgFiles.length;
  let slidesTitle = lightboxTitle;
  let galleryBox = document.getElementById("lightbox");
  let currentSlide = 1;
  let runShow = true;
  let showRunning;

  let galleryTitle = document.createElement("h1");
  galleryTitle.id = "galleryTitle";
  galleryTitle.id = "lbTitle";
  galleryTitle.textContent = slidesTitle;
  galleryBox.appendChild(galleryTitle);

  let slideCounter = document.createElement("div");
  slideCounter.id = "slideCounter";
  slideCounter.id = "lbCounter";
  slideCounter.textContent = currentSlide + "/" + imageCount;
  galleryBox.appendChild(slideCounter);

  let leftBox = document.createElement("div");
  leftBox.id = "leftBox";
  leftBox.id = "lbPrev";
  leftBox.innerHTML = "&#9664;";
  leftBox.onclick = moveToLeft;
  galleryBox.appendChild(leftBox);

  let rightBox = document.createElement("div");
  rightBox.id = "rightBox";
  rightBox.id = "lbNext";
  rightBox.innerHTML = "&#9654;";
  rightBox.onclick = moveToRight;
  galleryBox.appendChild(rightBox);

  let playPause = document.createElement("div");
  playPause.id = "playPause";
  playPause.id = "lbPlay";
  playPause.innerHTML = "&#9199;";
  playPause.onclick = startStopShow;
  galleryBox.appendChild(playPause);

  let favoriteImagesLink = document.createElement("div");
  favoriteImagesLink.id = "favoriteImagesLink";
  favoriteImagesLink.innerHTML = "Click to view favorite images";
  favoriteImagesLink.onclick = createFavoriteImageModal;
  galleryBox.appendChild(favoriteImagesLink);

  let slideBox = document.createElement("div");
  slideBox.id = "slideBox";
  slideBox.id = "lbImages";
  galleryBox.appendChild(slideBox);

  for (let i = 0; i < imageCount; i++) {
    let image = document.createElement("img");
    image.src = imgFiles[i];
    image.alt = imgCaptions[i];
    image.onclick = createModal;
    slideBox.appendChild(image);
  }

  //This function slide images to right
  function moveToRight() {
    let firstImage = slideBox.firstElementChild.cloneNode("true");
    firstImage.onclick = createModal;
    slideBox.appendChild(firstImage);
    slideBox.removeChild(slideBox.firstElementChild);
    currentSlide++;
    if (currentSlide > imageCount) {
      currentSlide = 1;
    }
    slideCounter.textContent = currentSlide + " / " + imageCount;
  }

  //This function slide images to left
  function moveToLeft() {
    let lastImage = slideBox.lastElementChild.cloneNode("true");
    lastImage.onclick = createModal;
    slideBox.removeChild(slideBox.lastElementChild);
    slideBox.insertBefore(lastImage, slideBox.firstElementChild);
    currentSlide--;
    if (currentSlide === 0) {
      currentSlide = imageCount;
    }
    slideCounter.textContent = currentSlide + " / " + imageCount;
  }

  //This function stop and start images automation
  function startStopShow() {
    if (runShow) {
      showRunning = window.setInterval(moveToRight, 2000);
      runShow = false;
    } else {
      window.clearInterval(showRunning);
      runShow = true;
    }
  }

  //This variable (array) saves favorite images when user click  "add to favorite"
  let favImgs = [];

  //This function open the favorite image page and remove an image as well
  function createFavoriteImageModal() {
    let imgFavWindow = document.createElement("div");
    favoriteImagesLink.appendChild(imgFavWindow);
    imgFavWindow.id = "activeFavWindow";
    imgFavWindow.id = "FavWindowOverlay";
    let figureBoxContainer = document.createElement("div");
    imgFavWindow.appendChild(figureBoxContainer);

    if (favImgs.length == 0) {
      //if no image is added
      let noItem = document.createElement("div");
      noItem.innerHTML = "Nothing has been added";
      noItem.id = "noIten";
      imgFavWindow.appendChild(noItem);
    } else {
      //if image is added
      favImgs.forEach((element) => {
        let figureBox = document.createElement("figure");
        figureBoxContainer.appendChild(figureBox);
        let image = document.createElement("img");
        image.src = element.src;
        image.alt = element.alt;
        figureBox.appendChild(image);

        let figureCaption = document.createElement("figcaption");
        figureCaption.textContent = element.alt;
        figureBox.appendChild(figureCaption);

        let removeImage = document.createElement("p");
        removeImage.id = "removeItem";
        removeImage.textContent = "Remove image from favorite";
        removeImage.onclick = () => {
          for (let i = 0; i < favImgs.length; i++) {
            if (favImgs[i].src == element.src) {
              favImgs.splice(i, 1);
              document.body.removeChild(imgFavWindow);
              return (favImgs = favImgs);
            }
          }
        };
        figureBox.appendChild(removeImage);
      });
    }

    let closeBox = document.createElement("div"); //Close favorite image modal
    closeBox.id = "modalClose";
    closeBox.id = "FavWindowOverlayClose";
    closeBox.innerHTML = "&times;";
    closeBox.onclick = function () {
      document.body.removeChild(imgFavWindow);
    };
    imgFavWindow.appendChild(closeBox);
    document.body.appendChild(imgFavWindow);
  }

  //This function open a modal for a clicked image
  function createModal() {
    let modalWindow = document.createElement("div");
    modalWindow.id = "activeModal";
    modalWindow.id = "lbOverlay";
    let figureBox = document.createElement("figure");
    modalWindow.appendChild(figureBox);

    let modalImage = this.cloneNode("true"); //gets the image clicked
    figureBox.appendChild(modalImage);

    let figureCaption = document.createElement("figcaption");
    figureCaption.textContent = modalImage.alt;
    figureBox.appendChild(figureCaption);

    let closeBox = document.createElement("div"); //Close modal
    closeBox.id = "modalClose";
    closeBox.id = "lbOverlayClose";
    closeBox.innerHTML = "&times;";
    closeBox.onclick = function () {
      document.body.removeChild(modalWindow);
    };
    modalWindow.appendChild(closeBox);

    let addToFavorites = document.createElement("div");
    addToFavorites.id = "lbOverlayAdd";

    let addToFavoritesIcon = document.createElement("div");
    addToFavoritesIcon.id = "lbAddToFavoritesIcon";
    addToFavoritesIcon.innerHTML = "<h1> + Add to Favorites</h1>";
    addToFavoritesIcon.onclick = () => add(modalImage);
    addToFavorites.appendChild(addToFavoritesIcon);

    // this function recieve 2 arguments (message and background color) and un-display the message after 2.5secs
    const message = (msg, bcolor) => {
      const msgBox = document.createElement("div");
      msgBox.id = "lbMessageBox";
      msgBox.textContent = msg;
      msgBox.style.color = "#fff";
      msgBox.style.backgroundColor = bcolor;
      addToFavorites.prepend(msgBox);

      setTimeout(() => {
        msgBox.textContent = " ";
        msgBox.style = " ";
      }, 2500);
    };

    //This function adds image to favorite-image also performs existing and limit validation
    function add(img) {
      //the loops will loop through the array and check if the image is already added before
      for (let i = 0; i < favImgs.length; i++) {
        if (favImgs[i].src == img.src) {
          return message("This image has been added already", "red");
          //return keyword will exit the function
        }
      }
      if (favImgs.length >= 5)
        return message("Maximum images added. Remove one first", "red");
      //return keyword will exit the function

      //if images make it through the 2 validations, it will add it to the list of favorite images, display a success message and store them in the broser's storage.
      favImgs.push(img);
      message("Image added to favorites", "green");
      localStorage.setItem("favImages", JSON.stringify(favImgs));
    }

    modalWindow.appendChild(addToFavorites);
    document.body.appendChild(modalWindow);
  }
}
