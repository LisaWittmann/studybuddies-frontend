import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import GameView from "@/views/GameView.vue";
import LobbySettingsView from "@/views/LobbySettingsView.vue";
import LabyrinthUploadView from "@/views/LabyrinthUploadView.vue";
import FindLobbyView from "@/views/FindLobbyView.vue";
import { useLoginStore } from "@/service/login/LoginStore";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "HomeView",
    component: HomeView,
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
    path: "/find",
    name: "FindLobby",
    component: FindLobbyView,
  },
  {
    path: "/lobby/:key",
    name: "LobbySettingsView",
    component: LobbySettingsView,
    props: true,
  },
  {
    path: "/game/:key",
    name: "GameView",
    component: GameView,
    props: true,
  },
  {
    path: "/upload",
    name: "LabyrinthUploadView",
    component: LabyrinthUploadView,
  },
];

const noAuthentication = [
  "HomeView",
  "RegisterView",
  "LoginView",
  "LabyrinthUploadView",
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const { loginState } = useLoginStore();
  if (!loginState.isLoggedIn && !noAuthentication.includes(to.name as string)) {
    next({ name: "LoginView" });
  } else next();
});

export default router;
