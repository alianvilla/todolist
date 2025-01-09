import { atom } from "jotai";

// helper function to sincronize localStoreage with state
const getTaskFromLocalStorage = () => {
  const storedTasks = localStorage.getItem("tasks");
  return storedTasks ? JSON.parse(storedTasks) : [];
};

const setTaskInLocalStorage = (tasks) => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

// atoms
export const tasksAtom = atom(getTaskFromLocalStorage());

export const tasksWithStorageAtom = atom(
  (get) => get(tasksAtom),
  (get, set, newTasks) => {
    set(tasksAtom, newTasks);
    setTaskInLocalStorage(newTasks);
  }
);
