import { Q as defineAsyncComponent, _ as __vitePreload, R as useDark, S as useToggle, k as watch, U as markRaw, E as reactive, d as defineComponent, r as ref, V as watchEffect, o as openBlock, q as createBlock, W as mergeProps, X as resolveDynamicComponent, h as createCommentVNode } from "./vendor.95d36a40.js";
const Comp0 = defineAsyncComponent(() => __vitePreload(() => import("./Joystick.story.2ff063dd.js"), true ? ["./Joystick.story.2ff063dd.js","./vendor.95d36a40.js"] : void 0, import.meta.url));
let files = [{ "id": "stories-joystick-story-vue", "path": ["Joystick"], "filePath": "stories/Joystick.story.vue", "story": { "id": "stories-joystick-story-vue", "title": "Joystick", "group": null, "layout": { "type": "single", "iframe": true }, "icon": null, "iconColor": null, "docsOnly": false, "variants": [{ "id": "_default", "title": "default" }] }, "supportPluginId": "vue3", "index": 0, component: Comp0, source: () => __vitePreload(() => import("./__resolved__virtual_story-source_stories-joystick-story-vue.f25150a2.js"), true ? [] : void 0, import.meta.url) }];
let tree = [{ "title": "Joystick", "index": 0 }];
const config = { "plugins": [{ "name": "builtin:tailwind-tokens" }, { "name": "builtin:vanilla-support", "supportPlugin": { "id": "vanilla", "moduleName": "/home/runner/work/vue-joystick-component/vue-joystick-component/node_modules/.pnpm/histoire@0.12.4_vite@3.2.5/node_modules/histoire/dist/node/builtin-plugins/vanilla-support", "setupFn": "setupVanilla" } }, { "name": "@histoire/plugin-vue", "supportPlugin": { "id": "vue3", "moduleName": "@histoire/plugin-vue", "setupFn": "setupVue3", "importStoriesPrepend": "import { defineAsyncComponent as defineAsyncComponentVue3 } from 'vue'" } }], "outDir": "/home/runner/work/vue-joystick-component/vue-joystick-component/.histoire/dist", "storyMatch": ["**/*.story.vue", "**/*.story.svelte"], "storyIgnored": ["**/node_modules/**", "**/dist/**"], "supportMatch": [{ "id": "vanilla", "patterns": ["**/*.js"], "pluginIds": ["vanilla"] }, { "id": "vue", "patterns": ["**/*.vue"], "pluginIds": ["vue3"] }], "tree": { "file": "title", "order": "asc" }, "theme": { "title": "Histoire", "colors": { "primary": { "50": "#ecfdf5", "100": "#d1fae5", "200": "#a7f3d0", "300": "#6ee7b7", "400": "#34d399", "500": "#10b981", "600": "#059669", "700": "#047857", "800": "#065f46", "900": "#064e3b" }, "gray": { "50": "#fafafa", "100": "#f4f4f5", "200": "#e4e4e7", "300": "#d4d4d8", "400": "#a1a1aa", "500": "#71717a", "600": "#52525b", "700": "#3f3f46", "750": "#323238", "800": "#27272a", "850": "#1f1f21", "900": "#18181b", "950": "#101012" } } }, "responsivePresets": [{ "label": "Mobile (Small)", "width": 320, "height": 560 }, { "label": "Mobile (Medium)", "width": 360, "height": 640 }, { "label": "Mobile (Large)", "width": 414, "height": 896 }, { "label": "Tablet", "width": 768, "height": 1024 }, { "label": "Laptop (Small)", "width": 1024, "height": null }, { "label": "Laptop (Large)", "width": 1366, "height": null }, { "label": "Desktop", "width": 1920, "height": null }, { "label": "4K", "width": 3840, "height": null }], "backgroundPresets": [{ "label": "Transparent", "color": "transparent", "contrastColor": "#333" }, { "label": "White", "color": "#fff", "contrastColor": "#333" }, { "label": "Light gray", "color": "#aaa", "contrastColor": "#000" }, { "label": "Dark gray", "color": "#333", "contrastColor": "#fff" }, { "label": "Black", "color": "#000", "contrastColor": "#eee" }], "sandboxDarkClass": "dark", "routerMode": "hash", "vite": { "base": "" }, "viteIgnorePlugins": [], "setupFile": "histoire.setup.ts" };
const logos = {};
const histoireConfig = config;
const customLogos = logos;
const isDark = useDark({ valueDark: "htw-dark" });
const toggleDark = useToggle(isDark);
function applyDarkToControls() {
  var _a;
  (_a = window.__hst_controls_dark) == null ? void 0 : _a.forEach((ref2) => {
    ref2.value = isDark.value;
  });
}
watch(isDark, () => {
  applyDarkToControls();
}, {
  immediate: true
});
window.__hst_controls_dark_ready = () => {
  applyDarkToControls();
};
const copiedFromExistingVariant = [
  "state",
  "slots",
  "source",
  "responsiveDisabled",
  "autoPropsDisabled",
  "setupApp",
  "configReady",
  "previewReady"
];
function mapFile(file, existingFile) {
  let result;
  if (existingFile) {
    result = existingFile;
    for (const key in file) {
      if (key === "story") {
        Object.assign(result.story, {
          ...file.story,
          file: markRaw(result),
          variants: file.story.variants.map((v) => mapVariant(v, existingFile.story.variants.find((item) => item.id === v.id)))
        });
      } else if (key !== "component") {
        result[key] = file[key];
      }
    }
  } else {
    result = {
      ...file,
      component: markRaw(file.component),
      story: {
        ...file.story,
        title: file.story.title,
        file: markRaw(file),
        variants: file.story.variants.map((v) => mapVariant(v)),
        slots: () => ({})
      }
    };
  }
  return result;
}
function mapVariant(variant, existingVariant) {
  let result;
  if (existingVariant) {
    result = existingVariant;
    for (const key in variant) {
      if (!copiedFromExistingVariant.includes(key)) {
        result[key] = variant[key];
      }
    }
  } else {
    result = {
      ...variant,
      state: reactive({
        _hPropState: {},
        _hPropDefs: {}
      }),
      setupApp: null,
      slots: () => ({}),
      previewReady: false
    };
  }
  return result;
}
const clientSupportPlugins = {
  "vanilla": () => __vitePreload(() => import("./vendor.95d36a40.js").then((n) => n.aO), true ? [] : void 0, import.meta.url),
  "vue3": () => __vitePreload(() => import("./vendor.95d36a40.js").then((n) => n.aP), true ? [] : void 0, import.meta.url)
};
const __default__ = {
  inheritAttrs: false
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...__default__,
  __name: "GenericMountStory",
  props: {
    story: null
  },
  setup(__props) {
    const props = __props;
    const mountComponent = ref(null);
    watchEffect(async () => {
      var _a;
      const clientPlugin = clientSupportPlugins[(_a = props.story.file) == null ? void 0 : _a.supportPluginId];
      if (clientPlugin) {
        const pluginModule = await clientPlugin();
        mountComponent.value = markRaw(pluginModule.MountStory);
      }
    });
    return (_ctx, _cache) => {
      return mountComponent.value ? (openBlock(), createBlock(resolveDynamicComponent(mountComponent.value), mergeProps({
        key: 0,
        class: "histoire-generic-mount-story",
        story: __props.story
      }, _ctx.$attrs), null, 16, ["story"])) : createCommentVNode("", true);
    };
  }
});
export {
  _sfc_main as _,
  tree as a,
  clientSupportPlugins as b,
  customLogos as c,
  files as f,
  histoireConfig as h,
  isDark as i,
  mapFile as m,
  toggleDark as t
};
