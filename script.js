// Variables globales pour stocker les données
let exercises = JSON.parse(localStorage.getItem("exercises")) || [];
let players = JSON.parse(localStorage.getItem("players")) || [];
let performances = JSON.parse(localStorage.getItem("performances")) || [];

// Variables pour l'import Excel
let importData = null;
let conflicts = [];

// Initialisation
document.addEventListener("DOMContentLoaded", function () {
  loadData();
  updateInterface();
});

// ===== FONCTIONS DE BASE =====

function saveData() {
  localStorage.setItem("exercises", JSON.stringify(exercises));
  localStorage.setItem("players", JSON.stringify(players));
  localStorage.setItem("performances", JSON.stringify(performances));
}

function loadData() {
  exercises = JSON.parse(localStorage.getItem("exercises")) || [];
  players = JSON.parse(localStorage.getItem("players")) || [];
  performances = JSON.parse(localStorage.getItem("performances")) || [];
}

function updateInterface() {
  updateExercisesList();
  updatePlayersList();
  updateExerciseSelectors();
  updatePlayerSelectors();
}

// ===== GESTION DES ONGLETS =====

function showTab(tabName) {
  // Masquer tous les onglets
  const tabContents = document.querySelectorAll(".tab-content");
  tabContents.forEach((content) => content.classList.remove("active"));

  // Désactiver tous les onglets
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach((tab) => tab.classList.remove("active"));

  // Activer l'onglet sélectionné
  document.getElementById(tabName).classList.add("active");
  event.target.classList.add("active");
}

// ===== GESTION DES EXERCICES =====

function addExercise() {
  const name = document.getElementById("exerciseName").value.trim();
  const unit = document.getElementById("exerciseUnit").value;
  const description = document
    .getElementById("exerciseDescription")
    .value.trim();
  const type = document.querySelector(
    'input[name="exerciseType"]:checked'
  ).value;

  if (!name) {
    alert("Veuillez saisir un nom d'exercice");
    return;
  }

  const exercise = {
    id: Date.now().toString(),
    name: name,
    unit: unit,
    type: type,
    description: description,
    createdAt: new Date().toISOString(),
  };

  exercises.push(exercise);
  saveData();
  updateInterface();

  // Reset form
  document.getElementById("exerciseName").value = "";
  document.getElementById("exerciseDescription").value = "";
  document.querySelector(
    'input[name="exerciseType"][value="time_fast"]'
  ).checked = true;
}

function updateExercisesList() {
  const container = document.getElementById("exercisesList");
  container.innerHTML = "";

  exercises.forEach((exercise) => {
    const card = document.createElement("div");
    card.className = "exercise-card";
    card.innerHTML = `
            <div class="exercise-name">${exercise.name}</div>
            <div class="exercise-unit">${exercise.unit}</div>
            <div class="exercise-details">
                <strong>Type:</strong> ${getExerciseTypeLabel(
                  exercise.type
                )}<br>
                <strong>Description:</strong> ${
                  exercise.description || "Aucune description"
                }
            </div>
            <button class="btn btn-danger" onclick="deleteExercise('${
              exercise.id
            }')">Supprimer</button>
        `;
    container.appendChild(card);
  });
}

function getExerciseTypeLabel(type) {
  const types = {
    time_fast: "Temps le plus rapide",
    time_slow: "Temps le plus long",
    distance_short: "Distance la plus courte",
    distance_long: "Distance la plus lointaine",
  };
  return types[type] || type;
}

function deleteExercise(id) {
  if (confirm("Êtes-vous sûr de vouloir supprimer cet exercice ?")) {
    exercises = exercises.filter((e) => e.id !== id);
    performances = performances.filter((p) => p.exerciseId !== id);
    saveData();
    updateInterface();
  }
}

// ===== GESTION DES JOUEUSES =====

function addPlayer() {
  const name = document.getElementById("playerName").value.trim();

  if (!name) {
    alert("Veuillez saisir un nom de joueuse");
    return;
  }

  const player = {
    id: Date.now().toString(),
    name: name,
    registeredAt: new Date().toISOString(),
  };

  players.push(player);
  saveData();
  updateInterface();

  // Reset form
  document.getElementById("playerName").value = "";
}

