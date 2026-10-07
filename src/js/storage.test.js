import {
    beforeEach,
    describe,
    expect,
    it,
} from "vitest";

import {
    getWorkouts,
    saveWorkouts,
    getFavorites,
    saveFavorites,
} from "./storage.js";

beforeEach(() => {
    localStorage.clear();
});

describe("Workout localStorage", () => {
    it("returns an empty array when no workouts exist", () => {
        expect(getWorkouts()).toEqual([]);
    });

    it("saves and retrieves workouts", () => {
        const workouts = [
            {
                id: 1,
                workoutName: "Upper Body",
                exerciseName: "Push-ups",
                sets: 3,
                reps: 12,
                workoutDate: "2026-10-07",
            },
        ];

        saveWorkouts(workouts);

        expect(getWorkouts()).toEqual(workouts);
    });
});

describe("Favorite exercise localStorage", () => {
    it("returns an empty array when no favorites exist", () => {
        expect(getFavorites()).toEqual([]);
    });

    it("saves and retrieves favorite exercises", () => {
        const favorites = [
            "Push-ups",
            "Squats",
        ];

        saveFavorites(favorites);

        expect(getFavorites()).toEqual(favorites);
    });
});