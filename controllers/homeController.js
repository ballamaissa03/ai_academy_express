const courses = [
  {
    title: "Introduction à l'IA",
    description: "Découvrez les fondamentaux de l'intelligence artificielle.",
    price: 199,
    level: "Débutant",
  },
  {
    title: "Machine Learning Fondamental",
    description:
      "Apprenez les principes du machine learning et les algorithmes de base.",
    price: 299,
    level: "Intermédiaire",
  },
  {
    title: "Deep Learning Avancé",
    description:
      "Maîtrisez les réseaux de neurones profonds et leurs applications.",
    price: 399,
    level: "Avancé",
  },
];
exports.index = (req, res) => {
  res.render("index", { pageTitle: "Accueil" });
};
exports.about = (req, res) => {
  res.render("about", { pageTitle: "À propos" });
};
exports.faq = (req, res) => {
  res.render("faq", { pageTitle: "FAQ" });
};
exports.courses = (req, res) => {
  let filteredCourses = courses;

  // Récupérer les filtres depuis la requête
  const { level, price } = req.query;

  // Filtrer par niveau
  if (level) {
    filteredCourses = filteredCourses.filter(
      (course) => course.level === level
    );
  }

  // Filtrer par prix
  if (price) {
    filteredCourses = filteredCourses.filter(
      (course) => course.price <= parseInt(price)
    );
  }

  res.render("courses", {
    pageTitle: "Nos Cours",
    courses: filteredCourses,
  });
};
exports.contact = (req, res) => {
  res.render("contact", {
    pageTitle: "Contact",
    formData: {}, // Passer un objet vide par défaut pour éviter l'erreur
  });
};
exports.processContact = (req, res) => {
  const { name, email, course, message } = req.body;

  // Initialiser un tableau pour les erreurs
  const errors = [];

  // Vérifier si le nom est fourni
  if (!name || name.trim().length === 0) {
    errors.push("Le nom complet est requis.");
  }

  // Vérifier si l'email est valide
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailPattern.test(email)) {
    errors.push("Une adresse email valide est requise.");
  }

  // Vérifier si un cours est sélectionné
  if (!course || course.trim().length === 0) {
    errors.push("Veuillez sélectionner un cours.");
  }

  // Vérifier si le message est fourni
  if (!message || message.trim().length < 10) {
    errors.push("Le message doit contenir au moins 10 caractères.");
  }

  // Si des erreurs existent, les afficher
  if (errors.length > 0) {
    res.locals.messages.error = errors.join(" ");
    return res.render("contact", {
      pageTitle: "Contact",
      formData: req.body, // Pré-remplir le formulaire avec les données saisies
    });
  }

  // Si tout est valide, traiter les données
  console.log("Données du formulaire reçues:", req.body);

  // Définir un message de succès
  res.locals.messages.success = "Votre message a été envoyé avec succès !";

  res.render("thanks", {
    pageTitle: "Merci",
    formData: req.body,
  });
};
