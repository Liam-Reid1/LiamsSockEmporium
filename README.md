#  Liam’s Sock Emporium

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-brightgreen?logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-black?logo=express)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-Database-blue?logo=mysql)](https://www.mysql.com/)
[![Render](https://img.shields.io/badge/Hosted%20on-Render-46E3B7?logo=render)](https://render.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> I record what socks I wear every day and put it on a website. Everyone should have hobbies.

---

## Live Website
 [**liamssockemporium.com**](https://liamssockemporium.com)

---

##  Features

-  Track and log every sock in the collection  (I usually update once a week)
-  Randomly feature a “Featured Sock”  
-  View wear history and stats  
-  Persistent storage with MySQL (hosted on Aiven)  
-  Clean and modern Express.js backend  
-  Secure connection with SSL and environment variables  
-  Deployed via Render with a custom domain from Name.com  

---

##  Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | HTML, CSS, JavaScript |
| **Backend** | Node.js, Express.js |
| **Database** | MySQL (Aiven) |
| **Hosting** | Render |
| **Domain** | Name.com |

---

##  Local Setup

### 1️ Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/liams-sock-emporium.git
cd liams-sock-emporium
```

### 2 Install Dependencies
```bash
npm install
```

### 3 Environmental Variables
Create a `.env` file in the root directory with the following contents:
```ini
SQL_HOST=localhost
SQL_USER=root
SQL_PW=yourpassword
SQL_DB=sockschema
SQL_PORT=3000
```

### 4 Database Setup
To set up the database locally, import the sample SQL file from:
[sock-emporium-sample-db](https://github.com/Liam-Reid1/LiamsSockEmporiumDatabase)

To get the database running locally, clone the companion repository and import the SQL file into mySQL.
This will create the required tables and populate them with sample data.
Additionally, add the excel sheet into the backend to easily 

---

### Running the app locally
```bash
node server.js
```
Then open http://localhost:3000 in your browser.

### Updating the database
```bash
node updateDatabase.js
```
Requires the excel sheet.


Hope it works on your end :)
