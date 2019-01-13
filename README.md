# Ironhabit - Project 2 at Ironhack bootcamp

## Introduction 

A website for tracking habits with feedback in the form of statistics and diagrams. 

To play with the site head to: https://ironhabit.herokuapp.com

## Setup

If you’d like to view my project in your browser:
```
$ git clone https://github.com/aioimo/ironhackproject2.git
$ cd 2-backend-project
$ npm i
$ touch .env

```

Now you have to add the following in the .env file:

```
PORT=3005
ENV=development
MONGODB_URI=mongodb://localhost/goals-project
```
At this point everything except the image upload works. It is not necessary for playing with the app but if you want to upload a profile picture you can create a cloudinary account and add your credentials like this in the .env file: 

```
CLOUDINARY_NAME=your-name
CLOUDINARY_SECRET=your-secret
CLOUDINARY_KEY=your-key

```

Now run:

``` $ npm run dev ```

## Team Members

This was a group exercise completed by [Axel Dahlin](https://github.com/axeldahlin) and [Anthony Ioimo](https://github.com/aioimo).

