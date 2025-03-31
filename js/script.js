// Product Slider
document.addEventListener('DOMContentLoaded', function () {
  // Select elements
  
  const mainImages = document.querySelectorAll('.main-image');
  const dots = document.querySelectorAll('.gallery-dot');
  const thumbnails = document.querySelectorAll('.thumbnail');
  const prevArrow = document.querySelector('.gallery-arrow.prev');
  const nextArrow = document.querySelector('.gallery-arrow.next');
  const ingredientOverlay = document.getElementById('ingredient-overlay');
  const addToCartLink = document.getElementById('add-to-cart-link');
  const flavorRadios = document.querySelectorAll('input[name="flavor"]');
  const purchaseRadios = document.querySelectorAll('input[name="purchase-type"]');

  let currentIndex = 0;

  function showImage(index) {
      if (!mainImages[index]) return; // Avoid errors if index is out of bounds

      mainImages.forEach(img => img.classList.remove('active'));
      dots.forEach(dot => dot.classList.remove('active'));
      thumbnails.forEach(thumb => thumb.classList.remove('active'));

      mainImages[index].classList.add('active');
      dots[index]?.classList.add('active'); // Optional chaining to avoid errors

      // Show ingredient overlay only for the ingredients image
      if (index === 1) {
          ingredientOverlay?.classList.add('active');
      } else {
          ingredientOverlay?.classList.remove('active');
      }

      currentIndex = index;
  }

  // Add click event to dots
  dots.forEach(dot => {
      dot.addEventListener('click', function () {
          const index = parseInt(this.getAttribute('data-index'));
          showImage(index);
      });
  });

  // Add click event to thumbnails
  thumbnails.forEach(thumbnail => {
      thumbnail.addEventListener('click', function () {
          const index = parseInt(this.getAttribute('data-index'));
          showImage(index);
      });
  });

  // Add click event to arrows (check if elements exist before using)
  prevArrow?.addEventListener('click', function () {
      let newIndex = currentIndex - 1;
      if (newIndex < 0) newIndex = mainImages.length - 1;
      showImage(newIndex);
  });

  nextArrow?.addEventListener('click', function () {
      let newIndex = currentIndex + 1;
      if (newIndex >= mainImages.length) newIndex = 0;
      showImage(newIndex);
  });

  // Add to cart link functionality
  function updateAddToCartLink() {
      const selectedFlavor = document.querySelector('input[name="flavor"]:checked')?.value;
      const selectedPurchase = document.querySelector('input[name="purchase-type"]:checked')?.value;

      if (!selectedFlavor || !selectedPurchase) return;

      const cartLinks = {
          'original-single-kit': '/cart/add?product=original-single-kit&id=1001',
          'original-double-kit': '/cart/add?product=original-double-kit&id=1002',
          'original-try-once': '/cart/add?product=original-try-once&id=1003',
          'matcha-single-kit': '/cart/add?product=matcha-single-kit&id=2001',
          'matcha-double-kit': '/cart/add?product=matcha-double-kit&id=2002',
          'matcha-try-once': '/cart/add?product=matcha-try-once&id=2003',
          'cacao-single-kit': '/cart/add?product=cacao-single-kit&id=3001',
          'cacao-double-kit': '/cart/add?product=cacao-double-kit&id=3002',
          'cacao-try-once': '/cart/add?product=cacao-try-once&id=3003'
      };

      const linkKey = `${selectedFlavor}-${selectedPurchase}`;
      if (addToCartLink) {
          addToCartLink.href = cartLinks[linkKey] || '#';
          addToCartLink.textContent = `Add ${selectedFlavor.charAt(0).toUpperCase() + selectedFlavor.slice(1)} ${selectedPurchase.replace('-', ' ')} to Cart →`;
      }

      // Update main image based on flavor selection
      const flavorIndex = { original: 0, matcha: 1, cacao: 2 };
      showImage(flavorIndex[selectedFlavor]);

      // Update "What's Included" images
      const monthlyPackageImg = document.getElementById('monthly-package-img');
      const oneTimePackageImg = document.getElementById('one-time-package-img');

      if (monthlyPackageImg && oneTimePackageImg) {
          const imgPaths = {
              original: { monthly: "/assets/9 2 .png", oneTime: "/assets/Group 1000003966.png" },
              matcha: { monthly: "/assets/green1_1 1.png", oneTime: "/assets/Group 1000003966.png" },
              cacao: { monthly: "/assets/green2_1 2.png", oneTime: "/assets/Group 1000003966.png" }
          };
          monthlyPackageImg.src = imgPaths[selectedFlavor]?.monthly || '';
          oneTimePackageImg.src = imgPaths[selectedFlavor]?.oneTime || '';
      }
  }

  // Add event listeners to radio buttons
  flavorRadios.forEach(radio => radio.addEventListener('change', updateAddToCartLink));
  purchaseRadios.forEach(radio => radio.addEventListener('change', updateAddToCartLink));

  // Initialize the cart link on page load
  updateAddToCartLink();
});

