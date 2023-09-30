import { createRouter, createWebHistory } from "vue-router/auto";

import { htmlMetaGuard } from "./guards";

const router = createRouter({
  history: createWebHistory()
});

router.afterEach(htmlMetaGuard);

export default router;
