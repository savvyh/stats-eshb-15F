let players = JSON.parse(localStorage.getItem("players")) || [];
let performances = JSON.parse(localStorage.getItem("performances")) || [];
let sessions = JSON.parse(localStorage.getItem("sessions")) || [];

let importData = null;
let conflicts = [];
let currentSession = null;

document.addEventListener("DOMContentLoaded", function () {
  loadData();
  updateInterface();

  const modals = document.querySelectorAll(".modal");
  modals.forEach((modal) => {
    modal.style.display = "none";
  });
});

function saveData() {
  localStorage.setItem("exercises", JSON.stringify(exercises));
  localStorage.setItem("players", JSON.stringify(players));
  localStorage.setItem("performances", JSON.stringify(performances));
  localStorage.setItem("sessions", JSON.stringify(sessions));
}

function loadData() {
  exercises = JSON.parse(localStorage.getItem("exercises")) || [];
  players = JSON.parse(localStorage.getItem("players")) || [];
  performances = JSON.parse(localStorage.getItem("performances")) || [];
  sessions = JSON.parse(localStorage.getItem("sessions")) || [];
}

function updateInterface() {
  updateExercisesList();
  updatePlayersList();
  updateExerciseSelectors();
  updatePlayerSelectors();
  updateSessionsList();
  updateExercisesSelection();
  initializePerformanceTypeSelector();
}

function showTab(tabName) {
  const tabContents = document.querySelectorAll(".tab-content");
  tabContents.forEach((content) => content.classList.remove("active"));

  const tabs = document.querySelectorAll(".tab");
  tabs.forEach((tab) => tab.classList.remove("active"));

  document.getElementById(tabName).classList.add("active");
  event.target.classList.add("active");
}

function addExercise() {
  const name = document.getElementById("exerciseName").value.trim();
  const unit = document.getElementById("exerciseUnit").value;
  const description = document
    .getElementById("exerciseDescription")
    .value.trim();
  const selectedOption = document.querySelector(".performance-option.selected");

  if (!selectedOption) {
    showErrorModal(
      "❌ Erreur",
      "Veuillez sélectionner un type de performance",
      "❌"
    );
    return;
  }

  const type = selectedOption.dataset.value;

  if (!name) {
    showErrorModal("❌ Erreur", "Veuillez saisir un nom d'exercice", "❌");
    return;
  }

  if (!unit) {
    showErrorModal(
      "❌ Erreur",
      "Veuillez sélectionner une unité de mesure",
      "❌"
    );
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

  document.getElementById("exerciseName").value = "";
  document.getElementById("exerciseUnit").value = "";
  document.getElementById("exerciseDescription").value = "";

  const options = document.querySelectorAll(".performance-option");
  options.forEach((option) => option.classList.remove("selected"));
  document
    .querySelector('.performance-option[data-value="time_fast"]')
    .classList.add("selected");

  showSuccessModal("✅ Succès", "Exercice ajouté avec succès !", "✅");
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
  showConfirmModal(
    "🗑️ Supprimer l'exercice",
    "Êtes-vous sûr de vouloir supprimer cet exercice ?",
    "⚠️",
    "delete",
    function () {
      exercises = exercises.filter((e) => e.id !== id);
      performances = performances.filter((p) => p.exerciseId !== id);
      saveData();
      updateInterface();
    }
  );
}

function addPlayer() {
  const name = document.getElementById("playerName").value.trim();

  if (!name) {
    showErrorModal("❌ Erreur", "Veuillez saisir un nom de joueuse", "❌");
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

  document.getElementById("playerName").value = "";
}

function updatePlayersList() {
  const container = document.getElementById("playersList");
  container.innerHTML = "";

  players.forEach((player) => {
    const card = document.createElement("div");
    card.className = "player-card";
    card.innerHTML = `
            <div class="player-name">${player.name}</div>
            <button class="btn-delete" onclick="deletePlayer('${player.id}')" title="Supprimer ${player.name}">
              ✕
            </button>
        `;
    container.appendChild(card);
  });
}

function deletePlayer(id) {
  showConfirmModal(
    "🗑️ Supprimer la joueuse",
    "Êtes-vous sûr de vouloir supprimer cette joueuse ?",
    "⚠️",
    "delete",
    function () {
      players = players.filter((p) => p.id !== id);
      performances = performances.filter((p) => p.playerId !== id);
      saveData();
      updateInterface();
    }
  );
}

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

    updateAttemptsGrid();

    document.getElementById("performanceInterface").style.display = "block";
    updateCurrentPlayerStats(playerId, exerciseId);
  } else {
    document.getElementById("performanceInterface").style.display = "none";
    document.getElementById("currentPlayerStats").style.display = "none";
  }
}

