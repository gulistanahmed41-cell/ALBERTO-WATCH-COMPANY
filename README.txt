ALBERTO WATCH COMPANY - WEBSITE PROJECT
=========================================

PROJECT FILES
- index.html : Single-page responsive website structure and content
- style.css  : Responsive styling, layout and visual effects
- script.js  : Product line-ups, product details popup, price list, visitor
               counter, date/time/location ticker and contact form
- images/    : Local project images used by the website

HOW TO RUN
1. Extract the ZIP folder.
2. Open the ALBERTO_WATCH_COMPANY folder in Visual Studio Code.
3. Open index.html with Live Server (recommended).
4. Internet access is required for Bootstrap, jQuery, Font Awesome, Google Fonts
   and remote product photographs.
5. Geolocation requires browser permission and normally HTTPS or localhost.

SRS REQUIREMENTS IMPLEMENTED
- Company logo and responsive navigation menu.
- Product sections for Luxury, Vintage, Smart, Digital, Analog, Sports and Clocks.
- Product line-up selection displays the relevant catalogue items.
- Product details popup and complete catalogue price list.
- Watch and clock technology information.
- Store Locator, Support, Gallery, About Us, Contact Us and Sitemap links.
- Company email, address and phone information in the Contact section.
- Visitor counter displayed in the header.
- Continuous scrolling ticker showing current date, time and location when
  the user grants location permission.
- Navigation hover/active states and fade effects.
- Responsive layout for desktop, tablet and mobile screens.

IMPORTANT ASSUMPTIONS AND LIMITATIONS
- Product names, descriptions, images and PKR prices are demonstration content.
  Replace them with approved company catalogue information before publication.
- The visitor counter uses this browser's localStorage. It is not a shared/global
  visitor count across different users or devices. A server-side data store is
  required for a global count.
- Geolocation is optional and only works after the user grants permission.
  The displayed location is approximate coordinates.
- Company email, phone number and address are placeholders. Replace them with
  verified business contact details.
- The contact form opens the visitor's configured email application. It does not
  send or store enquiries automatically.
- Verify the Store Locator map link before publishing.
- This is a frontend educational project; it does not include a server/database.

TECHNOLOGIES
HTML5, CSS3, Bootstrap 5.3, JavaScript, jQuery 3.7, Font Awesome and JSON-style
JavaScript product data.
