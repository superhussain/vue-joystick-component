import { N as createRouter, _ as __vitePreload, O as createWebHistory, P as createWebHashHistory, i as defineStore, r as ref, c as computed } from "./vendor.95d36a40.js";
import { h as histoireConfig } from "./GenericMountStory.vue2.f47deb74.js";
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
      component: () => __vitePreload(() => import("./HomeView.vue.72c73e0b.js"), true ? ["./HomeView.vue.72c73e0b.js","./GenericMountStory.vue2.f47deb74.js","./vendor.95d36a40.js"] : void 0, import.meta.url)
    },
    {
      path: "/story/:storyId",
      name: "story",
      component: () => __vitePreload(() => import("./StoryView.vue.8eba5574.js"), true ? ["./StoryView.vue.8eba5574.js","./vendor.95d36a40.js","./MobileOverlay.vue2.ea2742ed.js","./BaseEmpty.vue.d089c6c7.js","./state.79b01160.js","./GenericMountStory.vue2.f47deb74.js","./events.621625dc.js"] : void 0, import.meta.url)
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
