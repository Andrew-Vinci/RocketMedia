# Rocket Media

![Static Badge](https://img.shields.io/badge/Firebase-orange?style=flat&logo=firebase&logoColor=orange&labelColor=black)
![Static Badge](https://img.shields.io/badge/JavaScript-black?style=flat&logo=JavaScript&logoColor=yellow)

## Description

This project uses the Firebase API to create a "clone" of a social media website.
I say clone in quotations becuause this project only mimics a few features found in 
a social media site but nonetheless provides an in depth look into how Firebase works
and how it can be used to create powerful applications.

Most of this project is incomplete, as it was never truly intended to be a
robust social media site. Rather, it's intended purpose was to teach a backend technolgoy outside of SQL and to be able to provide flexibiltiy and options when choosing a backend framework.

As such, most of the features are confusing and not ideal. I would recommend checking out the actual Javascript and how the project interacts with the Firebase API. This is truly where most of the development time was spent. That's why it's written without React and with just very basic HTML, CSS, and JavaScript. Most of the time was spent on database design and rendering data to the frontend. This was a project that was geared more towards a backend state of mind.

Nonetheless, this project is important to me for a few reaons. First, it showcases the ability to learn new technologies and create applications that work. Second, it is a good jumping off point for future development. The website itself may not be pretty, but the underlying database is and with a better user interface, it could be useful to future applications that I create.

The eventual goal is for this to be ported using the React library and to fully flesh out the UI and enhance the user experience. For now, it serves as a good reference point for what is possible with Firebase and NoSQL databases.


## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Acknowledgments](#acknowledgments)

## Installation

> `git clone https://github.com/Andrew-Vinci/RocketMedia.git`

## Usage

RocketMedia allows a user to keep in touch with friends through an online messaging system via Firebase. Firebase uses a NoSQL database. The way in which the data is stored is via collections and documents. You can make collections of documents, as well as collections of collections, or collections nested alongside documents that sit inside a collection. It's extremely powerful and allows you to forgoe dealing with SQL queries and just deal with the Firebase API to extract data.

## Features
- Sign-in/Sign-up User Authentication via Firebase
- User Timeline Posts, only visible to user
- Messaging friends through the Firebase API
- User Friends List/Friend Recommendations, albeit primitive

### User Sign-in/Sign-up Screenshot
![alt text](<Screenshot 2024-07-15 at 4.12.31 PM.png>)


### User Profile Screenshot
![alt text](<Screenshot 2024-07-15 at 3.50.21 PM.png>)


### User Messaging/Friend Recommendation Sreenshot
![alt text](<Screenshot 2024-07-15 at 3.51.18 PM.png>)


## Acknowledgments

- Firebase
- JavaScript