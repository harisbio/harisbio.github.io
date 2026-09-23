# harisbio.github.io

Research portfolio of **Muhammad Haris**, Computational Biologist and Biotechnologist (MS Bioinformatics, Government College University Faisalabad).

Live site: https://harisbio.github.io

## What is on the site

- Four research projects, each presented through its own figures and numbers: transcriptomics and network medicine in hypertrophic cardiomyopathy, exome variant discovery in acute myeloid leukemia, a 25-year meta-analysis of gene-family studies, and nanoparticle treatment of textile wastewater.
- Publications, software and databases, education, research experience, skills, honors, talks, and conference posters.

## Structure

```
index.html      main page
style.css       styles
script.js       figure carousels, lightbox, counters, filters, navigation
thanks.html     page shown after the contact form is submitted
404.html        page shown for broken links
og-image.jpg    preview card used when the link is shared
fig/            research figures and posters (WebP, up to 2200 px)
fig/t/          thumbnails used by carousels, cards, and backgrounds (480 px)
photos/         Scientific life photos (WebP, 1600 px)
photos/t/       smaller versions shown in the photo carousel (640 px)
```

The site is plain HTML, CSS, and JavaScript with no build step. GitHub Pages serves it directly from the `main` branch.

## Running locally

```bash
python -m http.server 8000
```

Then open http://localhost:8000.

## Contact

mharis.202101862@gcuf.edu.pk · ORCID [0009-0005-5162-052X](https://orcid.org/0009-0005-5162-052X)
