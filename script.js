"use strict";

const animalImages = [
	{ src: "assets/animais/animal.jpeg", alt: "Ave em destaque" },
	{ src: "assets/animais/animal1.jpeg", alt: "Reptil em destaque" },
	{ src: "assets/animais/animal2.jpeg", alt: "Ave em loja" },
	{ src: "assets/animais/animal3.jpeg", alt: "Reptil em loja" },
	{ src: "assets/animais/animal4.jpeg", alt: "Ave em cuidado" },
	{ src: "assets/animais/animal5.jpeg", alt: "Reptil em cuidado" },
	{ src: "assets/animais/animal6.jpeg", alt: "Ave colorida" },
	{ src: "assets/animais/animal7.jpeg", alt: "Animal em terrario" },
	{ src: "assets/animais/animal8.jpeg", alt: "Ave exotica" },
	{ src: "assets/animais/animal9.jpeg", alt: "Reptil exotico" }
];

const animalSpotlight = document.getElementById("animalSpotlight");
const animalThumbs = document.querySelectorAll(".thumb-button");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxClose = document.querySelector(".lightbox-close");

if (animalSpotlight) {
	let index = 0;
	let timerId;

	const setActiveThumb = (activeIndex) => {
		animalThumbs.forEach((thumb) => {
			const thumbIndex = Number(thumb.dataset.animalIndex);
			thumb.classList.toggle("is-active", thumbIndex === activeIndex);
		});
	};

	const showImage = (nextIndex) => {
		const item = animalImages[nextIndex];
		animalSpotlight.src = item.src;
		animalSpotlight.alt = item.alt;
		setActiveThumb(nextIndex);
	};

	const transition = () => {
		animalSpotlight.classList.add("is-transitioning");

		setTimeout(() => {
			index = (index + 1) % animalImages.length;
			showImage(index);
			animalSpotlight.classList.remove("is-transitioning");
		}, 300);
	};

	showImage(index);
	const startTimer = () => {
		timerId = setInterval(transition, 4200);
	};

	const resetTimer = () => {
		if (timerId) {
			clearInterval(timerId);
		}
		startTimer();
	};

	animalThumbs.forEach((thumb) => {
		thumb.addEventListener("click", () => {
			index = Number(thumb.dataset.animalIndex) || 0;
			showImage(index);
			resetTimer();
		});
	});

	startTimer();
}

const openLightbox = (image) => {
	if (!lightbox || !lightboxImage) {
		return;
	}
	lightboxImage.src = image.src;
	lightboxImage.alt = image.alt;
	lightbox.classList.add("is-open");
	lightbox.setAttribute("aria-hidden", "false");
};

const closeLightbox = () => {
	if (!lightbox) {
		return;
	}
	lightbox.classList.remove("is-open");
	lightbox.setAttribute("aria-hidden", "true");
};

document.addEventListener("click", (event) => {
	const target = event.target;
	if (!(target instanceof Element)) {
		return;
	}
	const image = target.closest("[data-lightbox]");
	if (image instanceof HTMLImageElement) {
		openLightbox(image);
	}
});

if (lightbox) {
	lightbox.addEventListener("click", (event) => {
		if (event.target === lightbox) {
			closeLightbox();
		}
	});
}

if (lightboxClose) {
	lightboxClose.addEventListener("click", closeLightbox);
}

document.addEventListener("keydown", (event) => {
	if (event.key === "Escape") {
		closeLightbox();
	}
});