function updatePlayersList() {
  const container = document.getElementById("playersList");
  container.innerHTML = "";

  players.forEach((player) => {
    const performanceCount = performances.filter(
      (p) => p.playerId === player.id
    ).length;
    const card = document.createElement("div");
    card.className = "player-card";
    card.innerHTML = `
            <div class="player-name">${player.name}</div>
            <div class="exercise-details">
                <strong>Inscrite le:</strong> ${new Date(
                  player.registeredAt
                ).toLocaleDateString("fr-FR")}<br>
                <strong>Performances:</strong> ${performanceCount}
            </div>
            <button class="btn btn-danger" onclick="deletePlayer('${
              player.id
            }')">Supprimer</button>
        `;
    container.appendChild(card);
  });
}

function deletePlayer(id) {
  if (confirm("Êtes-vous sûr de vouloir supprimer cette joueuse ?")) {
    players = players.filter((p) => p.id !== id);
    performances = performances.filter((p) => p.playerId !== id);
    saveData();
    updateInterface();
  }
}

// ===== GESTION DES PERFORMANCES =====

function updateExerciseSelectors() {
  const selectors = ["perfExercise", "statsExercise"];
  selectors.forEach((selectorId) => {
    const selector = document.getElementById(selectorId);
    if (selector) {
      selector.innerHTML = '<option value="">Sélectionnez un exercice</option>';
      exercises.forEach((exercise) => {
        const option = document.createElement("option");
        option.value = exercise.id;
        option.textContent = exercise.name;
        selector.appendChild(option);
      });
    }
  });
}

function updatePlayerSelectors() {
  const selectors = ["perfPlayer", "statsPlayer"];
  selectors.forEach((selectorId) => {
    const selector = document.getElementById(selectorId);
    if (selector) {
      selector.innerHTML = '<option value="">Sélectionnez une joueuse</option>';
      players.forEach((player) => {
        const option = document.createElement("option");
        option.value = player.id;
        option.textContent = player.name;
        selector.appendChild(option);
      });
    }
  });
}

function updatePerformanceInterface() {
  const exerciseId = document.getElementById("perfExercise").value;
  const playerId = document.getElementById("perfPlayer").value;

  if (exerciseId && playerId) {
    const exercise = exercises.find((e) => e.id === exerciseId);
    const player = players.find((p) => p.id === playerId);

    document.getElementById(
      "performanceTitle"
    ).textContent = `${player.name} - ${exercise.name}`;
    document.getElementById("performanceDescription").textContent =
      exercise.description || "";

    // Générer les champs de tentatives
    const attemptsGrid = document.getElementById("attemptsGrid");
    attemptsGrid.innerHTML = "";
    for (let i = 1; i <= 5; i++) {
      const input = document.createElement("input");
      input.type = "number";
      input.step = "0.01";
      input.className = "attempt-input";
      input.placeholder = `Tentative ${i}`;
      input.id = `attempt${i}`;
      attemptsGrid.appendChild(input);
    }

    document.getElementById("performanceInterface").style.display = "block";
    updateCurrentPlayerStats(playerId, exerciseId);
  } else {
    document.getElementById("performanceInterface").style.display = "none";
    document.getElementById("currentPlayerStats").style.display = "none";
  }
}

function savePerformance() {
  const exerciseId = document.getElementById("perfExercise").value;
  const playerId = document.getElementById("perfPlayer").value;

  if (!exerciseId || !playerId) {
    alert("Veuillez sélectionner un exercice et une joueuse");
    return;
  }

  const attempts = [];
  for (let i = 1; i <= 5; i++) {
    const value = document.getElementById(`attempt${i}`).value;
    if (value) {
      attempts.push(parseFloat(value));
    }
  }

  if (attempts.length === 0) {
    alert("Veuillez saisir au moins une tentative");
    return;
  }

  const exercise = exercises.find((e) => e.id === exerciseId);
  let bestScore;

  // Déterminer le meilleur score selon le type d'exercice
  if (
    exercise.type.includes("time") ||
    exercise.type.includes("distance_short")
  ) {
    bestScore = Math.min(...attempts);
  } else {
    bestScore = Math.max(...attempts);
  }

  const performance = {
    id: Date.now().toString(),
    date: new Date().toISOString(),
    playerId: playerId,
    exerciseId: exerciseId,
    attempts: attempts,
    bestScore: bestScore,
  };

  performances.push(performance);
  saveData();
  updateInterface();

  // Reset form
  for (let i = 1; i <= 5; i++) {
    document.getElementById(`attempt${i}`).value = "";
  }

  alert("Performance enregistrée avec succès !");
}

