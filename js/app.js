// ============================================================
//  Ma ToDo — point de départ
//  Écran unique, sans routage.
// ============================================================

var $$ = Dom7; // utilitaire DOM intégré à Framework7

var CLE = "ma-todo-taches"
var taches = chargerTaches();;

function sauvegarder() {
  localStorage.setItem(CLE, JSON.stringify(taches));
}
function chargerTaches() {
  var data = localStorage.getItem(CLE);
  if (data) {return JSON.parse(data);}

  return [];
}


var app = new Framework7({
  el: "#app",
  name: "MaToDo",
  theme: "auto",
  routes: routes,
});

var mainView = app.views.create(".view-main", { url: "/" });

// ============================================================
//  SÉANCE 2 — déclarer le tableau des tâches, puis :
//    - une fonction afficher() qui construit la liste
//    - une fonction ajouterTache(texte)
//    - une fonction supprimerTache(id)
// ============================================================
/*let taches = [
  { id: 1, texte: "Module F7 - Introduction", fait: true },
  { id: 2, texte: "Faire la Session 1", fait: false },
  { id: 3, texte: "Faire la Session 2", fait: false },
  { id: 4, texte: "Faire la Session 3", fait: false },
];*/

let filtreActif = "toutes";

function ligneTache(t) {
  return `
        <li class="item-content" data-id="${t.id}">
            <div class="item-media">
                <label class="checkbox">
                    <input type="checkbox" ${t.fait ? "checked" : ""} />
                    <i class="icon-checkbox"></i>
                </label>
            </div>
            <div class="item-inner">
                <div class="item-title ${t.fait ? "tache-faite" : ""}">
                    ${t.texte}
                </div>
                <div class="item-after">
                    <a href="#" class="btn-suppr"><i class="icon f7-icons">trash</i></a>
                </div>
            </div>
        </li>
    `;
}

function afficherTaches() {
  $$(".liste-taches").empty();

  let tachesVisible = tachesVisibles();

  tachesVisible.map((tache) => {
    const li = ligneTache(tache);
    $$(".liste-taches").append(li);
  });

  const restantes = taches.filter(function (t) {
    return !t.fait;
  }).length;
  $$(".compteur").text(restantes + " tâche(s) restante(s)");
}

function ajouterTache() {
  const champTache = $$("#saisie-tache");
  const saisieTache = champTache.val();

  if (saisieTache.trim() === "") return;

  const newId =
    taches.reduce(function (m, t) {
      return Math.max(m, t.id);
    }, 0) + 1;

  const newTache = {
    id: newId,
    texte: saisieTache.trim(),
    fait: false,
  };

  taches.push(newTache);

  sauvegarder();

  afficherTaches();

  champTache.val("");
  app.toast.create({ text: "Tâche ajoutée !", closeTimeout: 2000 }).open();
}

function supprimerTache(id) {
  taches = taches.filter(function (t) {
    return t.id !== parseInt(id, 10);
  });

  sauvegarder()
  afficherTaches();
}

function basculerTache(id) {
  var t = taches.find(function (t) {
    return t.id === parseInt(id, 10);
  });
  if (t) {
    t.fait = !t.fait;
    sauvegarder();
    afficherTaches();
  }
}

function tachesVisibles() {
  if (filtreActif === "afaire")
    return taches.filter(function (t) {
      return !t.fait;
    });
  if (filtreActif === "faites")
    return taches.filter(function (t) {
      return t.fait;
    });
  return taches;
}

$$(document).on("click", "#btn-ajouter", function () {
  ajouterTache();
});

// Ajout en appuyant sur Entrée
$$(document).on("keypress", "#saisie-tache", function (e) {
  if (e.keyCode === 13) {
    e.preventDefault();

    ajouterTache();
  }
});

$$(document).on("click", ".btn-suppr", function (e) {
  e.preventDefault();

  const id = $$(this).parents(".item-content").attr("data-id");
  supprimerTache(id);
});

$$(document).on("page:init", '.page[data-name="taches"]', function () {
  afficherTaches(); // premier appel de la fonction
});

$$(document).on("change", '.liste-taches input[type="checkbox"]', function () {
  var id = $$(this).parents(".item-content").attr("data-id");
  basculerTache(id);
});

$$(document).on("click", ".filtre-btn", function () {
  $$(".filtre-btn").removeClass("button-active");
  $$(this).addClass("button-active");
  filtreActif = $$(this).attr("data-filtre");
  afficherTaches();
});
//  SÉANCE 3 — ajouter :
//    - basculerTache(id) pour cocher / décocher
//    - le compteur de tâches restantes
//    - les filtres (Toutes / À faire / Faites)
//    - chargerTaches() et sauvegarder() avec localStorage
// ------------------------------------------------------------

// Exemple de structure de données (à activer en séance 2) :
// var taches = [
//   { id: 1, texte: "Réviser l'algorithmique", fait: false },
// ];
