# Backend for Custom Chess

Play Custom Chess [here](https://custom-chess-jw.vercel.app/)  
Frontend Source Code: https://github.com/jwernethUMD/Custom-Chess-Updated

# Instructions for Running Locally
Note that you will not be able to do much by just running the backend, so also run the frontend using the instructions found in the frontend source code.
1. Pull the repository onto your machine.
2. Type "npm i" into the command bar to install dependencies.
3. Create a MongoDB database to connect to using [Atlas](https://www.mongodb.com/atlas/database).
4. Create a .env file containing DB_USERNAME (your database username), DB_PASSWORD (database password), and FRONTEND_URL (the url for your local frontend for CORS purposes)
5. Type "npm start" into the command bar. The backend should now be running locally on your machine!

# Project Notes
- The site is currently susceptible to cheating, as this project was originally only on the frontend. Thus, most of the logic for it was on the frontend and still is. In the future, I am looking to move this logic, especially the move validation, to the backend.
- There may be bugs within the program at the moment. Feel free to create an Issue if your notice any!