// number counting 
const counters = document.querySelectorAll(".stat");
let observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            counters.forEach(counter => {
                let target = +counter.getAttribute("data-target");
                let count = 0;
                let increment = target / 100;
                
                const updateCount = () => {
                    if (count < target) {
                        count = Math.ceil(count + increment);
                        counter.innerText = `${count}%`;
                        setTimeout(updateCount, 20);
                    } else {
                        counter.innerText = `${target}%`;
                    }
                };
                
                updateCount();
            });
            observer.disconnect();
        }
    });
}, { threshold: 0.5 });

observer.observe(document.getElementById("stats-section"));

// testimonial

document.addEventListener('DOMContentLoaded', function() {
  const track = document.querySelector('.testimonials-track');
  const cards = document.querySelectorAll('.testimonial-card');
  const prevButton = document.querySelector('.nav-button.prev');
  const nextButton = document.querySelector('.nav-button.next');
  const dots = document.querySelectorAll('.pagination-dot');
  
  let currentIndex = 0;
  let cardWidth = cards[0].offsetWidth + parseInt(getComputedStyle(cards[0]).marginRight);
  let cardsPerView = getCardsPerView();
  let maxIndex = cards.length - cardsPerView;
  
  // Initialize
  updateSliderPosition();
  
  // Handle window resize
  window.addEventListener('resize', function() {
      cardWidth = cards[0].offsetWidth + parseInt(getComputedStyle(cards[0]).marginRight);
      cardsPerView = getCardsPerView();
      maxIndex = cards.length - cardsPerView;
      
      // Reset position if current index is out of bounds after resize
      if (currentIndex > maxIndex) {
          currentIndex = maxIndex;
      }
      
      updateSliderPosition();
  });
  
  // Navigation buttons
  prevButton.addEventListener('click', function() {
      if (currentIndex > 0) {
          currentIndex--;
          updateSliderPosition();
          updateActiveDot();
      }
  });
  
  nextButton.addEventListener('click', function() {
      if (currentIndex < maxIndex) {
          currentIndex++;
          updateSliderPosition();
          updateActiveDot();
      }
  });
  
  // Pagination dots
  dots.forEach(dot => {
      dot.addEventListener('click', function() {
          const dotIndex = parseInt(this.getAttribute('data-index'));
          // Ensure we don't go beyond max index
          currentIndex = Math.min(dotIndex, maxIndex);
          updateSliderPosition();
          updateActiveDot();
      });
  });
  
  // Helper functions
  function getCardsPerView() {
      if (window.innerWidth < 768) {
          return 1;
      } else if (window.innerWidth < 992) {
          return 2;
      } else {
          return 3;
      }
  }
  
  function updateSliderPosition() {
      track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
  }
  
  function updateActiveDot() {
      dots.forEach((dot, index) => {
          if (index === currentIndex) {
              dot.classList.add('active');
          } else {
              dot.classList.remove('active');
          }
      });
  }
  
  // Touch events for mobile swiping
  let touchStartX = 0;
  let touchEndX = 0;
  
  track.addEventListener('touchstart', function(e) {
      touchStartX = e.changedTouches[0].screenX;
  });
  
  track.addEventListener('touchend', function(e) {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
  });
  
  function handleSwipe() {
      const swipeThreshold = 50;
      if (touchEndX < touchStartX - swipeThreshold) {
          // Swipe left - go to next
          if (currentIndex < maxIndex) {
              currentIndex++;
              updateSliderPosition();
              updateActiveDot();
          }
      }
      
      if (touchEndX > touchStartX + swipeThreshold) {
          // Swipe right - go to previous
          if (currentIndex > 0) {
              currentIndex--;
              updateSliderPosition();
              updateActiveDot();
          }
      }
  }
});

// FAQs


document.addEventListener('DOMContentLoaded', function() {
    const accordionButtons = document.querySelectorAll('.accordion-button');
    
    accordionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const content = this.nextElementSibling;
            
            // Toggle active class on button
            this.classList.toggle('active');
            
            // Toggle content visibility
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".lazy-bg").forEach((element) => {
        element.style.backgroundImage = `url(${element.dataset.src})`;
    });
});