function updateCurrentPlayerStats(playerId, exerciseId) {
  const playerStats = document.getElementById("currentPlayerStats");
  const player = players.find((p) => p.id === playerId);
  const exercise = exercises.find((e) => e.id === exerciseId);

  const playerPerformances = performances
    .filter((p) => p.playerId === playerId && p.exerciseId === exerciseId)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  if (playerPerformances.length === 0) {
    playerStats.innerHTML =
      "<p>Aucune performance enregistrée pour cette joueuse et cet exercice.</p>";
  } else {
    const bestPerformance = playerPerformances.reduce((best, current) => {
      if (
        exercise.type.includes("time") ||
        exercise.type.includes("distance_short")
      ) {
        return current.bestScore < best.bestScore ? current : best;
      } else {
        return current.bestScore > best.bestScore ? current : best;
      }
    });

    playerStats.innerHTML = `
            <h3>Statistiques de ${player.name} - ${exercise.name}</h3>
            <div class="best-score">
                Meilleur score: ${bestPerformance.bestScore} ${exercise.unit}
            </div>
            <div class="performance-history">
                <h4>Historique des performances :</h4>
                ${playerPerformances
                  .map(
                    (p) => `
                    <div class="performance-entry">
                        <span class="performance-date">${new Date(
                          p.date
                        ).toLocaleDateString("fr-FR")}</span>
                        <span class="performance-score">${p.bestScore} ${
                      exercise.unit
                    }</span>
                    </div>
                `
                  )
                  .join("")}
            </div>
        `;
  }

  playerStats.style.display = "block";
}

// ===== FONCTIONS D'EXPORT/IMPORT EXCEL =====

function exportToExcel() {
  try {
    const workbook = XLSX.utils.book_new();

    // Feuille Exercices
    const exercisesData = exercises.map((ex) => ({
      ID: ex.id,
      Nom: ex.name,
      Unité: ex.unit,
      Type: getExerciseTypeLabel(ex.type),
      Description: ex.description || "",
      "Date création": new Date(ex.createdAt).toLocaleDateString("fr-FR"),
    }));
    const exercisesSheet = XLSX.utils.json_to_sheet(exercisesData);
    XLSX.utils.book_append_sheet(workbook, exercisesSheet, "Exercices");

    // Feuille Joueuses
    const playersData = players.map((player) => {
      const performanceCount = performances.filter(
        (p) => p.playerId === player.id
      ).length;
      return {
        ID: player.id,
        Nom: player.name,
        "Date inscription": new Date(player.registeredAt).toLocaleDateString(
          "fr-FR"
        ),
        "Nombre de performances": performanceCount,
      };
    });
    const playersSheet = XLSX.utils.json_to_sheet(playersData);
    XLSX.utils.book_append_sheet(workbook, playersSheet, "Joueuses");

    // Feuille Performances
    const performancesData = performances.map((perf) => {
      const player = players.find((p) => p.id === perf.playerId);
      const exercise = exercises.find((e) => e.id === perf.exerciseId);
      return {
        Date: new Date(perf.date).toLocaleDateString("fr-FR"),
        Heure: new Date(perf.date).toLocaleTimeString("fr-FR"),
        Joueuse: player ? player.name : "Inconnue",
        Exercice: exercise ? exercise.name : "Inconnu",
        "Tentative 1": perf.attempts[0] || "",
        "Tentative 2": perf.attempts[1] || "",
        "Tentative 3": perf.attempts[2] || "",
        "Tentative 4": perf.attempts[3] || "",
        "Tentative 5": perf.attempts[4] || "",
        "Meilleur score": perf.bestScore,
      };
    });
    const performancesSheet = XLSX.utils.json_to_sheet(performancesData);
    XLSX.utils.book_append_sheet(workbook, performancesSheet, "Performances");

    // Feuille Résumé
    const summaryData = [];
    players.forEach((player) => {
      exercises.forEach((exercise) => {
        const playerPerformances = performances.filter(
          (p) => p.playerId === player.id && p.exerciseId === exercise.id
        );

        if (playerPerformances.length > 0) {
          const bestPerformance = playerPerformances.reduce((best, current) => {
            if (
              exercise.type.includes("time") ||
              exercise.type.includes("distance_short")
            ) {
              return current.bestScore < best.bestScore ? current : best;
            } else {
              return current.bestScore > best.bestScore ? current : best;
            }
          });

          summaryData.push({
            Joueuse: player.name,
            Exercice: exercise.name,
            "Record personnel": bestPerformance.bestScore,
            Unité: exercise.unit,
            "Date du record": new Date(bestPerformance.date).toLocaleDateString(
              "fr-FR"
            ),
            "Nombre de performances": playerPerformances.length,
          });
        }
      });
    });
    const summarySheet = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, "Résumé");

    // Générer le nom du fichier avec la date
    const today = new Date().toISOString().split("T")[0];
    const fileName = `performances-${today}.xlsx`;

    // Télécharger le fichier
    XLSX.writeFile(workbook, fileName);

    alert("Export Excel réussi ! Fichier téléchargé : " + fileName);
  } catch (error) {
    console.error("Erreur lors de l'export:", error);
    alert("Erreur lors de l'export Excel. Veuillez réessayer.");
  }
}

