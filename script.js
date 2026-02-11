"use strict";

// =============================================
// AVES REINALDO - Modern Interactive Script
// =============================================

// Animal spotlight data
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

// DOM Elements
const nav = document.getElementById("mainNav");
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
const animalSpotlight = document.getElementById("animalSpotlight");
const animalThumbs = document.querySelectorAll(".thumb-card");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxClose = document.querySelector(".lightbox-close");
const lightboxBackdrop = document.querySelector(".lightbox-backdrop");
const lightboxPrev = document.querySelector(".lightbox-nav.prev");
const lightboxNext = document.querySelector(".lightbox-nav.next");

// =============================================
// SCROLL EFFECTS
// =============================================

let lastScroll = 0;

const handleScroll = () => {
	const currentScroll = window.scrollY;
	
	// Navigation background on scroll
	if (nav) {
		nav.classList.toggle("scrolled", currentScroll > 50);
	}
	
	lastScroll = currentScroll;
};

window.addEventListener("scroll", handleScroll, { passive: true });
handleScroll();

// =============================================
// MOBILE NAVIGATION
// =============================================

if (navToggle && navLinks) {
	navToggle.addEventListener("click", () => {
		navLinks.classList.toggle("is-open");
		navToggle.classList.toggle("is-active");
	});
	
	// Close nav on link click
	navLinks.querySelectorAll(".nav-link").forEach((link) => {
		link.addEventListener("click", () => {
			navLinks.classList.remove("is-open");
			navToggle.classList.remove("is-active");
		});
	});
}

// =============================================
// REVEAL ANIMATIONS
// =============================================

const revealElements = document.querySelectorAll(".reveal-fade");

const revealOnScroll = () => {
	const windowHeight = window.innerHeight;
	const revealPoint = 120;
	
	revealElements.forEach((el) => {
		const elementTop = el.getBoundingClientRect().top;
		
		if (elementTop < windowHeight - revealPoint) {
			el.classList.add("is-visible");
		}
	});
};

window.addEventListener("scroll", revealOnScroll, { passive: true });
window.addEventListener("load", revealOnScroll);
revealOnScroll();

// =============================================
// ANIMAL SPOTLIGHT GALLERY
// =============================================

if (animalSpotlight) {
	let currentIndex = 0;
	let autoplayTimer;

	const setActiveThumb = (activeIndex) => {
		animalThumbs.forEach((thumb) => {
			const thumbIndex = Number(thumb.dataset.animalIndex);
			thumb.classList.toggle("is-active", thumbIndex === activeIndex);
		});
	};

	const showImage = (nextIndex, animate = true) => {
		const item = animalImages[nextIndex];
		
		if (animate) {
			animalSpotlight.classList.add("is-transitioning");
			
			setTimeout(() => {
				animalSpotlight.src = item.src;
				animalSpotlight.alt = item.alt;
				setActiveThumb(nextIndex);
				animalSpotlight.classList.remove("is-transitioning");
			}, 300);
		} else {
			animalSpotlight.src = item.src;
			animalSpotlight.alt = item.alt;
			setActiveThumb(nextIndex);
		}
	};

	const nextImage = () => {
		currentIndex = (currentIndex + 1) % animalImages.length;
		showImage(currentIndex);
	};

	const startAutoplay = () => {
		autoplayTimer = setInterval(nextImage, 4500);
	};

	const resetAutoplay = () => {
		clearInterval(autoplayTimer);
		startAutoplay();
	};

	// Initialize
	showImage(currentIndex, false);
	startAutoplay();

	// Thumbnail clicks
	animalThumbs.forEach((thumb) => {
		thumb.addEventListener("click", () => {
			currentIndex = Number(thumb.dataset.animalIndex) || 0;
			showImage(currentIndex);
			resetAutoplay();
		});
	});
}

// =============================================
// LIGHTBOX
// =============================================

let lightboxImages = [];
let currentLightboxIndex = 0;

const collectLightboxImages = () => {
	lightboxImages = Array.from(document.querySelectorAll("[data-lightbox]"));
};

const openLightbox = (image) => {
	if (!lightbox || !lightboxImage) return;
	
	collectLightboxImages();
	currentLightboxIndex = lightboxImages.indexOf(image);
	
	lightboxImage.src = image.src;
	lightboxImage.alt = image.alt;
	lightbox.classList.add("is-open");
	lightbox.setAttribute("aria-hidden", "false");
	document.body.style.overflow = "hidden";
	
	updateLightboxNav();
};

const closeLightbox = () => {
	if (!lightbox) return;
	
	lightbox.classList.remove("is-open");
	lightbox.setAttribute("aria-hidden", "true");
	document.body.style.overflow = "";
};

