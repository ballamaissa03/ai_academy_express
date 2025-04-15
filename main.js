const express = require("express");
const layouts = require("express-ejs-layouts");
const homeController = require("./controllers/homeController");
const errorController = require("./controllers/errorController");
const subscribersController = require("./controllers/subscribersController");
const mongoose = require("mongoose"); // Ajout de Mongoose

// Configuration de la connexion à MongoDB
mongoose.connect("mongodb://localhost:27017/ai_academy");
const db = mongoose.connection;
db.once("open", () => {
  console.log("Connexion réussie à MongoDB en utilisant Mongoose!");
});
const app = express();
// Définir le port
app.set("port", process.env.PORT || 3000);
// Configuration d'EJS comme moteur de template
app.set("view engine", "ejs");
app.use(layouts);
// Middleware pour traiter les données des formulaires
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(express.json());
// Servir les fichiers statiques
app.use(express.static("public"));
// Middleware pour les messages
app.use((req, res, next) => {
  res.locals.messages = {
    success: null,
    error: null,
    info: null,
  };
  next();
});
// Définir les routes
app.get("/", homeController.index);
app.get("/about", homeController.about);
app.get("/courses", homeController.courses);
app.get("/faq", homeController.faq);
app.get("/contact", homeController.contact);
app.post("/contact", homeController.processContact);
app.get("/subscribers", subscribersController.getAllSubscribers);
app.get("/subscribers/new", subscribersController.getSubscriptionPage);
app.post("/subscribers/create", subscribersController.saveSubscriber);
app.get("/subscribers/search", subscribersController.searchSubscribers);
app.get("/subscribers/:id", subscribersController.show);
app.post("/subscribers/:id/delete", subscribersController.deleteSubscriber);
app.get("/subscribers/:id/edit", subscribersController.editSubscriber);
app.post("/subscribers/:id/update", subscribersController.updateSubscriber);

// Gestion des erreurs
app.use(errorController.pageNotFoundError);
app.use(errorController.internalServerError);
// Démarrer le serveur
app.listen(app.get("port"), () => {
  console.log(`Le serveur a démarré et écoute sur le port: ${app.get("port")}`);
  console.log(
    `Serveur accessible à l'adresse: http://localhost:${app.get("port")}`
  );
});
