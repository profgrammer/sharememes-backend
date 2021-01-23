### Meme Sharing app - backend
A Cool meme sharing app backend with:
* `Auth0` for Authentication/Authorization
* `AWS S3` for storing images
* `Redis` for server side caching
* Structured, modular code, written using **dependency injection**, ready for writing unit tests 🤑
* Frontend coming soon *(hopefully)* 😅

#### Dependencies:
* Nodejs
* Mongodb instance
* Redis instance
* AWS S3 credentials
* Auth0 application

#### Steps for local setup:
* Clone the repository, cd into it, install node modules using `npm install`
* Make sure you have the above dependencies resolved on your local machine
* Copy the `.env.sample` file into a `.env` file
```code
cp .env.sample .env
```
* Fill all the fields in the `.env` file with the required information
* Run `npm run dev` to run it locally