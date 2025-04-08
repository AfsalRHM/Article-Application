  # 📰 Article Feeds Web Application
  
  An interactive and responsive article platform where users can view, create, and manage articles based on their category preferences like sports, politics, and space.
  
  ---
  
  ## 🔗 Live Demo
  
  👉 [Hosted Link Here](https://article-application-eight.vercel.app) *(Replace this with your deployed app)*
  
  ---
  
  ## 🚀 Features
  
  - ✅ User Signup with category preferences
  - 🔐 Secure Login via Email or Phone
  - 🏠 Personalized Dashboard with article feeds based on preferences
  - ❤️ Like, 👎 Dislike, and 🚫 Block article interactions
  - ✍️ Article creation, editing, and deletion
  - ⚙️ Profile settings and preference management
  
  ---
  
  ## 🧾 Pages Overview
  
  | Page               | Description                                                                 |
  |--------------------|-----------------------------------------------------------------------------|
  | Registration Page  | Signup with personal info and article preferences                           |
  | Login Page         | Login via email or phone and password                                       |
  | Dashboard Page     | View articles from others based on preferences                              |
  | Article View       | Click to view full article (popup or separate page)                         |
  | Settings Page      | Edit profile info, change password, update category preferences             |
  | Article Creation   | Form to add new articles with title, description, image, category, and tags |
  | Article List Page  | List of user's own articles with options to edit or delete                  |
  | Article Edit Page  | Update previously created articles                                          |
  
  ---
  
  ## 🧱 Tech Stack
  
  | Frontend             | Backend                | Database     | Styling        |
  |----------------------|------------------------|--------------|----------------|
  | React.js             | Node.js + Express.js   | MongoDB      | Tailwind CSS   |
  | React Router         | RESTful API            | Mongoose     | Framer Motion  |
  | React Hook Form      |                        |              |                |
  
  ---
  
  ## 🗃️ Folder Structure
  
  ├── backend
      ├── .gitignore
      ├── index.ts
      ├── package-lock.json
      ├── package.json
      ├── src
      │   ├── config
      │   │   └── db.ts
      │   ├── controllers
      │   │   └── userController.ts
      │   ├── models
      │   │   └── userModel.ts
      │   ├── routes
      │   │   └── userRoutes.ts
      │   └── validators
      │   │   └── userValidators.ts
      └── tsconfig.json
  └── frontend
      ├── .gitignore
      ├── README.md
      ├── eslint.config.js
      ├── index.html
      ├── package-lock.json
      ├── package.json
      ├── public
          ├── article_logo.png
          └── vite.svg
      ├── src
          ├── App.tsx
          ├── api
          │   ├── apiRequest.ts
          │   ├── articleRequest.ts
          ├── assets
          │   └── react.svg
          ├── components
          │   ├── auth-components
          │   │   ├── LoginComponent.tsx
          │   │   └── RegisterComponent.tsx
          │   ├── dashboard-components
          │   ├── settings-components
          │   └── shared
          ├── config
          │   └── cloudinaryConfig.ts
          ├── declarations.d.ts
          ├── interface
          │   ├── IarticleInterface.ts
          ├── main.tsx
          ├── pages
          │   ├── AuthPage.tsx
          │   ├── CreateArticlePage.tsx
          │   ├── DashboardPage.tsx
          │   └── SettingsPage.tsx
          ├── redux
          │   ├── slice
          │   │   └── userSlice.ts
          │   └── store.ts
          ├── styles.css
          ├── utils
          │   ├── iziToastUtils.ts
          │   └── userAuth.tsx
          └── vite-env.d.ts
      ├── tsconfig.app.json
      ├── tsconfig.json
      ├── tsconfig.node.json
      ├── vercel.json
      └── vite.config.ts
  
  
  ---
  
  ## 🛠️ Setup & Installation
  
  ### 📦 Clone the Repo
  
  ```bash
  git clone https://github.com/AfsalRHM/Article-Application.git
  cd Article-Application
  
  ## Frontend Setup
  cd frontend
  npm install

  VITE_API_BASE_URL = 
  VITE_CLOUDINARY_URL =

  npm run dev
  
  ## Backend Setup
  cd backend
  npm install
  npm start
  
  
  Let me know if you want:
  - A **split README** for client and server folders
  - A **deployment guide** for Vercel/Render
  - Or a **setup video/guide** for `.env` and MongoDB
  
  Happy coding! 🚀
