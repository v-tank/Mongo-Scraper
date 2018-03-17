# Mongo-Scraper

## Table of Contents 

1. [Overview](#overview)
2. [Installation](#installation)
3. [Initializing](#initializing)
	- [Local Server](#local-server)
	- [Heroku](#heroku)
4. [How It Works](#how-it-works)

<a name="overview"></a>
## Overview

Mongo Scraper is a web app to scrape and display the latest tech news from Tech Crunch. The user has the ability to save articles of interest and add notes to each of them to reference later. It uses an MVC architecture and MongoDB as well as other technologies such as Node, Express, Mongoose and Handlebars. 

<a name="installation"></a>
## Installation

### Step 1: Git Clone

Clone the repo to your local machine:

```
git clone git@github.com:v-tank/Mongo-Scraper.git
```

The required files should now be on your local machine.

### Step 2: Install Dependencies

Dependencies used for this app include the following:

* axios
* body-parser
* cheerio
* express
* express-handlebars
* mongojs
* mongoose
* morgan

Install all the required packages using the following command:

```
npm install or npm i
```

The dependencies should now be in the local `node_modules` folder.

<a name="initializing"></a>
## Initializing

There are two ways to run this application. The user can either run the application on their local server or access the application deployed to Heroku.

<a name="local-server"></a>
### Local Server

1. Ensure the two steps in [Installation](#installation) are completed.

2. Run the Node application called server.js to initialize the user's local server using the following command:

	```
	node server.js
	```

3. Open the browser and connect to [PORT 3000 of the local host](http://localhost:3000/) to reach the homepage.

<a name="heroku"></a>
### Heroku

1. Open the browser and go to the deployed [Heroku](https://tek-krunch.herokuapp.com/) application to reach the homepage.


<a name="how-it-works"></a>
## How It Works

1. The homepage will display the latest articles that were scraped from Tech Crunch. The user can hit the 'Scrape' button in order to pull new articles (if any).

2. If the user chooses to `Save` an article, the application will add the article to the 'Saved' list. 
  * In the 'Saved' list, the user can add notes to the articles to reference later.
  * The user can also 'Unsave' an article if he or she wishes to get remove it from the list.


