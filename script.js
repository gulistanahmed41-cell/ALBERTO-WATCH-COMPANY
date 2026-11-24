/* ALBERTO WATCH COMPANY - SRS functionality using JavaScript and jQuery */

const CONTACT_EMAIL = "info@albertowatch.example";

const money = price => "PKR " + Number(price).toLocaleString("en-PK");

const label = category =>
    category.charAt(0).toUpperCase() + category.slice(1) + " Collection";


document.addEventListener("DOMContentLoaded", function () {

    /* =================================
       ELEMENTS
    ================================= */

    const productGrid = document.getElementById("productGrid");
    const productItems = Array.from(document.querySelectorAll("#productGrid .product-item"));
    const noProductsMessage = document.getElementById("noProductsMessage");
    const priceTableBody = document.getElementById("priceTableBody");

    let activeFilter = "all";
    let productSearchTerm = "";
    const productSearchInput = document.getElementById("productSearchInput");

    const products = productItems.map(item => ({
        id: Number(item.dataset.id),
        name: item.dataset.name || "",
        category: item.dataset.category || "",
        price: Number(item.dataset.price || 0),
        movement: item.dataset.movement || "",
        image: item.dataset.image || "",
        description: item.dataset.description || "",
        element: item
    }));


    /* =================================
       PRICE LIST
    ================================= */

    function renderPriceList() {

        if (!priceTableBody) return;

        priceTableBody.innerHTML = products.map(product => `
            <tr>
                <td>${product.name}</td>
                <td class="text-capitalize">${product.category}</td>
                <td>${product.movement}</td>
                <td class="text-end fw-bold">
                    ${money(product.price)}
                </td>
            </tr>
        `).join("");

    }

    renderPriceList();


    /* =================================
       PRODUCT LINE-UP SELECTION
    ================================= */

    function applyFilters() {
        let visibleCount = 0;

        products.forEach(product => {
            const matchesCategory = activeFilter === "all" || product.category === activeFilter;
            const searchText = `${product.name} ${product.category} ${product.movement} ${product.description}`.toLowerCase();
            const matchesSearch = !productSearchTerm || searchText.includes(productSearchTerm);
            const isVisible = matchesCategory && matchesSearch;

            product.element.classList.toggle("d-none", !isVisible);
            if (isVisible) visibleCount++;
        });

        if (noProductsMessage) {
            noProductsMessage.classList.toggle("d-none", visibleCount > 0);
        }
    }

    document.querySelectorAll(".filter-btn").forEach(button => {
        button.addEventListener("click", function () {
            document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
            this.classList.add("active");
            activeFilter = this.dataset.filter || "all";
            applyFilters();
        });
    });

    /* PRODUCT SEARCH BOX */
    if (productSearchInput) {
        productSearchInput.addEventListener("input", function () {
            productSearchTerm = this.value.trim().toLowerCase();
            applyFilters();
        });

        productSearchInput.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                this.value = "";
                productSearchTerm = "";
                applyFilters();
                this.blur();
            }
        });
    }


    /* =================================
       PRODUCT DETAILS MODAL
    ================================= */

    let selectedModalProduct = null;

    if (productGrid) {

        productGrid.addEventListener("click", function (event) {

            const button = event.target.closest(".details-btn");
            if (!button) return;

            const currentProduct = products.find(product =>
                product.id === Number(button.dataset.id)
            );

            if (!currentProduct) return;
            selectedModalProduct = currentProduct;

            const setText = (id, value) => {
                const element = document.getElementById(id);
                if (element) element.textContent = value;
            };

            const modalImage = document.getElementById("modalImage");

            if (modalImage) {
                modalImage.src = currentProduct.image;
                modalImage.alt = currentProduct.name;
            }

            setText("modalTitle", currentProduct.name);
            setText("modalDescription", currentProduct.description);
            setText(
                "modalMovement",
                "Movement / Style: " + currentProduct.movement +
                " · " + label(currentProduct.category)
            );
            setText("modalPrice", money(currentProduct.price));

            const modalElement = document.getElementById("productModal");

            if (modalElement && window.bootstrap) {
                bootstrap.Modal.getOrCreateInstance(modalElement).show();
            }

        });

    }

    // Inquire is available inside the product details popup only.
    const modalInquireBtn = document.getElementById("modalInquireBtn");
    if (modalInquireBtn) {
        modalInquireBtn.addEventListener("click", function () {
            if (!selectedModalProduct) return;

            const subjectField = document.getElementById("subject");
            const messageField = document.getElementById("message");
            if (subjectField) subjectField.value = "Product Information";
            if (messageField) {
                messageField.value = `I would like to inquire about ${selectedModalProduct.name} (${money(selectedModalProduct.price)}). Please share more information.`;
            }

            const modalElement = document.getElementById("productModal");
            if (modalElement && window.bootstrap) {
                bootstrap.Modal.getOrCreateInstance(modalElement).hide();
            }

            const contactSection = document.getElementById("contact");
            if (contactSection) {
                setTimeout(() => contactSection.scrollIntoView({ behavior: "smooth" }), 250);
            }
        });
    }


    /* =================================
       CONTACT FORM
    ================================= */

    const contactForm = document.getElementById("contactForm");

    if (contactForm) {

        contactForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const getValue = id => {
                const element = document.getElementById(id);
                return element ? element.value.trim() : "";
            };

            const name = getValue("fullName");
            const email = getValue("email");
            const subject = getValue("subject");
            const message = getValue("message");

            const status = document.getElementById("formMessage");

            if (!name || !email || !subject || !message) {
                if (status) {
                    status.textContent = "Please complete all fields.";
                }
                return;
            }

            if (
                CONTACT_EMAIL === "info@albertowatch.example" ||
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(CONTACT_EMAIL)
            ) {
                if (status) {
                    status.textContent =
                        "Please configure the real company email in script.js before sending.";
                }
                return;
            }

            const body =
                `Name: ${name}\nCustomer Email: ${email}\n\n${message}`;

            if (status) {
                status.textContent =
                    "Opening your email application. Press Send to deliver your enquiry.";
            }

            window.location.href =
                `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        });

    }


    /* =================================
       VISITOR COUNTER
    ================================= */

    const visitorElement = document.getElementById("visitorCount");

    if (visitorElement) {

        try {

            let visits = Number(
                localStorage.getItem("alberto_visits") || 0
            );

            if (!sessionStorage.getItem("alberto_session_counted")) {

                visits++;

                localStorage.setItem("alberto_visits", String(visits));

                sessionStorage.setItem(
                    "alberto_session_counted",
                    "yes"
                );

            }

            visitorElement.textContent =
                String(visits).padStart(4, "0");

        } catch (error) {

            visitorElement.textContent = "0001";

        }

    }


    /* =================================
       LOCATION
    ================================= */

    let currentLocationLabel = "Location: not shared";
    const locateMe = document.getElementById("locateMe");

    if (locateMe) {

        locateMe.addEventListener("click", function () {

            const message = document.getElementById("locationMessage");

            if (!navigator.geolocation) {
                if (message) {
                    message.textContent =
                        "Location is not supported by this browser.";
                }
                return;
            }

            if (message) message.textContent = "Finding your location...";

            navigator.geolocation.getCurrentPosition(

                position => {

                    const place =
                        `Approx. ${position.coords.latitude.toFixed(3)}, ${position.coords.longitude.toFixed(3)}`;

                    currentLocationLabel = `Location: ${place}`;
                    if (message) {
                        message.textContent =
                            `Your approximate position: ${place}. The ticker has been updated.`;
                    }
                    updateTicker();

                },

                () => {

                    if (message) {
                        message.textContent =
                            "Location permission was not granted.";
                    }

                },

                {
                    enableHighAccuracy: false,
                    timeout: 10000,
                    maximumAge: 60000
                }

            );

        });

    }


    /* =================================
       DATE AND TIME TICKER
    ================================= */

    function updateTicker() {

        const ticker = document.getElementById("tickerText");

        if (!ticker) return;

        const now = new Date();

        const date = now.toLocaleDateString("en-GB", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });

        const time = now.toLocaleTimeString("en-GB");

        ticker.textContent =
            `Today: ${date} | Local time: ${time} | ${currentLocationLabel} | ALBERTO WATCH COMPANY`;

    }

    updateTicker();

    setInterval(updateTicker, 1000);


    /* =================================
       CURRENT YEAR
    ================================= */

    const year = document.getElementById("year");

    if (year) {
        year.textContent = new Date().getFullYear();
    }


    /* =================================
       NAVIGATION ACTIVE STATE
    ================================= */

    document.querySelectorAll(".nav-link").forEach(link => {

        link.addEventListener("click", function () {
            if (window.jQuery) {
                window.jQuery(this).stop(true, true).fadeTo(90, 0.65).fadeTo(180, 1);
            }

            document.querySelectorAll(".nav-link").forEach(item => {
                item.classList.remove("active");
            });

            this.classList.add("active");

            const nav = document.getElementById("mainNav");

            if (
                nav &&
                nav.classList.contains("show") &&
                window.bootstrap
            ) {
                bootstrap.Collapse.getOrCreateInstance(nav).hide();
            }

        });

    });

});
(function () {
  'use strict';

  if (window.__albertoGalleryPopup) return;
  window.__albertoGalleryPopup = true;

  /* Gallery ke order mein (upar se neeche, left se right). Text aur price yahan edit karein. */
  var WATCHES = [
    {
      collection: 'Alberto Collection',
      title: 'Classic Gold',
      desc: 'A refined gold-tone timepiece with a clean dial and timeless proportions.',
      meta: 'Movement / Style: Automatic · Classic Collection',
      price: 'PKR 125,000'
    },
    {
      collection: 'Alberto Collection',
      title: 'Fine Details',
      desc: 'Every marker, hand and finish is shaped for a sharp, luxurious look.',
      meta: 'Movement / Style: Quartz · Signature Collection',
      price: 'PKR 88,000'
    },
    {
      collection: 'Alberto Collection',
      title: 'Master Craftsmanship',
      desc: 'Precision assembly and polished finishing in a watch made to last.',
      meta: 'Movement / Style: Automatic · Heritage Collection',
      price: 'PKR 142,000'
    },
    {
      collection: 'Alberto Collection',
      title: 'Timeless Elegance',
      desc: 'Understated elegance that moves easily from boardroom to evening.',
      meta: 'Movement / Style: Quartz · Dress Collection',
      price: 'PKR 96,000'
    }
  ];

  var popup = document.getElementById('abWatchPopup');
  if (!popup) return;

  var els = {
    img: document.getElementById('abPopImg'),
    collection: document.getElementById('abPopCollection'),
    title: document.getElementById('abPopTitle'),
    desc: document.getElementById('abPopDesc'),
    meta: document.getElementById('abPopMeta'),
    price: document.getElementById('abPopPrice'),
    close: document.getElementById('abPopClose'),
    cta: document.getElementById('abPopCta')
  };

  var lastFocus = null;

  function getItems() {
    return Array.prototype.slice.call(document.querySelectorAll('#gallery .gallery-item'));
  }

  /* Pehle high-res (href), fail ho to thumbnail (img src) */
  function setImage(href, thumb, alt) {
    var tried = 0;
    var sources = [href, thumb].filter(Boolean);
    els.img.alt = alt || '';
    els.img.onerror = function () {
      tried++;
      if (tried < sources.length) {
        els.img.src = sources[tried];
      } else {
        els.img.onerror = null;
        els.img.removeAttribute('src');
      }
    };
    els.img.src = sources[0] || '';
  }

  function openPopup(item) {
    var items = getItems();
    var index = items.indexOf(item);
    var thumbEl = item.querySelector('img');
    var captionEl = item.querySelector('span');
    var data = WATCHES[index] || {};

    var alt = thumbEl ? thumbEl.getAttribute('alt') : '';
    var caption = captionEl ? captionEl.textContent.trim() : '';

    els.collection.textContent = data.collection || 'Alberto Collection';
    els.title.textContent = data.title || caption || alt || 'Alberto Timepiece';
    els.desc.textContent = data.desc || alt || '';
    els.meta.textContent = data.meta || 'Movement / Style: Quartz · Alberto Collection';
    els.price.textContent = data.price || '';
    els.price.style.display = data.price ? '' : 'none';

    setImage(item.getAttribute('href'), thumbEl ? thumbEl.getAttribute('src') : '', alt);

    lastFocus = document.activeElement;
    popup.setAttribute('aria-hidden', 'false');
    document.body.classList.add('ab-pop-lock');
    void popup.offsetWidth;
    popup.classList.add('is-open');
    setTimeout(function () { els.close.focus(); }, 60);
  }

  function closePopup() {
    if (!popup.classList.contains('is-open')) return;
    popup.classList.remove('is-open');
    popup.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('ab-pop-lock');
    if (lastFocus && typeof lastFocus.focus === 'function') {
      try { lastFocus.focus({ preventScroll: true }); } catch (e) {}
    }
  }

  /* Gallery click -> popup (naye tab ki jagah) */
  document.addEventListener('click', function (e) {
    var item = e.target.closest && e.target.closest('#gallery .gallery-item');
    if (!item) return;
    e.preventDefault();
    openPopup(item);
  });

  els.close.addEventListener('click', closePopup);

  /* Overlay par click */
  popup.addEventListener('click', function (e) {
    if (e.target === popup) closePopup();
  });

  /* Escape + focus trap */
  document.addEventListener('keydown', function (e) {
    if (!popup.classList.contains('is-open')) return;
    if (e.key === 'Escape' || e.key === 'Esc') {
      closePopup();
    } else if (e.key === 'Tab') {
      var first = els.close, last = els.cta;
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* INQUIRE click: popup band, phir #contact par scroll */
  els.cta.addEventListener('click', function () {
    closePopup();
  });
})();