# One Hope Church — Custom Homepage

Free custom website: plain HTML, CSS, JavaScript. No paid template or site builder.

## Preview locally
Open `index.html` in a browser. The Google fonts and temporary Unsplash stock photos require an Internet connection.

## Before publishing
- Replace temporary Unsplash background images in `styles.css` with your church's own licensed photos.
- Replace `hello@example.com` in `index.html` with the correct church contact email.
- YouTube livestream is linked to https://www.youtube.com/@iglesiaunaesperanza4112/live, and archived videos to /videos. These are live YouTube pages, not an embedded player. A verified channel ID or stream video ID is needed if you later want a true in-page player.
- The livestream feature currently uses a temporary Unsplash background photo; replace it with your church worship photo.
- Add confirmed service times, church address, social media and giving links.
- Replace the temporary CSS icon/wordmark with One Hope's official logo if desired.
- Review and approve any church descriptions/wording.

## Publish for $0 using Cloudflare Pages
1. Create a free GitHub repository and upload index.html, styles.css, script.js.
2. Make a free Cloudflare account and go to Workers & Pages > Create > Pages > Connect to Git.
3. Select your GitHub repository. Choose no build command, and output directory `/` (or leave blank if supported).
4. Deploy and open the free `.pages.dev` address.

Hosting availability is subject to provider free-tier terms. Custom domains usually have a separate annual cost.


MOBILE HERO VIDEO (optional upgrade)
The homepage uses the same widescreen video on desktop and mobile. Mobile displays
it inside a 4:5 portrait-shaped area with `object-fit: cover`, so the widescreen
video crops on narrow screens. For the best result, export a separate 4:5 (1080x1350)
H.264 MP4, ideally 10–15 MB and 15–20 seconds. When you have it, add a responsive
video source for small screens and retain the original desktop video as fallback.
The video is not stretched or recompressed by this website.


Responsive hero videos: videos/one-hope-hero.mp4 (desktop, landscape) and videos/one-hope-hero-mobile.mp4 (mobile, 4:5). The browser selects the mobile source at widths up to 720px. Original videos are included without re-encoding; both are HEVC/H.265 and may not play in every browser.


### October photo & service video adjustments
- One Hope Kids uses `images/one-hope-kids.jpg` (children playing).
- One Hope Juniors uses the former Kids photo, now at `images/one-hope-juniors.jpg`.
- The Sunday service video is framed at up to 440px wide, with spacing below the homepage video, and stays portrait-sized on mobile.

### Ministry cards: colored frames (October update)
In `styles.css`, search for `Ministry cards — photo panels` near the bottom.
- Kids frame: `#99D69B` (green)
- Juniors frame: `#004AAD` (blue)
- Youth frame: `#4B7D94` (muted teal)
All three cards use the same **5:7 aspect ratio** on desktop and mobile. To
change the youth photo, replace `images/one-hope-youth.jpg`; the picture's
framing can be adjusted with `.ministries .ministry-card.youth::before`.
The card age labels in English are in `index.html`; the Spanish ones are in
`script.js`. Both are intentionally shown without 01/02/03 numbers.


## Giving section (October 2026)

The old demonstration “Plan Your Visit” panel is replaced with a compact “Ways to Give / Formas de Dar” strip based on the church's green branding reference. The **Give / Donar** menu option scrolls to it. Square card donations open `https://square.link/u/rKx0Qf1u` in a new tab. Zelle displays the number supplied in the church's giving image, `(713) 505-9727`. Cash/check is listed as an in-person option.

Older "Plan Your Visit" links now go to the existing Google Maps section rather than an expired demo email. The QR in the screenshot was not embedded, since its readability as a scannable code could not be verified; supply the original QR asset to add it later.


## Ways to Give photo and layout (October 2026)
The green Ways to Give section now includes `images/ways-to-give.jpg` on the left, with a taller responsive layout and larger labels for in-person, Zelle, and Square giving. You can replace that image with another photo using the same filename. The Square button retains the official payment URL given by the church.