function importFromExcel() {
  document.getElementById("importModal").style.display = "block";
  document.getElementById("importPreview").style.display = "none";
  document.getElementById("excelFile").value = "";
}

function closeImportModal() {
  document.getElementById("importModal").style.display = "none";
  importData = null;
  conflicts = [];
}

function previewExcelFile() {
  const fileInput = document.getElementById("excelFile");
  const file = fileInput.files[0];

  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      // Vérifier la structure du fichier
      const requiredSheets = ["Exercices", "Joueuses", "Performances"];
      const missingSheets = requiredSheets.filter(
        (sheet) => !workbook.SheetNames.includes(sheet)
      );

      if (missingSheets.length > 0) {
        alert(
          `Fichier invalide. Feuilles manquantes : ${missingSheets.join(", ")}`
        );
        return;
      }

      // Lire les données
      importData = {
        exercises: XLSX.utils.sheet_to_json(workbook.Sheets["Exercices"]),
        players: XLSX.utils.sheet_to_json(workbook.Sheets["Joueuses"]),
        performances: XLSX.utils.sheet_to_json(workbook.Sheets["Performances"]),
      };

      // Analyser les conflits
      conflicts = analyzeConflicts(importData);

      // Afficher l'aperçu
      displayImportPreview(importData, conflicts);
    } catch (error) {
      console.error("Erreur lors de la lecture du fichier:", error);
      alert(
        "Erreur lors de la lecture du fichier Excel. Veuillez vérifier le format."
      );
    }
  };
  reader.readAsArrayBuffer(file);
}

function analyzeConflicts(importData) {
  const conflicts = [];

  // Analyser les exercices
  importData.exercises.forEach((importedEx) => {
    const existingEx = exercises.find((ex) => ex.name === importedEx.Nom);
    if (existingEx) {
      conflicts.push({
        type: "exercise",
        name: importedEx.Nom,
        message: `L'exercice "${importedEx.Nom}" existe déjà. Les performances seront fusionnées.`,
      });
    }
  });

  // Analyser les joueuses
  importData.players.forEach((importedPlayer) => {
    const existingPlayer = players.find((p) => p.name === importedPlayer.Nom);
    if (existingPlayer) {
      conflicts.push({
        type: "player",
        name: importedPlayer.Nom,
        message: `La joueuse "${importedPlayer.Nom}" existe déjà. Les performances seront ajoutées.`,
      });
    }
  });

  return conflicts;
}

