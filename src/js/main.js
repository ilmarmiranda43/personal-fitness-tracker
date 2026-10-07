console.log("Personal Fitness Tracker loaded");

const workoutForm = document.querySelector("#workoutForm");
const formMessage = document.querySelector("#formMessage");
const workoutList = document.querySelector("#workoutList");

let editingWorkoutId = null;

// =========================
// WORKOUTS
// =========================

function getWorkouts() {
    return JSON.parse(localStorage.getItem("workouts")) || [];
}

function saveWorkouts(workouts) {
    localStorage.setItem("workouts", JSON.stringify(workouts));
}

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

// =========================
// FAVORITE EXERCISES
// =========================

const favoriteButtons =
    document.querySelectorAll(".favorite-button");

const favoriteList =
    document.querySelector("#favoriteList");

function getFavorites() {
    return (
        JSON.parse(
            localStorage.getItem("favoriteExercises")
        ) || []
    );
}

function saveFavorites(favorites) {
    localStorage.setItem(
        "favoriteExercises",
        JSON.stringify(favorites)
    );
}

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