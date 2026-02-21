#!/bin/bash
# Run this once to download background images into images/
# Then: git add images/ && git commit -m "Add background images" && git push

mkdir -p images
cd "$(dirname "$0")"

curl -sL -o images/hero-bg.jpg "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&q=80"
curl -sL -o images/about.jpg "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80"
curl -sL -o images/sector-hospitality.jpg "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80"
curl -sL -o images/sector-retail.jpg "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&q=80"
curl -sL -o images/sector-residential.jpg "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"
curl -sL -o images/sector-mixeduse.jpg "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&q=80"

echo "Done. Images saved in images/"