function updateAttemptsGrid() {
  const seriesCount =
    parseInt(document.getElementById("seriesCount").value) || 1;
  const repetitionsCount =
    parseInt(document.getElementById("repetitionsCount").value) || 5;
  const container = document.getElementById("seriesContainer");

  container.innerHTML = "";

  for (let series = 1; series <= seriesCount; series++) {
    const seriesDiv = document.createElement("div");
    seriesDiv.className = "series-container";

    const seriesHeader = document.createElement("h4");
    seriesHeader.className = "series-header";
    seriesHeader.textContent = `Série ${series}`;

    const seriesGrid = document.createElement("div");
    seriesGrid.className = "series-grid";

    for (let rep = 1; rep <= repetitionsCount; rep++) {
      const input = document.createElement("input");
      input.type = "number";
      input.step = "0.01";
      input.placeholder = `Rép. ${rep}`;
      input.id = `series${series}_rep${rep}`;
      input.onchange = updateSeriesSummary;
      seriesGrid.appendChild(input);
    }

    const seriesSummary = document.createElement("div");
    seriesSummary.className = "series-summary";
    seriesSummary.id = `series${series}_summary`;
    seriesSummary.innerHTML =
      "Meilleur score de la série : <span class='best-score'>-</span>";

    seriesDiv.appendChild(seriesHeader);
    seriesDiv.appendChild(seriesGrid);
    seriesDiv.appendChild(seriesSummary);
    container.appendChild(seriesDiv);
  }
}

function updateSeriesSummary() {
  const seriesCount =
    parseInt(document.getElementById("seriesCount").value) || 1;
  const exerciseId = document.getElementById("perfExercise").value;

  if (!exerciseId) return;

  const exercise = exercises.find((e) => e.id === exerciseId);

  for (let series = 1; series <= seriesCount; series++) {
    const repetitionsCount =
      parseInt(document.getElementById("repetitionsCount").value) || 5;
    const seriesValues = [];

    for (let rep = 1; rep <= repetitionsCount; rep++) {
      const input = document.getElementById(`series${series}_rep${rep}`);
      if (input && input.value) {
        seriesValues.push(parseFloat(input.value));
      }
    }

    const summaryElement = document.getElementById(`series${series}_summary`);
    if (summaryElement && seriesValues.length > 0) {
      let bestScore;
      if (
        exercise.type.includes("time") ||
        exercise.type.includes("distance_short")
      ) {
        bestScore = Math.min(...seriesValues);
      } else {
        bestScore = Math.max(...seriesValues);
      }

      summaryElement.innerHTML = `Meilleur score de la série : <span class='best-score'>${bestScore} ${exercise.unit}</span>`;
    } else if (summaryElement) {
      summaryElement.innerHTML =
        "Meilleur score de la série : <span class='best-score'>-</span>";
    }
  }
}

function savePerformance() {
  const exerciseId = document.getElementById("perfExercise").value;
  const playerId = document.getElementById("perfPlayer").value;

  if (!exerciseId || !playerId) {
    showErrorModal(
      "❌ Erreur",
      "Veuillez sélectionner un exercice et une joueuse",
      "❌"
    );
    return;
  }

  const seriesCount =
    parseInt(document.getElementById("seriesCount").value) || 1;
  const repetitionsCount =
    parseInt(document.getElementById("repetitionsCount").value) || 5;
  const allAttempts = [];
  const seriesData = [];

  for (let series = 1; series <= seriesCount; series++) {
    const seriesValues = [];
    for (let rep = 1; rep <= repetitionsCount; rep++) {
      const input = document.getElementById(`series${series}_rep${rep}`);
      if (input && input.value) {
        const value = parseFloat(input.value);
        seriesValues.push(value);
        allAttempts.push(value);
      }
    }
    if (seriesValues.length > 0) {
      seriesData.push({
        seriesNumber: series,
        values: seriesValues,
      });
    }
  }

  if (allAttempts.length === 0) {
    showErrorModal(
      "❌ Erreur",
      "Veuillez saisir au moins une performance",
      "❌"
    );
    return;
  }

  const exercise = exercises.find((e) => e.id === exerciseId);
  let bestScore;

  if (
    exercise.type.includes("time") ||
    exercise.type.includes("distance_short")
  ) {
    bestScore = Math.min(...allAttempts);
  } else {
    bestScore = Math.max(...allAttempts);
  }

  const performance = {
    id: Date.now().toString(),
    date: new Date().toISOString(),
    playerId: playerId,
    exerciseId: exerciseId,
    attempts: allAttempts,
    bestScore: bestScore,
    seriesData: seriesData,
    seriesCount: seriesCount,
    repetitionsCount: repetitionsCount,
  };

  performances.push(performance);
  saveData();
  updateInterface();

  resetPerformanceForm();

  showSuccessModal("✅ Succès", "Performance enregistrée avec succès !", "✅");
}

