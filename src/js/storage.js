export function getWorkouts() {
    return JSON.parse(localStorage.getItem("workouts")) || [];
}

export function saveWorkouts(workouts) {
    localStorage.setItem(
        "workouts",
        JSON.stringify(workouts)
    );
}

export function getFavorites() {
    return (
        JSON.parse(
            localStorage.getItem("favoriteExercises")
        ) || []
    );
}

export function saveFavorites(favorites) {
    localStorage.setItem(
        "favoriteExercises",
        JSON.stringify(favorites)
    );
}