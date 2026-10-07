console.log("Personal Fitness Tracker loaded");

import {
    getWorkouts,
    saveWorkouts,
    getFavorites,
    saveFavorites,
} from "./storage.js";

const workoutForm = document.querySelector("#workoutForm");
const formMessage = document.querySelector("#formMessage");
const workoutList = document.querySelector("#workoutList");

let editingWorkoutId = null;

// =========================
// WORKOUTS
// =========================

function displayWorkouts() {
    const workouts = getWorkouts();

    workoutList.innerHTML = "";

    if (workouts.length === 0) {
        workoutList.innerHTML = "<p>No workouts saved yet.</p>";
        return;
    }

    workouts.forEach((workout) => {
        const workoutItem = document.createElement("article");

        workoutItem.classList.add("workout-item");

        workoutItem.innerHTML = `
      <h3>${workout.workoutName}</h3>

      <div class="workout-details">
        <p><strong>Exercise:</strong> ${workout.exerciseName}</p>
        <p><strong>Sets:</strong> ${workout.sets}</p>
        <p><strong>Reps:</strong> ${workout.reps}</p>
        <p><strong>Date:</strong> ${workout.workoutDate}</p>
      </div>

      <div class="workout-actions">
        <button
          type="button"
          class="edit-button"
          data-id="${workout.id}"
        >
          Edit
        </button>

        <button
          type="button"
          class="delete-button"
          data-id="${workout.id}"
        >
          Delete
        </button>
      </div>
    `;

        workoutList.appendChild(workoutItem);
    });
}

function deleteWorkout(id) {
    const workouts = getWorkouts();

    const updatedWorkouts = workouts.filter(
        (workout) => workout.id !== id
    );

    saveWorkouts(updatedWorkouts);
    displayWorkouts();
}

function editWorkout(id) {
    const workouts = getWorkouts();

    const workout = workouts.find(
        (item) => item.id === id
    );

    if (!workout) return;

    document.querySelector("#workoutName").value =
        workout.workoutName;

    document.querySelector("#exerciseName").value =
        workout.exerciseName;

    document.querySelector("#sets").value =
        workout.sets;

    document.querySelector("#reps").value =
        workout.reps;

    document.querySelector("#workoutDate").value =
        workout.workoutDate;

    editingWorkoutId = id;

    formMessage.textContent =
        "Edit the workout and submit to save changes.";

    workoutForm.scrollIntoView({
        behavior: "smooth",
    });
}

if (workoutForm) {
    workoutForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const workout = {
            id: editingWorkoutId || Date.now(),

            workoutName:
                document.querySelector("#workoutName").value,

            exerciseName:
                document.querySelector("#exerciseName").value,

            sets:
                Number(document.querySelector("#sets").value),

            reps:
                Number(document.querySelector("#reps").value),

            workoutDate:
                document.querySelector("#workoutDate").value,
        };

        const workouts = getWorkouts();

        if (editingWorkoutId) {
            const updatedWorkouts = workouts.map((item) =>
                item.id === editingWorkoutId ? workout : item
            );

            saveWorkouts(updatedWorkouts);

            formMessage.textContent =
                "Workout updated successfully!";

            editingWorkoutId = null;
        } else {
            workouts.push(workout);

            saveWorkouts(workouts);

            formMessage.textContent =
                "Workout saved successfully!";
        }

        workoutForm.reset();

        displayWorkouts();
    });
}


if (workoutList) {
    workoutList.addEventListener("click", (event) => {
        const id = Number(event.target.dataset.id);

        if (event.target.classList.contains("delete-button")) {
            deleteWorkout(id);
        }

        if (event.target.classList.contains("edit-button")) {
            editWorkout(id);
        }
    });

    displayWorkouts();
}

// =========================
// FAVORITE EXERCISES
// =========================

const favoriteButtons =
    document.querySelectorAll(".favorite-button");

const favoriteList =
    document.querySelector("#favoriteList");