function resetPerformanceForm() {
  const seriesCount =
    parseInt(document.getElementById("seriesCount").value) || 1;
  const repetitionsCount =
    parseInt(document.getElementById("repetitionsCount").value) || 5;

  for (let series = 1; series <= seriesCount; series++) {
    for (let rep = 1; rep <= repetitionsCount; rep++) {
      const input = document.getElementById(`series${series}_rep${rep}`);
      if (input) {
        input.value = "";
      }
    }
  }

  updateSeriesSummary();
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

function exportToExcel() {
  try {
    const workbook = XLSX.utils.book_new();

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

    const playersData = players.map((player) => {
      const performanceCount = performances.filter(
        (p) => p.playerId === player.id
      ).length;
      return {
        ID: player.id,
        Nom: player.name,
        "Date de la séance": new Date(player.registeredAt).toLocaleDateString(
          "fr-FR"
        ),
        "Nombre de performances": performanceCount,
      };
    });
    const playersSheet = XLSX.utils.json_to_sheet(playersData);
    XLSX.utils.book_append_sheet(workbook, playersSheet, "Joueuses");

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

    const today = new Date().toISOString().split("T")[0];
    const fileName = `performances-${today}.xlsx`;

    XLSX.writeFile(workbook, fileName);

    showSuccessModal(
      "✅ Export réussi",
      "Fichier téléchargé : " + fileName,
      "✅"
    );
  } catch (error) {
    console.error("Erreur lors de l'export:", error);
    showErrorModal(
      "❌ Erreur d'export",
      "Erreur lors de l'export Excel. Veuillez réessayer.",
      "❌"
    );
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

      const requiredSheets = ["Exercices", "Joueuses", "Performances"];
      const missingSheets = requiredSheets.filter(
        (sheet) => !workbook.SheetNames.includes(sheet)
      );

      if (missingSheets.length > 0) {
        showErrorModal(
          "❌ Fichier invalide",
          `Fichier invalide. Feuilles manquantes : ${missingSheets.join(", ")}`,
          "❌"
        );
        return;
      }

      importData = {
        exercises: XLSX.utils.sheet_to_json(workbook.Sheets["Exercices"]),
        players: XLSX.utils.sheet_to_json(workbook.Sheets["Joueuses"]),
        performances: XLSX.utils.sheet_to_json(workbook.Sheets["Performances"]),
      };

      conflicts = analyzeConflicts(importData);

      displayImportPreview(importData, conflicts);
    } catch (error) {
      console.error("Erreur lors de la lecture du fichier:", error);
      showErrorModal(
        "❌ Erreur de lecture",
        "Erreur lors de la lecture du fichier Excel. Veuillez vérifier le format.",
        "❌"
      );
    }
  };
  reader.readAsArrayBuffer(file);
}

