# scraperHW
Scraper with mongoose
# All the News That's Fit to Scrape

### Overview

A web app that lets users view and leave comments on the latest news from screenrant.com a movie news site. The app uses Mongoose and Cheerio to scrape the news from the site.

2. NPM packages used:

   1. express

   2. mongoose

   3. cheerio

   4. axios


3. Project is deployed on heroku.

The app that accomplishes the following:

  1. Whenever a user visits the site, the app scrape stories from the sreen rant website and display them for the user. Each scraped article is saved to mongoose application database. The app should scrape and display the following information for each article:

     * Headline - the title of the article

     * Summary - a short summary of the article

     * URL - the url to the original article


  2. Users canalso be able to leave comments on the articles displayed and revisit them later. The comments are also saved to the database and are associated with their articles. Users can see all saved comments and delete. All stored comments should be visible to every user.