function displayImportPreview(importData, conflicts) {
  const previewContent = document.getElementById("previewContent");
  const conflictsSection = document.getElementById("conflictsSection");
  const conflictsList = document.getElementById("conflictsList");

  // Afficher le résumé
  let previewHTML = `
        <div class="summary-section">
            <h4>📊 Résumé de l'import</h4>
            <div class="summary-stats">
                <div class="summary-stat">
                    <div class="summary-stat-value">${importData.exercises.length}</div>
                    <div class="summary-stat-label">Exercices</div>
                </div>
                <div class="summary-stat">
                    <div class="summary-stat-value">${importData.players.length}</div>
                    <div class="summary-stat-label">Joueuses</div>
                </div>
                <div class="summary-stat">
                    <div class="summary-stat-value">${importData.performances.length}</div>
                    <div class="summary-stat-label">Performances</div>
                </div>
            </div>
        </div>
    `;

  // Afficher un aperçu des données
  previewHTML += `
        <h4>Exercices à importer :</h4>
        <table class="preview-table">
            <thead>
                <tr><th>Nom</th><th>Unité</th><th>Type</th></tr>
            </thead>
            <tbody>
                ${importData.exercises
                  .slice(0, 5)
                  .map(
                    (ex) => `
                    <tr><td>${ex.Nom}</td><td>${ex.Unité}</td><td>${ex.Type}</td></tr>
                `
                  )
                  .join("")}
                ${
                  importData.exercises.length > 5
                    ? `<tr><td colspan="3">... et ${
                        importData.exercises.length - 5
                      } autres</td></tr>`
                    : ""
                }
            </tbody>
        </table>
        
        <h4>Joueuses à importer :</h4>
        <table class="preview-table">
            <thead>
                <tr><th>Nom</th><th>Date inscription</th></tr>
            </thead>
            <tbody>
                ${importData.players
                  .slice(0, 5)
                  .map(
                    (player) => `
                    <tr><td>${player.Nom}</td><td>${player["Date inscription"]}</td></tr>
                `
                  )
                  .join("")}
                ${
                  importData.players.length > 5
                    ? `<tr><td colspan="2">... et ${
                        importData.players.length - 5
                      } autres</td></tr>`
                    : ""
                }
            </tbody>
        </table>
    `;

  previewContent.innerHTML = previewHTML;

  // Afficher les conflits s'il y en a
  if (conflicts.length > 0) {
    conflictsList.innerHTML = conflicts
      .map(
        (conflict) => `
            <div class="conflict-item">
                <div class="conflict-type">${
                  conflict.type === "exercise" ? "Exercice" : "Joueuse"
                }</div>
                <div class="conflict-details">${conflict.message}</div>
            </div>
        `
      )
      .join("");
    conflictsSection.style.display = "block";
  } else {
    conflictsSection.style.display = "none";
  }

  document.getElementById("importPreview").style.display = "block";
}

function confirmImport() {
  if (!importData) {
    alert("Aucune donnée à importer");
    return;
  }

  try {
    // Importer les exercices
    importData.exercises.forEach((importedEx) => {
      const existingEx = exercises.find((ex) => ex.name === importedEx.Nom);
      if (!existingEx) {
        exercises.push({
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: importedEx.Nom,
          unit: importedEx.Unité,
          type: getExerciseTypeFromLabel(importedEx.Type),
          description: importedEx.Description || "",
          createdAt: new Date().toISOString(),
        });
      }
    });

    // Importer les joueuses
    importData.players.forEach((importedPlayer) => {
      const existingPlayer = players.find((p) => p.name === importedPlayer.Nom);
      if (!existingPlayer) {
        players.push({
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: importedPlayer.Nom,
          registeredAt: new Date().toISOString(),
        });
      }
    });

    // Importer les performances
    importData.performances.forEach((importedPerf) => {
      const player = players.find((p) => p.name === importedPerf.Joueuse);
      const exercise = exercises.find((e) => e.name === importedPerf.Exercice);

      if (player && exercise) {
        const attempts = [
          importedPerf["Tentative 1"],
          importedPerf["Tentative 2"],
          importedPerf["Tentative 3"],
          importedPerf["Tentative 4"],
          importedPerf["Tentative 5"],
        ].filter((attempt) => attempt !== "" && attempt !== undefined);

        if (attempts.length > 0) {
          performances.push({
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            date: new Date().toISOString(), // On utilise la date actuelle
            playerId: player.id,
            exerciseId: exercise.id,
            attempts: attempts,
            bestScore: importedPerf["Meilleur score"],
          });
        }
      }
    });

    saveData();
    updateInterface();
    closeImportModal();

    alert(
      `Import réussi ! ${importData.exercises.length} exercices, ${importData.players.length} joueuses et ${importData.performances.length} performances importés.`
    );
  } catch (error) {
    console.error("Erreur lors de l'import:", error);
    alert("Erreur lors de l'import. Veuillez réessayer.");
  }
}

