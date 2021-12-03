import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import LoginView from "@/views/LoginView.vue";
import LobbyView from "@/views/LobbyView.vue";
import GameView from "@/views/GameView.vue";
import LobbySettingsView from "@/views/LobbySettingsView.vue";

// TODO: set routes properly after testing game
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "GameView",
    component: GameView,
  },
  {
    path: "/login",
    name: "LoginView",
    component: LoginView,
  },
  {
    path: "/lobby",
    name: "LobbyView",
    component: LobbyView,
  },
  {
    path: "/lobby/code",
    name: "LobbySettingsView",
    component: LobbySettingsView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
