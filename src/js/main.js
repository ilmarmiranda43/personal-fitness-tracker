// import './style.css'
// import heroImg from './assets/hero.png'
// import javascriptLogo from './assets/javascript.svg'
// import viteLogo from './assets/vite.svg'
// import { setupCounter } from './counter.js'

// document.querySelector('#app').innerHTML = `
// <section id="center">
//   <div class="hero">
//     <img src="${heroImg}" class="base" width="170" height="179">
//     <img src="${javascriptLogo}" class="framework" alt="JavaScript logo"/>
//     <img src="${viteLogo}" class="vite" alt="Vite logo" />
//   </div>
//   <div>
//     <h1>Get started</h1>
//     <p>Edit <code>src/main.js</code> and save to test <code>HMR</code></p>
//   </div>
//   <button id="counter" type="button" class="counter"></button>
// </section>

// <div class="ticks"></div>

// <section id="next-steps">
//   <div id="docs">
//     <svg class="icon" role="presentation" aria-hidden="true"><use href="/icons.svg#documentation-icon"></use></svg>
//     <h2>Documentation</h2>
//     <p>Your questions, answered</p>
//     <ul>
//       <li>
//         <a href="https://vite.dev/" target="_blank">
//           <img class="logo" src="${viteLogo}" alt="" />
//           Explore Vite
//         </a>
//       </li>
//       <li>
//         <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
//           <img class="button-icon" src="${javascriptLogo}" alt="">
//           Learn more
//         </a>
//       </li>
//     </ul>
//   </div>
//   <div id="social">
//     <svg class="icon" role="presentation" aria-hidden="true"><use href="/icons.svg#social-icon"></use></svg>
//     <h2>Connect with us</h2>
//     <p>Join the Vite community</p>
//     <ul>
//       <li><a href="https://github.com/vitejs/vite" target="_blank"><svg class="button-icon" role="presentation" aria-hidden="true"><use href="/icons.svg#github-icon"></use></svg>GitHub</a></li>
//       <li><a href="https://chat.vite.dev/" target="_blank"><svg class="button-icon" role="presentation" aria-hidden="true"><use href="/icons.svg#discord-icon"></use></svg>Discord</a></li>
//       <li><a href="https://x.com/vite_js" target="_blank"><svg class="button-icon" role="presentation" aria-hidden="true"><use href="/icons.svg#x-icon"></use></svg>X.com</a></li>
//       <li><a href="https://bsky.app/profile/vite.dev" target="_blank"><svg class="button-icon" role="presentation" aria-hidden="true"><use href="/icons.svg#bluesky-icon"></use></svg>Bluesky</a></li>
//     </ul>
//   </div>
// </section>

// <div class="ticks"></div>
// <section id="spacer"></section>
// `

// setupCounter(document.querySelector('#counter'))
console.log("Personal Fitness Tracker loaded");

const workoutForm = document.querySelector("#workoutForm");
const formMessage = document.querySelector("#formMessage");
const workoutList = document.querySelector("#workoutList");

let editingWorkoutId = null;

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