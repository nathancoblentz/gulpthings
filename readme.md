This is my workflow for Gulp/SASS/Bootstrap/Nunjucks.  To get started:

1. Download node.js if you don't already have it.

2. Clone the repo: http://github.com/nathancoblentz/gulpthings.git

3. From your command line (I use Git Bash), run 'npm install'.

4. If you're interested in the Nunjucks template engine, here is a great tutorial: https://zellwk.com/blog/nunjucks-with-gulp/ .  The Nunjucks files are in the 'content' folder.  If you want to skip this, the files straight out of the 'src' will do in a pinch.  The template engine is a great way to make sure your coding is nice and consistent on each page and it will definitely save you some time.
 
5. We will use a 'src' folder for the files we are working with, a 'tmp' folder to send them to a virtual server for development, and a 'dist' folder for the finished product.  Here is an awesome introduction to Gulp and an excellent summary of this kind of setup:
https://hackernoon.com/how-to-automate-all-the-things-with-gulp-b21a3fc96885

6. Set SASS variables in _variables.scss.  Other customizations in 'layout.'  make as many SASS partials as you want.  This is your SASS playground!  I am pulling the latest Bootstrap from the 'assets' folder, but it will work just fine without Bootstrap.
  
7. Run **gulp** to generate your server and browsersync.  The browser **should** auto refresh every time you update a .scss, .nunjuk or .html file.

6. Run **gulp build** to generate dist folder, with files optimized for deployment, and **serve-dist** to serve them in a browser for a final preview.

7. Run **gulp clean** to remove tmp, dist, and any leftover .css or .cssmap files laying arund. 

8. If you are uploading this to a new repo, run **gulp push** to upload any new commits to the repo.

9. Resources: 
    - Bootstrap Documentation: http://getbootstrap.com/
    - How to Modularize HTML Using Template Engines and Gulp (an awesome breakdown of Nunjucks can be found here) https://zellwk.com/blog/nunjucks-with-gulp/
    - How to Automate All the Things With Gulp: https://hackernoon.com/how-to-automate-all-the-things-with-gulp-b21a3fc96885
    - SASS Documentation: http://sass-lang.com/
    - Name that color - color wheel generator with semantic color names, included in 'scss/util/colors.scss': http://chir.ag/projects/name-that-color/#6195ED
    - Google Fonts: http://fonts.google.com