const navigateLightbox = (direction) => {
	if (lightboxImages.length === 0) return;
	
	currentLightboxIndex += direction;
	
	if (currentLightboxIndex < 0) {
		currentLightboxIndex = lightboxImages.length - 1;
	} else if (currentLightboxIndex >= lightboxImages.length) {
		currentLightboxIndex = 0;
	}
	
	const image = lightboxImages[currentLightboxIndex];
	lightboxImage.src = image.src;
	lightboxImage.alt = image.alt;
	
	updateLightboxNav();
};

const updateLightboxNav = () => {
	// Show/hide nav buttons based on image count
	const hasMultiple = lightboxImages.length > 1;
	if (lightboxPrev) lightboxPrev.style.display = hasMultiple ? "flex" : "none";
	if (lightboxNext) lightboxNext.style.display = hasMultiple ? "flex" : "none";
};

// Lightbox event listeners
document.addEventListener("click", (event) => {
	const target = event.target;
	if (!(target instanceof Element)) return;
	
	const image = target.closest("[data-lightbox]");
	if (image instanceof HTMLImageElement) {
		openLightbox(image);
	}
});

if (lightboxBackdrop) {
	lightboxBackdrop.addEventListener("click", closeLightbox);
}

if (lightboxClose) {
	lightboxClose.addEventListener("click", closeLightbox);
}

if (lightboxPrev) {
	lightboxPrev.addEventListener("click", () => navigateLightbox(-1));
}

if (lightboxNext) {
	lightboxNext.addEventListener("click", () => navigateLightbox(1));
}

document.addEventListener("keydown", (event) => {
	if (!lightbox?.classList.contains("is-open")) return;
	
	switch (event.key) {
		case "Escape":
			closeLightbox();
			break;
		case "ArrowLeft":
			navigateLightbox(-1);
			break;
		case "ArrowRight":
			navigateLightbox(1);
			break;
	}
});

// =============================================
// SMOOTH SCROLL FOR NAV LINKS
// =============================================

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
	anchor.addEventListener("click", function (e) {
		const targetId = this.getAttribute("href");
		if (targetId === "#") return;
		
		const targetElement = document.querySelector(targetId);
		if (targetElement) {
			e.preventDefault();
			const navHeight = nav?.offsetHeight || 0;
			const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navHeight;
			
			window.scrollTo({
				top: targetPosition,
				behavior: "smooth"
			});
		}
	});
});

// =============================================
// PARALLAX EFFECTS (Optional subtle movement)
// =============================================

const heroContent = document.querySelector(".hero-content");

if (heroContent) {
	window.addEventListener("scroll", () => {
		const scrolled = window.scrollY;
		const rate = scrolled * 0.3;
		
		if (scrolled < window.innerHeight) {
			heroContent.style.transform = `translateY(${rate}px)`;
			heroContent.style.opacity = 1 - scrolled / (window.innerHeight * 0.8);
		}
	}, { passive: true });
}

// =============================================
// MOBILE NAVIGATION ACTIVE STATE
// =============================================

const mobileNavItems = document.querySelectorAll(".mobile-nav-item");
const sections = document.querySelectorAll("section[id]");

const updateMobileNavActive = () => {
	const scrollY = window.scrollY;
	const windowHeight = window.innerHeight;
	
	sections.forEach((section) => {
		const sectionTop = section.offsetTop - 150;
		const sectionHeight = section.offsetHeight;
		const sectionId = section.getAttribute("id");
		
		if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
			mobileNavItems.forEach((item) => {
				item.classList.remove("active");
				if (item.getAttribute("href") === `#${sectionId}`) {
					item.classList.add("active");
				}
			});
		}
	});
};

window.addEventListener("scroll", updateMobileNavActive, { passive: true });
updateMobileNavActive();

// =============================================
// TOUCH SWIPE FOR LIGHTBOX
// =============================================

let touchStartX = 0;
let touchEndX = 0;

const handleSwipe = () => {
	const threshold = 50;
	const diff = touchStartX - touchEndX;
	
	if (Math.abs(diff) > threshold) {
		if (diff > 0) {
			navigateLightbox(1); // Swipe left = next
		} else {
			navigateLightbox(-1); // Swipe right = prev
		}
	}
};

if (lightbox) {
	lightbox.addEventListener("touchstart", (e) => {
		touchStartX = e.changedTouches[0].screenX;
	}, { passive: true });
	
	lightbox.addEventListener("touchend", (e) => {
		touchEndX = e.changedTouches[0].screenX;
		handleSwipe();
	}, { passive: true });
}
