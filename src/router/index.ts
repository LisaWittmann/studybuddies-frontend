import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Login from "@/views/Login.vue";
import Lobby from "@/views/Lobby.vue";
import Game from "@/views/Game.vue";
import FindLobby from "@/views/FindLobbyView.vue";

// TODO: set routes properly after testing game
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Game",
    component: Game,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/lobby",
    name: "Lobby",
    component: Lobby,
  },
  {
    path: "/find",
    name: "FindLobby",
    component: FindLobby,
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