function getExerciseTypeFromLabel(label) {
  const typeMap = {
    "Temps le plus rapide": "time_fast",
    "Temps le plus long": "time_slow",
    "Distance la plus courte": "distance_short",
    "Distance la plus lointaine": "distance_long",
  };
  return typeMap[label] || "time_fast";
}

// ===== FONCTION FIN D'ENTRAÎNEMENT =====

function finishTraining() {
  if (
    confirm("Voulez-vous terminer l'entraînement et exporter les données ?")
  ) {
    exportToExcel();
    alert("Entraînement terminé ! Les données ont été exportées.");
  }
}

// ===== GESTION DES STATISTIQUES =====

function updateStatsInterface() {
  const exerciseId = document.getElementById("statsExercise").value;
  const playerId = document.getElementById("statsPlayer").value;

  if (!exerciseId) {
    document.getElementById("statsContent").innerHTML = `
            <div class="no-data">
                <h3>📊 Sélectionnez un exercice pour voir les statistiques</h3>
                <p>Les graphiques d'évolution et de comparaison s'afficheront ici</p>
            </div>
        `;
    return;
  }

  const exercise = exercises.find((e) => e.id === exerciseId);
  const exercisePerformances = performances.filter(
    (p) => p.exerciseId === exerciseId
  );

  if (exercisePerformances.length === 0) {
    document.getElementById("statsContent").innerHTML = `
            <div class="no-data">
                <h3>📊 Aucune performance pour cet exercice</h3>
                <p>Commencez par enregistrer des performances pour voir les statistiques</p>
            </div>
        `;
    return;
  }

  // Calculer les statistiques
  const stats = calculateExerciseStats(exerciseId);

  let statsHTML = `
        <div class="exercise-stats">
            <div class="stat-item">
                <div class="stat-value">${stats.totalPerformances}</div>
                <div class="stat-label">Total performances</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${stats.uniquePlayers}</div>
                <div class="stat-label">Joueuses participantes</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${stats.bestScore}</div>
                <div class="stat-label">Meilleur score global</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${stats.averageScore}</div>
                <div class="stat-label">Score moyen</div>
            </div>
        </div>
    `;

  // Afficher les meilleurs scores par joueuse
  if (playerId) {
    // Une joueuse spécifique sélectionnée
    const player = players.find((p) => p.id === playerId);
    const playerPerformances = exercisePerformances.filter(
      (p) => p.playerId === playerId
    );

    if (playerPerformances.length > 0) {
      const bestPerformance = playerPerformances.reduce((best, current) => {
        if (
          exercise.type.includes("time") ||
          exercise.type.includes("distance_short")
        ) {
          return current.bestScore < best.bestScore ? current : best;
        } else {
          return current.bestScore > best.bestScore ? current : best;
        }
      });

      statsHTML += `
                <div class="performance-section">
                    <h3>🏆 Record personnel de ${player.name}</h3>
                    <div class="best-score">
                        ${bestPerformance.bestScore} ${exercise.unit}
                    </div>
                    <p><strong>Date du record :</strong> ${new Date(
                      bestPerformance.date
                    ).toLocaleDateString("fr-FR")}</p>
                    <p><strong>Nombre de performances :</strong> ${
                      playerPerformances.length
                    }</p>
                    
                    <h4>Historique complet :</h4>
                    <div class="performance-history">
                        ${playerPerformances
                          .sort((a, b) => new Date(b.date) - new Date(a.date))
                          .map(
                            (perf) => `
                            <div class="performance-entry">
                                <span class="performance-date">${new Date(
                                  perf.date
                                ).toLocaleDateString("fr-FR")}</span>
                                <span class="performance-score">${
                                  perf.bestScore
                                } ${exercise.unit}</span>
                            </div>
                        `
                          )
                          .join("")}
                    </div>
                </div>
            `;
    } else {
      statsHTML += `
                <div class="no-data">
                    <h3>📊 Aucune performance pour ${player.name}</h3>
                    <p>Cette joueuse n'a pas encore de performance pour cet exercice</p>
                </div>
            `;
    }
  } else {
    // Toutes les joueuses - afficher le classement
    const playerStats = calculatePlayerStatsForExercise(exerciseId);

    statsHTML += `
            <div class="performance-section">
                <h3>🏆 Classement des meilleurs scores</h3>
                <div class="ranking-table">
                    <table class="preview-table">
                        <thead>
                            <tr>
                                <th>Rang</th>
                                <th>Joueuse</th>
                                <th>Meilleur score</th>
                                <th>Date du record</th>
                                <th>Performances</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${playerStats
                              .map(
                                (stat, index) => `
                                <tr>
                                    <td>${index + 1}</td>
                                    <td>${stat.playerName}</td>
                                    <td><strong>${stat.bestScore} ${
                                  exercise.unit
                                }</strong></td>
                                    <td>${new Date(
                                      stat.bestDate
                                    ).toLocaleDateString("fr-FR")}</td>
                                    <td>${stat.performanceCount}</td>
                                </tr>
                            `
                              )
                              .join("")}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div class="performance-section">
                <h3>📈 Détail par joueuse</h3>
                ${playerStats
                  .map(
                    (stat) => `
                    <div class="player-stat-card">
                        <h4>${stat.playerName}</h4>
                        <div class="player-stat-details">
                            <div class="stat-row">
                                <span class="stat-label">Meilleur score :</span>
                                <span class="stat-value">${stat.bestScore} ${
                      exercise.unit
                    }</span>
                            </div>
                            <div class="stat-row">
                                <span class="stat-label">Date du record :</span>
                                <span class="stat-value">${new Date(
                                  stat.bestDate
                                ).toLocaleDateString("fr-FR")}</span>
                            </div>
                            <div class="stat-row">
                                <span class="stat-label">Nombre de performances :</span>
                                <span class="stat-value">${
                                  stat.performanceCount
                                }</span>
                            </div>
                            <div class="stat-row">
                                <span class="stat-label">Score moyen :</span>
                                <span class="stat-value">${stat.averageScore} ${
                      exercise.unit
                    }</span>
                            </div>
                        </div>
                        
                        <div class="recent-performances">
                            <h5>Performances récentes :</h5>
                            <div class="performance-mini-list">
                                ${stat.recentPerformances
                                  .map(
                                    (perf) => `
                                    <div class="mini-performance">
                                        <span class="mini-date">${new Date(
                                          perf.date
                                        ).toLocaleDateString("fr-FR")}</span>
                                        <span class="mini-score">${
                                          perf.bestScore
                                        } ${exercise.unit}</span>
                                    </div>
                                `
                                  )
                                  .join("")}
                            </div>
                        </div>
                    </div>
                `
                  )
                  .join("")}
            </div>
        `;
  }

  // Ajouter le graphique
  statsHTML += `
        <div class="chart-container">
            <h3>Évolution des performances</h3>
            <canvas id="performanceChart" width="400" height="200"></canvas>
        </div>
    `;

  document.getElementById("statsContent").innerHTML = statsHTML;

  // Créer le graphique
  createPerformanceChart(exerciseId, playerId);
}

