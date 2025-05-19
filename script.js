let entries = JSON.parse(localStorage.getItem("entries") || "[]");
let goals = JSON.parse(localStorage.getItem("goals") || "{}");
let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

function showTab(tabId) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.getElementById(tabId + 'Tab').classList.add('active');

  if (tabId === 'log') {
    renderEntries();
    renderTotals();
    renderRemaining();
    renderCheckpoints();
  } else if (tabId === 'favorites') {
    renderFavorites();
  } else if (tabId === 'history') {
    renderHistory();
  } else if (tabId === 'goals') {
    document.getElementById("goalCalories").value = goals.calories || "";
    document.getElementById("goalProtein").value = goals.protein || "";
    document.getElementById("goalFat").value = goals.fat || "";
    document.getElementById("goalCarbs").value = goals.carbs || "";
  }
}

function saveGoals() {
  goals = {
    calories: parseFloat(document.getElementById("goalCalories").value),
    protein: parseFloat(document.getElementById("goalProtein").value),
    fat: parseFloat(document.getElementById("goalFat").value),
    carbs: parseFloat(document.getElementById("goalCarbs").value)
  };
  localStorage.setItem("goals", JSON.stringify(goals));
  alert("Цели сохранены!");
}

function addEntry() {
  const name = document.getElementById("name").value;
  const calories = parseFloat(document.getElementById("calories").value);
  const protein = parseFloat(document.getElementById("protein").value);
  const fat = parseFloat(document.getElementById("fat").value);
  const carbs = parseFloat(document.getElementById("carbs").value);
  const weight = parseFloat(document.getElementById("weight").value);
  const meal = document.getElementById("mealType").value;

  if (!name || isNaN(calories) || isNaN(protein) || isNaN(fat) || isNaN(carbs) || isNaN(weight)) {
    alert("Пожалуйста, заполните все поля!");
    return;
  }

  const factor = weight / 100;

  const entry = {
    name,
    meal,
    calories: calories * factor,
    protein: protein * factor,
    fat: fat * factor,
    carbs: carbs * factor,
    date: new Date().toLocaleDateString("ru-RU")
  };

  entries.push(entry);
  localStorage.setItem("entries", JSON.stringify(entries));
  renderEntries();
  renderTotals();
  renderRemaining();
  renderCheckpoints();
}

function renderEntries() {
  const today = new Date().toLocaleDateString("ru-RU");
  const todayEntries = entries.filter(e => e.date === today);
  const container = document.getElementById("entryList");
  container.innerHTML = "";

  todayEntries.forEach(entry => {
    const li = document.createElement("li");
    li.textContent = `[${entry.meal}] ${entry.name}: ${entry.calories.toFixed(1)} ккал, Б:${entry.protein.toFixed(1)}, Ж:${entry.fat.toFixed(1)}, У:${entry.carbs.toFixed(1)}`;
    container.appendChild(li);
  });
}

function renderTotals() {
  const today = new Date().toLocaleDateString("ru-RU");
  const todayEntries = entries.filter(e => e.date === today);
  const total = {calories: 0, protein: 0, fat: 0, carbs: 0};

  todayEntries.forEach(e => {
    total.calories += e.calories;
    total.protein += e.protein;
    total.fat += e.fat;
    total.carbs += e.carbs;
  });

  document.getElementById("totals").innerHTML =
    `Ккал: ${total.calories.toFixed(1)}<br>Белки: ${total.protein.toFixed(1)}<br>Жиры: ${total.fat.toFixed(1)}<br>Углеводы: ${total.carbs.toFixed(1)}`;
}

function renderRemaining() {
  if (!goals.calories) {
    document.getElementById("remaining").innerHTML = "Цели не заданы.";
    return;
  }

  const today = new Date().toLocaleDateString("ru-RU");
  const todayEntries = entries.filter(e => e.date === today);
  const total = {calories: 0, protein: 0, fat: 0, carbs: 0};

  todayEntries.forEach(e => {
    total.calories += e.calories;
    total.protein += e.protein;
    total.fat += e.fat;
    total.carbs += e.carbs;
  });

  document.getElementById("remaining").innerHTML =
    `Осталось: Ккал: ${(goals.calories - total.calories).toFixed(1)}<br>Б:${(goals.protein - total.protein).toFixed(1)}, Ж:${(goals.fat - total.fat).toFixed(1)}, У:${(goals.carbs - total.carbs).toFixed(1)}`;
}

function addToFavorites() {
  const name = document.getElementById("name").value;
  const calories = parseFloat(document.getElementById("calories").value);
  const protein = parseFloat(document.getElementById("protein").value);
  const fat = parseFloat(document.getElementById("fat").value);
  const carbs = parseFloat(document.getElementById("carbs").value);

  favorites.push({name, calories, protein, fat, carbs});
  localStorage.setItem("favorites", JSON.stringify(favorites));
  alert("Добавлено в избранное!");
}

function renderFavorites() {
  const list = document.getElementById("favoritesList");
  list.innerHTML = "";
  favorites.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.name}: ${item.calories} ккал, Б:${item.protein}, Ж:${item.fat}, У:${item.carbs}`;
    li.onclick = () => {
      document.getElementById("name").value = item.name;
      document.getElementById("calories").value = item.calories;
      document.getElementById("protein").value = item.protein;
      document.getElementById("fat").value = item.fat;
      document.getElementById("carbs").value = item.carbs;
      showTab("log");
    };
    list.appendChild(li);
  });
}

function renderHistory() {
  const grouped = {};
  entries.forEach(e => {
    if (!grouped[e.date]) grouped[e.date] = [];
    grouped[e.date].push(e);
  });

  const list = document.getElementById("historyList");
  list.innerHTML = "";

  Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a)).forEach(date => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${date}</strong><br>` + grouped[date].map(e =>
      `[${e.meal}] ${e.name}: ${e.calories.toFixed(1)} ккал, Б:${e.protein.toFixed(1)}, Ж:${e.fat.toFixed(1)}, У:${e.carbs.toFixed(1)}`
    ).join("<br>");
    list.appendChild(li);
  });
}

function renderCheckpoints() {
  const days = ["вс", "пн", "вт", "ср", "чт", "пт", "сб"];
  const now = new Date();
  const container = document.getElementById("checkpoints");
  container.innerHTML = "";
  const dayOfWeek = now.getDay();

  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(now.getDate() - ((dayOfWeek - i + 7) % 7));
    const dateStr = d.toLocaleDateString("ru-RU");
    const hasEntry = entries.some(e => e.date === dateStr);
    const el = document.createElement("div");
    el.className = hasEntry ? "active" : "";
    el.innerHTML = `${days[i]}<span></span>`;
    container.appendChild(el);
  }
}

showTab("log");