function analyzeConflicts(importData) {
  const conflicts = [];

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
            date: new Date().toISOString(),
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

    showSuccessModal(
      "✅ Import réussi",
      `${importData.exercises.length} exercices, ${importData.players.length} joueuses et ${importData.performances.length} performances importés.`,
      "✅"
    );
  } catch (error) {
    console.error("Erreur lors de l'import:", error);
    showErrorModal(
      "❌ Erreur d'import",
      "Erreur lors de l'import. Veuillez réessayer.",
      "❌"
    );
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

function finishTraining() {
  showConfirmModal(
    "🏁 Fin d'entraînement",
    "Voulez-vous terminer l'entraînement et exporter les données ?",
    "🏁",
    "finish",
    function () {
      exportToExcel();
      showSuccessModal(
        "✅ Entraînement terminé",
        "Les données ont été exportées.",
        "✅"
      );
    }
  );
}

function updateStatsInterface() {
  const exerciseId = document.getElementById("statsExercise").value;
  const playerId = document.getElementById("statsPlayer").value;

  if (!exerciseId && !playerId) {
    document.getElementById("statsContent").innerHTML = `
            <div class="no-data">
                <h3>📊 Sélectionnez un exercice ou une joueuse pour voir les statistiques</h3>
                <p>Les graphiques d'évolution et de comparaison s'afficheront ici</p>
            </div>
        `;
    return;
  }

  if (!exerciseId && playerId) {
    displayPlayerAllExercisesStats(playerId);
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

  if (playerId) {
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
                <h3>💡 Conseil</h3>
                <p>Sélectionnez une joueuse spécifique pour voir ses statistiques détaillées et son historique de performances.</p>
            </div>
        `;
  }

  if (playerId) {
    statsHTML += `
        <div class="chart-container">
            <h3>Évolution des performances</h3>
            <canvas id="performanceChart" width="400" height="200"></canvas>
        </div>
    `;
  }

  document.getElementById("statsContent").innerHTML = statsHTML;

  if (playerId) {
    createPerformanceChart(exerciseId, playerId);
  }
}

function displayPlayerAllExercisesStats(playerId) {
  const player = players.find((p) => p.id === playerId);
  const playerPerformances = performances.filter(
    (p) => p.playerId === playerId
  );

  if (playerPerformances.length === 0) {
    document.getElementById("statsContent").innerHTML = `
      <div class="no-data">
        <h3>📊 Aucune performance pour ${player.name}</h3>
        <p>Cette joueuse n'a pas encore de performance enregistrée</p>
      </div>
    `;
    return;
  }

  const totalPerformances = playerPerformances.length;
  const uniqueExercises = new Set(playerPerformances.map((p) => p.exerciseId))
    .size;

  let statsHTML = `
    <div class="performance-section">
      <h3>👤 Profil de ${player.name}</h3>
      <div class="exercise-stats">
        <div class="stat-item">
          <div class="stat-value">${totalPerformances}</div>
          <div class="stat-label">Total performances</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${uniqueExercises}</div>
          <div class="stat-label">Exercices pratiqués</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${new Date(
            player.registeredAt
          ).toLocaleDateString("fr-FR")}</div>
          <div class="stat-label">Date de la séance</div>
        </div>
      </div>
    </div>
  `;

  const performancesByExercise = {};
  playerPerformances.forEach((perf) => {
    if (!performancesByExercise[perf.exerciseId]) {
      performancesByExercise[perf.exerciseId] = [];
    }
    performancesByExercise[perf.exerciseId].push(perf);
  });

  const exerciseStats = [];
  Object.keys(performancesByExercise).forEach((exerciseId) => {
    const exercise = exercises.find((e) => e.id === exerciseId);
    const exercisePerformances = performancesByExercise[exerciseId];

    const bestPerformance = exercisePerformances.reduce((best, current) => {
      if (
        exercise.type.includes("time") ||
        exercise.type.includes("distance_short")
      ) {
        return current.bestScore < best.bestScore ? current : best;
      } else {
        return current.bestScore > best.bestScore ? current : best;
      }
    });

    const scores = exercisePerformances.map((p) => p.bestScore);
    const exerciseAverage = (
      scores.reduce((a, b) => a + b, 0) / scores.length
    ).toFixed(2);

    exerciseStats.push({
      exercise: exercise,
      bestScore: bestPerformance.bestScore,
      bestDate: bestPerformance.date,
      performanceCount: exercisePerformances.length,
      averageScore: exerciseAverage,
      recentPerformances: exercisePerformances
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 3),
    });
  });

  exerciseStats.sort((a, b) => b.performanceCount - a.performanceCount);

  statsHTML += `
    <div class="performance-section">
      <h3>🏆 Records par exercice</h3>
      ${exerciseStats
        .map(
          (stat) => `
                    <div class="player-stat-card">
          <h4>${stat.exercise.name}</h4>
                        <div class="player-stat-details">
                            <div class="stat-row">
              <span class="stat-label">Record personnel :</span>
                                <span class="stat-value">${stat.bestScore} ${
            stat.exercise.unit
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
              <span class="stat-value">${stat.performanceCount}</span>
                            </div>
                            <div class="stat-row">
                                <span class="stat-label">Score moyen :</span>
                                <span class="stat-value">${stat.averageScore} ${
            stat.exercise.unit
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
                  <span class="mini-score">${perf.bestScore} ${
                                      stat.exercise.unit
                                    }</span>
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

  statsHTML += `
        <div class="chart-container">
      <h3>📈 Progression globale</h3>
      <canvas id="globalProgressChart" width="400" height="200"></canvas>
        </div>
    `;

  document.getElementById("statsContent").innerHTML = statsHTML;

  createGlobalProgressChart(playerId);
}

function createGlobalProgressChart(playerId) {
  const canvas = document.getElementById("globalProgressChart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const player = players.find((p) => p.id === playerId);
  const playerPerformances = performances.filter(
    (p) => p.playerId === playerId
  );

  if (playerPerformances.length === 0) return;

  const sortedPerformances = playerPerformances.sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const exerciseDatasets = {};
  sortedPerformances.forEach((perf) => {
    const exercise = exercises.find((e) => e.id === perf.exerciseId);
    if (!exerciseDatasets[exercise.name]) {
      exerciseDatasets[exercise.name] = {
        exercise: exercise,
        data: [],
        labels: [],
      };
    }
    exerciseDatasets[exercise.name].data.push(perf.bestScore);
    exerciseDatasets[exercise.name].labels.push(
      new Date(perf.date).toLocaleDateString("fr-FR")
    );
  });

  const colors = [
    "#4299e1",
    "#48bb78",
    "#ed8936",
    "#f56565",
    "#9f7aea",
    "#38b2ac",
  ];
  const datasets = Object.keys(exerciseDatasets).map((exerciseName, index) => {
    const dataset = exerciseDatasets[exerciseName];
    return {
      label: exerciseName,
      data: dataset.data,
      borderColor: colors[index % colors.length],
      backgroundColor: colors[index % colors.length] + "20",
      tension: 0.1,
      pointRadius: 4,
      pointHoverRadius: 6,
    };
  });

  const allLabels = [
    ...new Set(
      sortedPerformances.map((p) =>
        new Date(p.date).toLocaleDateString("fr-FR")
      )
    ),
  ].sort();

  new Chart(ctx, {
    type: "line",
    data: {
      labels: allLabels,
      datasets: datasets,
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: false,
          title: {
            display: true,
            text: "Scores",
          },
        },
      },
      plugins: {
        title: {
          display: true,
          text: `Progression globale de ${player.name}`,
          font: {
            size: 16,
          },
        },
        legend: {
          position: "top",
        },
      },
    },
  });
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

  const playerStats = [];

  players.forEach((player) => {
    const playerPerformances = exercisePerformances.filter(
      (p) => p.playerId === player.id
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

      const scores = playerPerformances.map((p) => p.bestScore);
      const averageScore = (
        scores.reduce((a, b) => a + b, 0) / scores.length
      ).toFixed(2);

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

  if (playerId) {
    exercisePerformances = exercisePerformances.filter(
      (p) => p.playerId === playerId
    );
    const player = players.find((p) => p.id === playerId);

    if (exercisePerformances.length === 0) {
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

function resetAllData() {
  showConfirmModal(
    "🔄 Recommencer la séance",
    "⚠️ Êtes-vous sûr de vouloir recommencer la séance ?\n\nCette action supprimera TOUTES les données :\n- Tous les exercices\n- Toutes les joueuses\n- Toutes les performances\n\nCette action est irréversible !",
    "⚠️",
    "reset",
    function () {
      exercises = [];
      players = [];
      performances = [];
      saveData();
      updateInterface();

      document.getElementById("exerciseName").value = "";
      document.getElementById("exerciseDescription").value = "";
      document.getElementById("playerName").value = "";

      document.getElementById("perfExercise").innerHTML =
        '<option value="">Sélectionnez un exercice</option>';
      document.getElementById("perfPlayer").innerHTML =
        '<option value="">Sélectionnez une joueuse</option>';
      document.getElementById("statsExercise").innerHTML =
        '<option value="">Sélectionnez un exercice</option>';
      document.getElementById("statsPlayer").innerHTML =
        '<option value="">Toutes les joueuses</option>';

      document.getElementById("performanceInterface").style.display = "none";
      document.getElementById("currentPlayerStats").style.display = "none";
      document.getElementById("statsContent").innerHTML = `
      <div class="no-data">
        <h3>📊 Sélectionnez un exercice pour voir les statistiques</h3>
        <p>Les graphiques d'évolution et de comparaison s'afficheront ici</p>
      </div>
    `;

      showSuccessModal("✅ Succès", "Séance réinitialisée avec succès !", "✅");
    }
  );
}

function resetExercises() {
  showConfirmModal(
    "🗑️ Supprimer les exercices",
    "⚠️ Êtes-vous sûr de vouloir supprimer TOUS les exercices ?\n\nCette action supprimera également toutes les performances associées.\n\nCette action est irréversible !",
    "⚠️",
    "reset",
    function () {
      exercises = [];
      performances = performances.filter((p) => false);
      saveData();
      updateInterface();

      document.getElementById("exerciseName").value = "";
      document.getElementById("exerciseDescription").value = "";
      document.querySelector(
        'input[name="exerciseType"][value="time_fast"]'
      ).checked = true;

      document.getElementById("perfExercise").innerHTML =
        '<option value="">Sélectionnez un exercice</option>';
      document.getElementById("statsExercise").innerHTML =
        '<option value="">Sélectionnez un exercice</option>';

      document.getElementById("performanceInterface").style.display = "none";
      document.getElementById("currentPlayerStats").style.display = "none";
      document.getElementById("statsContent").innerHTML = `
      <div class="no-data">
        <h3>📊 Sélectionnez un exercice pour voir les statistiques</h3>
        <p>Les graphiques d'évolution et de comparaison s'afficheront ici</p>
      </div>
    `;

      showSuccessModal("✅ Succès", "Exercices supprimés avec succès !", "✅");
    }
  );
}

function resetPlayers() {
  showConfirmModal(
    "🗑️ Supprimer les joueuses",
    "⚠️ Êtes-vous sûr de vouloir supprimer TOUTES les joueuses ?\n\nCette action supprimera également toutes les performances associées.\n\nCette action est irréversible !",
    "⚠️",
    "reset",
    function () {
      players = [];
      performances = performances.filter((p) => false);
      saveData();
      updateInterface();

      document.getElementById("playerName").value = "";

      document.getElementById("perfPlayer").innerHTML =
        '<option value="">Sélectionnez une joueuse</option>';
      document.getElementById("statsPlayer").innerHTML =
        '<option value="">Toutes les joueuses</option>';

      document.getElementById("performanceInterface").style.display = "none";
      document.getElementById("currentPlayerStats").style.display = "none";
      document.getElementById("statsContent").innerHTML = `
      <div class="no-data">
        <h3>📊 Sélectionnez un exercice pour voir les statistiques</h3>
        <p>Les graphiques d'évolution et de comparaison s'afficheront ici</p>
      </div>
    `;

      showSuccessModal("✅ Succès", "Joueuses supprimées avec succès !", "✅");
    }
  );
}

function resetPerformances() {
  showConfirmModal(
    "🗑️ Supprimer les performances",
    "⚠️ Êtes-vous sûr de vouloir supprimer TOUTES les performances ?\n\nCette action est irréversible !",
    "⚠️",
    "reset",
    function () {
      performances = [];
      saveData();
      updateInterface();

      document.getElementById("performanceInterface").style.display = "none";
      document.getElementById("currentPlayerStats").style.display = "none";
      document.getElementById("statsContent").innerHTML = `
      <div class="no-data">
        <h3>📊 Sélectionnez un exercice pour voir les statistiques</h3>
        <p>Les graphiques d'évolution et de comparaison s'afficheront ici</p>
      </div>
    `;

      showSuccessModal(
        "✅ Succès",
        "Performances supprimées avec succès !",
        "✅"
      );
    }
  );
}

let confirmCallback = null;
let confirmAction = null;

function showConfirmModal(title, message, icon, action, callback) {
  document.getElementById("confirmTitle").textContent = title;
  document.getElementById("confirmMessage").textContent = message;
  document.getElementById("confirmIcon").textContent = icon;
  confirmAction = action;
  confirmCallback = callback;
  document.getElementById("confirmModal").style.display = "block";
}

function closeConfirmModal() {
  document.getElementById("confirmModal").style.display = "none";
  confirmCallback = null;
  confirmAction = null;
}

function executeConfirmAction() {
  if (confirmCallback) {
    confirmCallback();
  }
  closeConfirmModal();
}

function showSuccessModal(title, message, icon = "✅") {
  document.getElementById("successTitle").textContent = title;
  document.getElementById("successMessage").textContent = message;
  document.getElementById("successIcon").textContent = icon;
  document.getElementById("successModal").style.display = "block";
}

function closeSuccessModal() {
  document.getElementById("successModal").style.display = "none";
}

function showErrorModal(title, message, icon = "❌") {
  document.getElementById("errorTitle").textContent = title;
  document.getElementById("errorMessage").textContent = message;
  document.getElementById("errorIcon").textContent = icon;
  document.getElementById("errorModal").style.display = "block";
}

function closeErrorModal() {
  document.getElementById("errorModal").style.display = "none";
}

window.onclick = function (event) {
  const modals = document.querySelectorAll(".modal");
  modals.forEach((modal) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
};

// ===== DASHBOARD FUNCTIONS =====

function showSection(sectionName) {
  const sections = document.querySelectorAll(".content-section");
  sections.forEach((section) => section.classList.remove("active"));

  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach((item) => item.classList.remove("active"));

  document.getElementById(sectionName).classList.add("active");
  event.target.classList.add("active");
}

function showManagementTab(tabName) {
  const tabs = document.querySelectorAll(".management-content");
  tabs.forEach((tab) => tab.classList.remove("active"));

  const tabButtons = document.querySelectorAll(".management-tab");
  tabButtons.forEach((btn) => btn.classList.remove("active"));

  document.getElementById(tabName + "-management").classList.add("active");
  event.target.classList.add("active");
}

function showSeancesTab(tabName) {
  const tabs = document.querySelectorAll(".seances-content");
  tabs.forEach((tab) => tab.classList.remove("active"));

  const tabButtons = document.querySelectorAll(".seances-tab");
  tabButtons.forEach((btn) => btn.classList.remove("active"));

  document.getElementById(tabName).classList.add("active");
  event.target.classList.add("active");
}

function updateSessionsList() {
  const container = document.getElementById("seancesList");
  if (!container) return;

  if (sessions.length === 0) {
    container.innerHTML = `
      <div class="no-data">
        <h3>📋 Aucune séance créée</h3>
        <p>Créez votre première séance pour commencer</p>
      </div>
    `;
    return;
  }

  container.innerHTML = sessions
    .map(
      (session) => `
    <div class="session-card">
      <div class="session-header">
        <h3>${session.name}</h3>
        <span class="session-date">${new Date(session.date).toLocaleDateString(
          "fr-FR"
        )}</span>
      </div>
      <div class="session-details">
        <p><strong>Exercices :</strong> ${session.exercises.length}</p>
        <p><strong>Séries :</strong> ${session.seriesCount}</p>
      </div>
      <div class="session-actions">
        <button class="btn" onclick="startSession('${
          session.id
        }')">▶️ Démarrer</button>
        <button class="btn btn-danger" onclick="deleteSession('${
          session.id
        }')">🗑️ Supprimer</button>
      </div>
    </div>
  `
    )
    .join("");
}

function updateExercisesSelection() {
  const container = document.getElementById("exercisesSelection");
  if (!container) return;

  if (exercises.length === 0) {
    container.innerHTML = `
      <div class="no-data">
        <p>Aucun exercice créé. Créez d'abord des exercices.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = exercises
    .map(
      (exercise) => `
    <div class="exercise-selection-item" onclick="toggleExerciseSelection('${
      exercise.id
    }')" id="exercise-${exercise.id}">
      <h4>${exercise.name}</h4>
      <p>${exercise.description || "Aucune description"}</p>
      <p><strong>Unité :</strong> ${exercise.unit}</p>
      <div class="exercise-repetitions">
        <label>Répétitions :</label>
        <input type="number" min="1" max="20" value="5" onchange="updateExerciseRepetitions('${
          exercise.id
        }', this.value)" onclick="event.stopPropagation()">
      </div>
    </div>
  `
    )
    .join("");
}

function toggleExerciseSelection(exerciseId) {
  const item = document.getElementById(`exercise-${exerciseId}`);
  item.classList.toggle("selected");
}

function updateExerciseRepetitions(exerciseId, repetitions) {
  const exercise = exercises.find((e) => e.id === exerciseId);
  if (exercise) {
    exercise.repetitions = parseInt(repetitions);
  }
}

function createSession() {
  const name = document.getElementById("sessionName").value.trim();
  const date = document.getElementById("sessionDate").value;
  const seriesCount =
    parseInt(document.getElementById("seriesCount").value) || 1;

  if (!name) {
    showErrorModal("❌ Erreur", "Veuillez saisir un nom de séance", "❌");
    return;
  }

  if (!date) {
    showErrorModal("❌ Erreur", "Veuillez sélectionner une date", "❌");
    return;
  }

  const selectedExercises = [];
  exercises.forEach((exercise) => {
    const item = document.getElementById(`exercise-${exercise.id}`);
    if (item && item.classList.contains("selected")) {
      selectedExercises.push({
        id: exercise.id,
        name: exercise.name,
        unit: exercise.unit,
        type: exercise.type,
        repetitions: exercise.repetitions || 5,
      });
    }
  });

  if (selectedExercises.length === 0) {
    showErrorModal(
      "❌ Erreur",
      "Veuillez sélectionner au moins un exercice",
      "❌"
    );
    return;
  }

  const session = {
    id: Date.now().toString(),
    name: name,
    date: date,
    seriesCount: seriesCount,
    exercises: selectedExercises,
    createdAt: new Date().toISOString(),
  };

  sessions.push(session);
  saveData();
  updateInterface();

  document.getElementById("sessionName").value = "";
  document.getElementById("sessionDate").value = "";
  document.getElementById("seriesCount").value = "1";

  exercises.forEach((exercise) => {
    const item = document.getElementById(`exercise-${exercise.id}`);
    if (item) {
      item.classList.remove("selected");
    }
  });

  showSuccessModal("✅ Succès", "Séance créée avec succès !", "✅");
}

function deleteSession(sessionId) {
  showConfirmModal(
    "🗑️ Supprimer la séance",
    "Êtes-vous sûr de vouloir supprimer cette séance ?",
    "⚠️",
    "delete",
    function () {
      sessions = sessions.filter((s) => s.id !== sessionId);
      saveData();
      updateInterface();
      showSuccessModal("✅ Succès", "Séance supprimée avec succès !", "✅");
    }
  );
}

function startSession(sessionId) {
  currentSession = sessions.find((s) => s.id === sessionId);
  if (!currentSession) return;

  document.getElementById("sessionTitle").textContent = currentSession.name;
  document.getElementById("sessionInterface").style.display = "block";

  updatePlayersSelection();
  updateSessionTabs();
}

function closeSession() {
  document.getElementById("sessionInterface").style.display = "none";
  currentSession = null;
}

function updatePlayersSelection() {
  const container = document.getElementById("playersSelection");
  if (!container) return;

  container.innerHTML = players
    .map(
      (player) => `
    <div class="player-selection-item" onclick="togglePlayerSelection('${player.id}')" id="player-${player.id}">
      ${player.name}
    </div>
  `
    )
    .join("");
}

function togglePlayerSelection(playerId) {
  const item = document.getElementById(`player-${playerId}`);
  item.classList.toggle("selected");
  updateSessionTabs();
}

function updateSessionTabs() {
  const container = document.getElementById("sessionTabs");
  const contentContainer = document.getElementById("sessionContent");

  if (!container || !contentContainer) return;

  const selectedPlayers = players.filter((player) => {
    const item = document.getElementById(`player-${player.id}`);
    return item && item.classList.contains("selected");
  });

  if (selectedPlayers.length === 0) {
    container.innerHTML = "";
    contentContainer.innerHTML = `
      <div class="no-data">
        <h3>👥 Sélectionnez des joueuses</h3>
        <p>Sélectionnez au moins une joueuse pour commencer la séance</p>
      </div>
    `;
    return;
  }

  container.innerHTML = selectedPlayers
    .map(
      (player, index) => `
    <button class="session-tab ${
      index === 0 ? "active" : ""
    }" onclick="showPlayerSession('${player.id}')">
      ${player.name}
    </button>
  `
    )
    .join("");

  if (selectedPlayers.length > 0) {
    showPlayerSession(selectedPlayers[0].id);
  }
}

function showPlayerSession(playerId) {
  const tabs = document.querySelectorAll(".session-tab");
  tabs.forEach((tab) => tab.classList.remove("active"));
  event.target.classList.add("active");

  const player = players.find((p) => p.id === playerId);
  if (!player || !currentSession) return;

  const contentContainer = document.getElementById("sessionContent");
  contentContainer.innerHTML = `
    <div class="session-player-content">
      <h3>${player.name} - ${currentSession.name}</h3>
      <div class="session-exercises">
        ${currentSession.exercises
          .map(
            (exercise, index) => `
          <div class="session-exercise">
            <h4>${index + 1}. ${exercise.name}</h4>
            <p>Répétitions : ${exercise.repetitions}</p>
            <div class="exercise-inputs">
              ${generateExerciseInputs(exercise, playerId)}
            </div>
          </div>
        `
          )
          .join("")}
      </div>
      <div class="session-actions">
        <button class="btn" onclick="saveSessionPerformance('${playerId}')">💾 Sauvegarder</button>
        <button class="btn btn-secondary" onclick="resetSessionForm()">🔄 Reset</button>
      </div>
    </div>
  `;
}

function generateExerciseInputs(exercise, playerId) {
  let inputs = "";
  for (let rep = 1; rep <= exercise.repetitions; rep++) {
    inputs += `
      <div class="input-group">
        <label>Rép. ${rep}:</label>
        <input type="number" step="0.01" id="perf-${playerId}-${exercise.id}-${rep}" placeholder="${exercise.unit}">
      </div>
    `;
  }
  return inputs;
}

function saveSessionPerformance(playerId) {
  if (!currentSession) return;

  const player = players.find((p) => p.id === playerId);
  if (!player) return;

  const allPerformances = [];

  currentSession.exercises.forEach((exercise) => {
    const attempts = [];
    for (let rep = 1; rep <= exercise.repetitions; rep++) {
      const input = document.getElementById(
        `perf-${playerId}-${exercise.id}-${rep}`
      );
      if (input && input.value) {
        attempts.push(parseFloat(input.value));
      }
    }

    if (attempts.length > 0) {
      const exerciseData = exercises.find((e) => e.id === exercise.id);
      let bestScore;

      if (
        exerciseData.type.includes("time") ||
        exerciseData.type.includes("distance_short")
      ) {
        bestScore = Math.min(...attempts);
      } else {
        bestScore = Math.max(...attempts);
      }

      const performance = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        date: currentSession.date,
        playerId: playerId,
        exerciseId: exercise.id,
        attempts: attempts,
        bestScore: bestScore,
        sessionId: currentSession.id,
      };

      allPerformances.push(performance);
    }
  });

  if (allPerformances.length === 0) {
    showErrorModal(
      "❌ Erreur",
      "Veuillez saisir au moins une performance",
      "❌"
    );
    return;
  }

  performances.push(...allPerformances);
  saveData();

  showSuccessModal(
    "✅ Succès",
    "Performances enregistrées avec succès !",
    "✅"
  );
  resetSessionForm();
}

function resetSessionForm() {
  const inputs = document.querySelectorAll(".session-exercise input");
  inputs.forEach((input) => (input.value = ""));
}

function initializePerformanceTypeSelector() {
  const options = document.querySelectorAll(".performance-option");

  options.forEach((option) => {
    option.addEventListener("click", function () {
      options.forEach((opt) => opt.classList.remove("selected"));
      this.classList.add("selected");
    });
  });

  if (options.length > 0) {
    options[0].classList.add("selected");
  }
}