function calculateExerciseStats(exerciseId) {
  const exercise = exercises.find((e) => e.id === exerciseId);
  const exercisePerformances = performances.filter(
    (p) => p.exerciseId === exerciseId
  );

  const uniquePlayers = new Set(exercisePerformances.map((p) => p.playerId))
    .size;
  const scores = exercisePerformances.map((p) => p.bestScore);

  let bestScore, averageScore;
  if (
    exercise.type.includes("time") ||
    exercise.type.includes("distance_short")
  ) {
    bestScore = Math.min(...scores);
  } else {
    bestScore = Math.max(...scores);
  }

  averageScore = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2);

  return {
    totalPerformances: exercisePerformances.length,
    uniquePlayers: uniquePlayers,
    bestScore: bestScore,
    averageScore: averageScore,
  };
}

function calculatePlayerStatsForExercise(exerciseId) {
  const exercise = exercises.find((e) => e.id === exerciseId);
  const exercisePerformances = performances.filter(
    (p) => p.exerciseId === exerciseId
  );

  // Grouper par joueuse
  const playerStats = [];

  players.forEach((player) => {
    const playerPerformances = exercisePerformances.filter(
      (p) => p.playerId === player.id
    );

    if (playerPerformances.length > 0) {
      // Trouver le meilleur score
      const bestPerformance = playerPerformances.reduce((best, current) => {
        if (
          exercise.type.includes("time") ||
          exercise.type.includes("distance_short")
        ) {
          return current.bestScore < best.bestScore ? current : best;
        } else {
          return current.bestScore > best.bestScore ? current : best;
        }
      });

      // Calculer la moyenne
      const scores = playerPerformances.map((p) => p.bestScore);
      const averageScore = (
        scores.reduce((a, b) => a + b, 0) / scores.length
      ).toFixed(2);

      // Performances récentes (5 dernières)
      const recentPerformances = playerPerformances
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

      playerStats.push({
        playerName: player.name,
        bestScore: bestPerformance.bestScore,
        bestDate: bestPerformance.date,
        performanceCount: playerPerformances.length,
        averageScore: averageScore,
        recentPerformances: recentPerformances,
      });
    }
  });

  // Trier par meilleur score
  if (
    exercise.type.includes("time") ||
    exercise.type.includes("distance_short")
  ) {
    playerStats.sort((a, b) => a.bestScore - b.bestScore);
  } else {
    playerStats.sort((a, b) => b.bestScore - a.bestScore);
  }

  return playerStats;
}

