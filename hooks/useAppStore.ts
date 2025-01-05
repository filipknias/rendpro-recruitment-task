"use client";

import { Pocket, Task, User } from '@/types/models';
import { create } from 'zustand';

type UserStore = Omit<User, "password">;
type TaskPopupView = "task"|"pocket";

type Store = {
    user: UserStore|null;
    pockets: Pocket[];
    tasks: Task[];
    taskPopup: {
        open: boolean;
        view: TaskPopupView;
    };
    setCurrentUser: (user: User) => void;
    logoutUser: () => void;
    setInitialData: (initialData: { user: User, pockets: Pocket[] }) => void;
    addPocket: (pocket: Pocket) => void;
    addTask: (task: Task) => void;
    setPocketTasks: (tasks: Task[]) => void;
    addTaskToActivePocket: (task: Task) => void;
    updateTaskCompletedState: (taskId: string, completed: boolean) => void;
    deleteTaskFromState: (taskId: string) => void;
    deletePocketFromState: (pocketId: string) => void;
    openTaskPopup: (view?: TaskPopupView) => void;
    closeTaskPopup: (view?: TaskPopupView) => void;
    toggleTaskPopup: (view?: TaskPopupView) => void;
    switchTaskPopupView: (view: TaskPopupView) => void;
}

export const useAppStore = create<Store>((set) => ({
    user: null,
    pockets: [],
    tasks: [],
    taskPopup: {
        open: false,
        view: "task",
    },
    
    setCurrentUser: (user: User) => {
        const storeUser = {
            _id: user._id,
            login: user.login,
            firstName: user.firstName,
            lastName: user.lastName,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            avatar: user.avatar,
        }
        set({ user: storeUser });
    },
    
    logoutUser: () => {
        set({ user: null });
    },

    setInitialData: (initialData: { user: User, pockets: Pocket[] }) => {
        set({ user: initialData.user });
        set({ pockets: initialData.pockets });
    },

    addPocket: (pocket: Pocket) => {
        set((state) => ({ pockets: [...state.pockets, pocket] }));
    },

    addTask: (task: Task) => {
        set((state) => {
            const newPockets = state.pockets.map((pocket) => {
                if (pocket._id === task.pocket) {
                    return { ...pocket, tasks: [...pocket.tasks, task._id] }
                }
                return pocket;
            });
            return { pockets: newPockets };
        });
    },

    setPocketTasks: (tasks: Task[]) => {
        set({ tasks });
    },

    addTaskToActivePocket: (task: Task) => {
        set((state) => ({ tasks: [...state.tasks, task] }))
    },

    updateTaskCompletedState: (taskId: string, completed: boolean) => {
        set((state) => {
            const newTasks = state.tasks.map((task) => {
                if (task._id === taskId) {
                    return { ...task, isCompleted: completed }
                }
                return task;
            });
            return { tasks: newTasks };
        });
    },

    deleteTaskFromState: (taskId: string) => {
        set((state) => {
            const newTasks = state.tasks.filter((task) => task._id !== taskId);
            const updatedPockets = state.pockets.map((pocket) => {
                if (pocket.tasks.includes(taskId)) {
                    return { ...pocket, tasks: pocket.tasks.filter((pocketTask) => pocketTask !== taskId) };
                }
                return pocket;
            });

            return { tasks: newTasks, pockets: updatedPockets };
        });
    },

    deletePocketFromState: (pocketId: string) => {
        set((state) => {
            const newPockets = state.pockets.filter((pocket) => pocket._id !== pocketId);
            return { pockets: newPockets };
        });
    },

    openTaskPopup: (view?: TaskPopupView) => {
        set((state) => ({
            taskPopup: {
                open: true,
                view: view ?? state.taskPopup.view,
            }
        }));
    },

    closeTaskPopup: (view?: TaskPopupView) => {
        set((state) => ({
            taskPopup: {
                open: false,
                view: view ?? state.taskPopup.view,
            }
        }));
    },

    toggleTaskPopup: (view?: TaskPopupView) => {
        set((state) => ({
            taskPopup: {
                open: !state.taskPopup.open,
                view: view ?? state.taskPopup.view,
            }
        }));
    },

    switchTaskPopupView: (view: TaskPopupView) => {
        set((state) => ({
            taskPopup: {
                ...state.taskPopup,
                view,
            }
        }));
    },
}));