const Subscriber = require("../models/subscriber");
exports.getAllSubscribers = (req, res) => {
  Subscriber.find({})
    .then((subscribers) => {
      res.render("subscribers/index", {
        pageTitle: "Liste des abonnés",
        subscribers,
      });
    })
    .catch((error) => {
      console.log(
        `Erreur lors de la récupération des abonnés : ${error.message}`
      );
      res.locals.messages.error = "Impossible de récupérer les abonnés.";
      res.render("subscribers/index", {
        pageTitle: "Liste des abonnés",
        subscribers: [],
      });
    });
};

exports.getSubscriptionPage = (req, res) => {
  res.render("subscribers/new", {
    pageTitle: "S'abonner",
    formData: {}, // Passer un objet vide par défaut pour éviter l'erreur
  });
};

exports.saveSubscriber = (req, res) => {
  const newSubscriber = new Subscriber({
    name: req.body.name,
    email: req.body.email,
    zipCode: req.body.zipCode,
  });

  newSubscriber
    .save()
    .then(() => {
      res.locals.messages.success = "Abonné ajouté avec succès !";
      res.redirect("/subscribers");
    })
    .catch((error) => {
      console.log(`Erreur lors de l'ajout de l'abonné : ${error.message}`);
      if (error.name === "ValidationError") {
        const errors = Object.values(error.errors).map((err) => err.message);
        res.locals.messages.error = errors.join(" ");
      } else {
        res.locals.messages.error = "Impossible d'ajouter l'abonné.";
      }
      res.render("subscribers/new", {
        pageTitle: "S'abonner",
        formData: req.body, // Passer les données saisies pour pré-remplir le formulaire
      });
    });
};

exports.show = (req, res, next) => {
  let subscriberId = req.params.id;
  Subscriber.findById(subscriberId)
    .then((subscriber) => {
      res.render("subscribers/show", {
        pageTitle: "Détails de l'abonné",
        subscriber: subscriber,
      });
    })
    .catch((error) => {
      console.log(
        `Erreur lors de la récupération d'un abonné par ID: ${error.message}`
      );
      next(error);
    });
};

exports.deleteSubscriber = (req, res, next) => {
  let subscriberId = req.params.id;

  Subscriber.findByIdAndDelete(subscriberId) // Remplacez findByIdAndRemove par findByIdAndDelete
    .then(() => {
      res.locals.messages.success = "Abonné supprimé avec succès !";
      res.redirect("/subscribers");
    })
    .catch((error) => {
      console.log(
        `Erreur lors de la suppression de l'abonné : ${error.message}`
      );
      res.locals.messages.error = "Impossible de supprimer l'abonné.";
      next(error);
    });
};

exports.editSubscriber = (req, res, next) => {
  let subscriberId = req.params.id;

  Subscriber.findById(subscriberId)
    .then((subscriber) => {
      if (!subscriber) {
        res.locals.messages.error = "Abonné introuvable.";
        return res.redirect("/subscribers");
      }
      res.render("subscribers/edit", {
        pageTitle: "Modifier l'abonné",
        subscriber: subscriber,
      });
    })
    .catch((error) => {
      console.log(
        `Erreur lors de la récupération de l'abonné : ${error.message}`
      );
      next(error);
    });
};

exports.updateSubscriber = (req, res, next) => {
  let subscriberId = req.params.id;

  Subscriber.findByIdAndUpdate(
    subscriberId,
    {
      name: req.body.name,
      email: req.body.email,
      zipCode: req.body.zipCode,
    },
    { new: true, runValidators: true } // Retourne le document mis à jour et applique les validations
  )
    .then((subscriber) => {
      if (!subscriber) {
        res.locals.messages.error = "Abonné introuvable.";
        return res.redirect("/subscribers");
      }
      res.locals.messages.success = "Abonné modifié avec succès !";
      res.redirect(`/subscribers/${subscriberId}`);
    })
    .catch((error) => {
      console.log(
        `Erreur lors de la mise à jour de l'abonné : ${error.message}`
      );
      res.locals.messages.error = "Impossible de modifier l'abonné.";
      res.redirect(`/subscribers/${subscriberId}/edit`);
    });
};

exports.searchSubscribers = (req, res) => {
  const { name, zipCode } = req.query;

  // Construire un objet de recherche dynamique
  const searchCriteria = {};
  if (name) {
    searchCriteria.name = { $regex: name, $options: "i" }; // Recherche insensible à la casse
  }
  if (zipCode) {
    searchCriteria.zipCode = zipCode;
  }

  Subscriber.find(searchCriteria)
    .then((subscribers) => {
      res.render("subscribers/index", {
        pageTitle: "Liste des abonnés",
        subscribers,
      });
    })
    .catch((error) => {
      console.log(`Erreur lors de la recherche des abonnés : ${error.message}`);
      res.locals.messages.error = "Impossible de rechercher les abonnés.";
      res.render("subscribers/index", {
        pageTitle: "Liste des abonnés",
        subscribers: [],
      });
    });
};