function createPerformanceChart(exerciseId, playerId) {
  const canvas = document.getElementById("performanceChart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const exercise = exercises.find((e) => e.id === exerciseId);
  let exercisePerformances = performances.filter(
    (p) => p.exerciseId === exerciseId
  );

  // Si une joueuse spécifique est sélectionnée, filtrer ses performances
  if (playerId) {
    exercisePerformances = exercisePerformances.filter(
      (p) => p.playerId === playerId
    );
    const player = players.find((p) => p.id === playerId);

    if (exercisePerformances.length === 0) {
      // Pas de données pour cette joueuse
      ctx.font = "16px Arial";
      ctx.fillStyle = "#718096";
      ctx.textAlign = "center";
      ctx.fillText(
        "Aucune performance pour cette joueuse",
        canvas.width / 2,
        canvas.height / 2
      );
      return;
    }
  }

  // Grouper par date
  const performancesByDate = {};
  exercisePerformances.forEach((perf) => {
    const date = new Date(perf.date).toLocaleDateString("fr-FR");
    if (!performancesByDate[date]) {
      performancesByDate[date] = [];
    }
    performancesByDate[date].push(perf.bestScore);
  });

  const labels = Object.keys(performancesByDate).sort(
    (a, b) => new Date(a) - new Date(b)
  );

  if (playerId) {
    // Une joueuse spécifique - afficher toutes ses performances
    const player = players.find((p) => p.id === playerId);
    const datasets = [
      {
        label: `${player.name} - ${exercise.name}`,
        data: exercisePerformances
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .map((p) => p.bestScore),
        borderColor: "#4299e1",
        backgroundColor: "rgba(66, 153, 225, 0.1)",
        tension: 0.1,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ];

    const chartLabels = exercisePerformances
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map((p) => new Date(p.date).toLocaleDateString("fr-FR"));

    new Chart(ctx, {
      type: "line",
      data: {
        labels: chartLabels,
        datasets: datasets,
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: false,
            title: {
              display: true,
              text: exercise.unit,
            },
          },
        },
        plugins: {
          title: {
            display: true,
            text: `Évolution des performances de ${player.name}`,
            font: {
              size: 16,
            },
          },
        },
      },
    });
  } else {
    // Toutes les joueuses - afficher les meilleurs scores par date
    const data = labels.map((date) => {
      const scores = performancesByDate[date];
      if (
        exercise.type.includes("time") ||
        exercise.type.includes("distance_short")
      ) {
        return Math.min(...scores);
      } else {
        return Math.max(...scores);
      }
    });

    new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: `Meilleurs scores - ${exercise.name}`,
            data: data,
            borderColor: "#4299e1",
            backgroundColor: "rgba(66, 153, 225, 0.1)",
            tension: 0.1,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: false,
            title: {
              display: true,
              text: exercise.unit,
            },
          },
        },
        plugins: {
          title: {
            display: true,
            text: `Évolution des meilleurs scores - ${exercise.name}`,
            font: {
              size: 16,
            },
          },
        },
      },
    });
  }
}

function updatePlayerChart() {
  const playerId = document.getElementById("statsPlayer").value;
  const exerciseId = document.getElementById("statsExercise").value;

  if (playerId && exerciseId) {
    updateCurrentPlayerStats(playerId, exerciseId);
  }
}