function displayFavorites() {
    const favorites = getFavorites();

    if (!favoriteList) return;

    favoriteList.innerHTML = "";

    if (favorites.length === 0) {
        favoriteList.innerHTML =
            "<p>No favorite exercises yet.</p>";

        return;
    }

    favorites.forEach((exercise) => {
        const favoriteItem =
            document.createElement("article");

        favoriteItem.classList.add("favorite-item");

        favoriteItem.innerHTML = `
      <h3>${exercise}</h3>

      <button
        type="button"
        class="remove-favorite-button"
        data-name="${exercise}"
      >
        Remove
      </button>
    `;

        favoriteList.appendChild(favoriteItem);
    });
}

function addFavorite(exerciseName) {
    const favorites = getFavorites();

    if (!favorites.includes(exerciseName)) {
        favorites.push(exerciseName);

        saveFavorites(favorites);
    }

    displayFavorites();
}

function removeFavorite(exerciseName) {
    const favorites = getFavorites();

    const updatedFavorites = favorites.filter(
        (exercise) => exercise !== exerciseName
    );

    saveFavorites(updatedFavorites);

    displayFavorites();
}

favoriteButtons.forEach((button) => {
    button.addEventListener("click", () => {
        addFavorite(button.dataset.name);
    });
});

if (favoriteList) {
    favoriteList.addEventListener(
        "click",
        (event) => {
            if (
                event.target.classList.contains(
                    "remove-favorite-button"
                )
            ) {
                removeFavorite(
                    event.target.dataset.name
                );
            }
        }
    );

    displayFavorites();
}

// =========================
// OPEN FOOD FACTS API
// =========================

const barcodeInput =
    document.querySelector("#barcodeInput");

const searchFoodButton =
    document.querySelector("#searchFoodButton");

const foodResult =
    document.querySelector("#foodResult");

async function searchFoodByBarcode(barcode) {
    foodResult.innerHTML = "<p>Loading product...</p>";

    try {
        const url =
            `https://world.openfoodfacts.org/api/v2/product/${barcode}?fields=product_name,brands,image_front_url,nutrition_grades,nutriments`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Could not load product.");
        }

        const data = await response.json();

        if (data.status !== 1 || !data.product) {
            foodResult.innerHTML =
                "<p>Product not found.</p>";
            return;
        }

        displayFood(data.product);
    } catch (error) {
        console.error(error);

        foodResult.innerHTML =
            "<p>There was an error loading the product.</p>";
    }
}

function displayFood(product) {
    const calories =
        product.nutriments?.["energy-kcal_100g"] ?? "N/A";

    const protein =
        product.nutriments?.proteins_100g ?? "N/A";

    const carbohydrates =
        product.nutriments?.carbohydrates_100g ?? "N/A";

    const fat =
        product.nutriments?.fat_100g ?? "N/A";

    foodResult.innerHTML = `
    <article class="food-card">

      ${product.image_front_url
            ? `<img
              src="${product.image_front_url}"
              alt="${product.product_name || "Food product"}"
            >`
            : ""
        }

      <h3>
        ${product.product_name || "Unknown Product"}
      </h3>

      <p>
        <strong>Brand:</strong>
        ${product.brands || "Unknown"}
      </p>

      <p>
        <strong>Nutri-Score:</strong>
        ${product.nutrition_grades
            ? product.nutrition_grades.toUpperCase()
            : "N/A"
        }
      </p>

      <p>
        <strong>Calories:</strong>
        ${calories} kcal / 100g
      </p>

      <p>
        <strong>Protein:</strong>
        ${protein} g / 100g
      </p>

      <p>
        <strong>Carbohydrates:</strong>
        ${carbohydrates} g / 100g
      </p>

      <p>
        <strong>Fat:</strong>
        ${fat} g / 100g
      </p>

    </article>
  `;
}

if (searchFoodButton) {
    searchFoodButton.addEventListener(
        "click",
        () => {
            const barcode =
                barcodeInput.value.trim();

            if (!barcode) {
                foodResult.innerHTML =
                    "<p>Please enter a barcode.</p>";
                return;
            }

            searchFoodByBarcode(barcode);
        }
    );
}