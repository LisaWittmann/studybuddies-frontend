import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import GameView from "@/views/GameView.vue";
import LobbySettingsView from "@/views/LobbySettingsView.vue";
import FindLobbyView from "@/views/FindLobbyView.vue";

// TODO: set routes properly after testing game
const routes: Array<RouteRecordRaw> = [
  {
    path: "/game/:key",
    name: "GameView",
    component: GameView,
    props: true
  },
  {
    path: "/login",
    name: "LoginView",
    component: LoginView,
  },
  {
    path: "/register",
    name: "RegisterView",
    component: RegisterView,
  },
  {
    path: "/lobby/:key",
    name: "LobbySettingsView",
    component: LobbySettingsView,
    props: true,
  },
  {
    path: "/find",
    name: "FindLobby",
    component: FindLobbyView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
