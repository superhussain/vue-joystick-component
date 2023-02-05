import { N as createRouter, _ as __vitePreload, O as createWebHistory, P as createWebHashHistory, i as defineStore, r as ref, c as computed } from "./vendor.aefccb01.js";
import { h as histoireConfig } from "./GenericMountStory.vue2.cb371f51.js";
const base = "./";
function createRouterHistory() {
  switch (histoireConfig.routerMode) {
    case "hash":
      return createWebHashHistory(base);
    case "history":
    default:
      return createWebHistory(base);
  }
}
const router = createRouter({
  history: createRouterHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => __vitePreload(() => import("./HomeView.vue.80fc8266.js"), true ? ["./HomeView.vue.80fc8266.js","./GenericMountStory.vue2.cb371f51.js","./vendor.aefccb01.js"] : void 0, import.meta.url)
    },
    {
      path: "/story/:storyId",
      name: "story",
      component: () => __vitePreload(() => import("./StoryView.vue.512b0f8a.js"), true ? ["./StoryView.vue.512b0f8a.js","./vendor.aefccb01.js","./MobileOverlay.vue2.f5c05dcb.js","./BaseEmpty.vue.b8f0f2b5.js","./state.7d17e4a1.js","./GenericMountStory.vue2.cb371f51.js","./events.a053b093.js"] : void 0, import.meta.url)
    }
  ]
});
const useStoryStore = defineStore("story", () => {
  const stories = ref([]);
  function setStories(value) {
    stories.value = value;
  }
  const currentStory = computed(() => stories.value.find((s) => s.id === router.currentRoute.value.params.storyId));
  const currentVariant = computed(() => {
    var _a;
    return (_a = currentStory.value) == null ? void 0 : _a.variants.find((v) => v.id === router.currentRoute.value.query.variantId);
  });
  const maps = computed(() => {
    const storyMap = /* @__PURE__ */ new Map();
    const variantMap = /* @__PURE__ */ new Map();
    for (const story of stories.value) {
      storyMap.set(story.id, story);
      for (const variant of story.variants) {
        variantMap.set(`${story.id}:${variant.id}`, variant);
      }
    }
    return {
      stories: storyMap,
      variants: variantMap
    };
  });
  function getStoryById(id) {
    return maps.value.stories.get(id);
  }
  function getVariantById(idWithStoryId) {
    return maps.value.variants.get(idWithStoryId);
  }
  return {
    stories,
    setStories,
    currentStory,
    currentVariant,
    getStoryById,
    getVariantById
  };
});
export {
  base as b,
  router as r,
  useStoryStore as u
};
