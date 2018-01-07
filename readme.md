This is my workflow for Gulp/SASS/Bootstrap.

1. Clone the repo: http://github.com/nathancoblentz/gulpthings.git
2. Run **npm init*
3. Set SASS variables in _variables.scss.  
4. Run **gulp** to generate tmp follder and server.
5. Save style.scss or any html files and the browser should auto refresh.
6. Run **gulp build** to generate dist folder, with files optimized for deployment.
7. Run **gulp clean** to remove tmp and dist. 
8. If you are uploading this to a new repo, run **gulp push** to upload any new commits to the repo.