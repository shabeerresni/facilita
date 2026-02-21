# Using the original Unsplash images

Unsplash images often don't load when embedded from GitHub Pages (referrer/CORS). The live site currently uses Picsum Photos so backgrounds always show.

To use the **original Unsplash images** (Dubai skyline, hotel, mall, etc.) instead:

1. **On your Mac**, open Terminal and run:
   ```bash
   cd /Users/shabeermohamed/Documents/personal/Facilita/facilita
   ./download-images.sh
   ```

2. **Update the site** to use local images: in `index.html`, replace the Picsum URLs with:
   - Hero: `url('images/hero-bg.jpg')`
   - About img: `src="images/about.jpg"`
   - Sectors: `url('images/sector-hospitality.jpg')`, `sector-retail.jpg`, `sector-residential.jpg`, `sector-mixeduse.jpg`

3. **Commit and push** the images and updated HTML:
   ```bash
   git add images/ index.html
   git commit -m "Use local Unsplash images"
   git push
   ```

After that, the live site will show the original photos and they will load reliably from your repo.
