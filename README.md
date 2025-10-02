# ![AirStay Banner](https://via.placeholder.com/800x200.png?text=AirStay+🏡)  
**AirStay** – Full-Stack Airbnb Clone  

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)  
[![GitHub issues](https://img.shields.io/github/issues/Deepakkumar5570/AirStay)](https://github.com/Deepakkumar5570/AirStay/issues)  
[![GitHub stars](https://img.shields.io/github/stars/Deepakkumar5570/AirStay?style=social)](https://github.com/Deepakkumar5570/AirStay/stargazers)  
[![GitHub forks](https://img.shields.io/github/forks/Deepakkumar5570/AirStay?style=social)](https://github.com/Deepakkumar5570/AirStay/network)  

---

## 🌐 Live Demo

Check out the deployed app here: [AirStay on Render](https://airstay-web.onrender.com/)

---

## 💻 Features

- User registration and login with **hashed passwords**
- View properties with images, descriptions, and pricing
- Book properties for selected dates
- User dashboard to manage bookings
- Form validations on frontend & backend
- Admin features: Add/Edit/Delete listings, manage users
- Fully responsive for mobile, tablet, and desktop
- Friendly error handling and validation messages

---

## 🛠️ Technology Stack

| Layer       | Technology                       |
|------------|----------------------------------|
| Frontend   | HTML, CSS, JavaScript             |
| Backend    | Node.js, Express.js               |
| Database   | MongoDB, Mongoose                 |
| Authentication | Express-session, bcrypt        |
| Deployment | Render                            |
| Others     | dotenv, body-parser, method-override |

---

## 📁 Folder Structure


---

## 🔗 API Endpoints

### Authentication:
- `GET /signup` → Render signup page
- `POST /signup` → Register new user with hashed password & validation
- `GET /login` → Render login page
- `POST /login` → Authenticate user & create session
- `GET /logout` → Destroy user session

### Listings:
- `GET /listings` → Fetch all property listings
- `GET /listings/:id` → View single property
- `POST /listings` → (Admin) Add new listing
- `PUT /listings/:id` → (Admin) Edit listing
- `DELETE /listings/:id` → (Admin) Delete listing

### Bookings:
- `POST /bookings` → Book a property (logged-in users)
- `GET /dashboard` → View user bookings

---

## 🔒 Authentication & Validation

- **Password Hashing:** Securely hashed using **bcrypt**
- **Session Management:** Express-session persists login across pages
- **Input Validation:** Frontend (JS) and backend (Express middleware)
- **Protected Routes:** Only authenticated users can book or access dashboard
- **Error Handling:** User-friendly error messages

---

## 📌 Screenshots

*(Replace with your actual screenshots)*  

![Home Page](path_to_screenshot)  
![Listings Page](path_to_screenshot)  
![Booking Page](path_to_screenshot)  
![Dashboard](path_to_screenshot)  

---

## 🚀 Deployment

AirStay is deployed on **Render**:  
1. Connect GitHub repository to Render  
2. Add environment variables in Render dashboard  
3. Deploy the app and access live URL  

---

## 🤝 Contributing

1. Fork the repository  
2. Create a branch: `git checkout -b feature/FeatureName`  
3. Make changes and commit: `git commit -m "Add some feature"`  
4. Push to branch: `git push origin feature/FeatureName`  
5. Open a Pull Request  

---

## 💡 Future Enhancements

- Integrate **payment gateways** (Stripe/PayPal)  
- Add **reviews & ratings** for listings  
- Implement **search & filter** by location, price, amenities  
- Admin dashboard with analytics & management  
- Enhance **security** with JWT tokens or OAuth login  

---




---

## 📄 License

This project is licensed under the **MIT License**.
##
Copyright©️ Deepakkumar5570 Inc. All rights reserved.

