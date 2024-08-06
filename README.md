Project Name: Gym Session Planner

Overview: The purpose of this site is to provide users with a platform to effectively organize the different workouts that they do on a regular basis and store the list of exercises for each workout. Then, the next time a user pursues a particular workout, they can have the exercises for that workout appear as an interactive checklist. 

Project Structure:

Backend: The backend directory was built using Django. This directory stores the different models and tables used in the project's PostgreSQL database including a Workout Section model, an Exercise model, and a User model which handles user registration and login through JSON Web Token authentication. In the api folder, these models are defined through the models.py file. Also in this folder is the serializers.py file which is used to convert the instances of these models into JSON format, and the views.py file is used to define class-based views that can access or modify the data in the PostgreSQL database. Lastly, inside the backend folder is the urls.py file which handles the routing to different class-based views that are defined in the views.py file based on the incoming request from the frontend.  

Frontend: The frontend directory was built using React. Inside the src folder, there is a pages folder that contains all of the relevant jsx files that serve as the pages for different parts of the site including the Home page, the Register page, the Login page, the Manage Workouts page, and the Workout page. The components folder includes relevant components to different aspects of our site like a navigation bar, a loading screen, and a protected route that ensures certain pages can only be accessed after valid user authentication by signing in through the login page.

Hosting: The site was hosted using Railway's hosting services and Firebase.

SITE URL: https://gym-session-planner.web.app/
