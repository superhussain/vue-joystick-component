import { av as defineComponent, aw as reactive, ax as ref, ay as computed, az as watch, aA as onBeforeUnmount, aB as openBlock, aC as createElementBlock, aD as createBaseVNode, aE as normalizeClass, aF as normalizeStyle, aG as resolveComponent, aH as createBlock, aI as withCtx, aJ as logEvent, aK as createVNode } from "./vendor.aee38922.js";
var JoystickComponent;
((JoystickComponent2) => {
  ((Shape2) => {
    Shape2["Circle"] = "circle";
    Shape2["Square"] = "square";
  })(JoystickComponent2.Shape || (JoystickComponent2.Shape = {}));
  ((InteractionEvents2) => {
    InteractionEvents2["PointerDown"] = "pointerdown";
    InteractionEvents2["PointerMove"] = "pointermove";
    InteractionEvents2["PointerUp"] = "pointerup";
    InteractionEvents2["FollowStop"] = "FOLLOW_STOP";
  })(JoystickComponent2.InteractionEvents || (JoystickComponent2.InteractionEvents = {}));
  ((RadianQuadrantBinding2) => {
    RadianQuadrantBinding2[RadianQuadrantBinding2["TopRight"] = 2.35619449] = "TopRight";
    RadianQuadrantBinding2[RadianQuadrantBinding2["TopLeft"] = -2.35619449] = "TopLeft";
    RadianQuadrantBinding2[RadianQuadrantBinding2["BottomRight"] = 0.785398163] = "BottomRight";
    RadianQuadrantBinding2[RadianQuadrantBinding2["BottomLeft"] = -0.785398163] = "BottomLeft";
  })(JoystickComponent2.RadianQuadrantBinding || (JoystickComponent2.RadianQuadrantBinding = {}));
})(JoystickComponent || (JoystickComponent = {}));
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$1 = defineComponent({
  __name: "Joystick",
  props: {
    size: { type: Number, required: false, default: 100 },
    stickSize: { type: Number, required: false, default: void 0 },
    baseColor: { type: String, required: false, default: "rgb(0 0 0 / 50%)" },
    stickColor: { type: String, required: false, default: "mediumpurple" },
    throttle: { type: Number, required: false, default: 100 },
    disabled: { type: Boolean, required: false, default: false },
    sticky: { type: Boolean, required: false, default: false },
    baseImage: { type: String, required: false, default: void 0 },
    stickImage: { type: String, required: false, default: void 0 },
    followCursor: { type: Boolean, required: false, default: false },
    baseShape: { type: null, required: false, default: JoystickComponent.Shape.Circle },
    stickShape: { type: null, required: false, default: JoystickComponent.Shape.Circle },
    controlPlaneShape: { type: null, required: false, default: JoystickComponent.Shape.Circle },
    minDistance: { type: Number, required: false, default: 0 }
  },
  emits: ["move", "start", "stop"],
  setup(__props, { expose, emit }) {
    expose();
    const props = __props;
    const state = reactive({ dragging: false });
    const baseRef = ref();
    const stickRef = ref();
    const _parentRect = ref();
    const _pointerId = ref();
    const _stickSize = computed(() => props.stickSize || props.size / 1.5);
    const _radius = computed(() => props.size / 2);
    const shapeFactory = (shape, size) => {
      return { borderRadius: `${shape === JoystickComponent.Shape.Square ? Math.sqrt(size) : size}px` };
    };
    const shapeBoundsFactory = (shape, absoluteX, absoluteY, relativeX, relativeY, dist, radius, baseSize, parentRect) => {
      if (shape === JoystickComponent.Shape.Square) {
        relativeX = getWithinBounds(absoluteX - parentRect.left - baseSize / 2, baseSize);
        relativeY = getWithinBounds(absoluteY - parentRect.top - baseSize / 2, baseSize);
        return { relativeX, relativeY };
      }
      if (dist > radius) {
        relativeX *= radius / dist;
        relativeY *= radius / dist;
      }
      return { relativeX, relativeY };
    };
    const getWithinBounds = (value, baseSize) => {
      const halfBaseSize = baseSize / 2;
      if (value > halfBaseSize)
        return halfBaseSize;
      if (value < -halfBaseSize)
        return halfBaseSize * -1;
      return value;
    };
    const _throttleMoveCallback = (() => {
      let lastCall = 0;
      return (event) => {
        const now = Date.now();
        const throttleAmount = props.throttle;
        if (now - lastCall < throttleAmount)
          return;
        lastCall = now;
        return emit("move", event);
      };
    })();
    const getBaseShapeStyle = () => shapeFactory(props.baseShape, props.size);
    const getStickShapeStyle = () => shapeFactory(props.stickShape, props.size);
    const baseStyle = computed(() => {
      const baseColor = props.baseColor;
      const baseSizeString = `${props.size}px`;
      const padStyle = {
        ...getBaseShapeStyle(),
        height: baseSizeString,
        width: baseSizeString,
        background: baseColor,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      };
      if (props.baseImage) {
        padStyle.background = `url(${props.baseImage})`;
        padStyle.backgroundSize = "100%";
      }
      return padStyle;
    });
    const stickStyle = computed(() => {
      const stickColor = props.stickColor;
      const stickSize = `${_stickSize.value}px`;
      let stickStyle2 = {
        ...getStickShapeStyle(),
        background: stickColor,
        cursor: "move",
        height: stickSize,
        width: stickSize,
        border: "none",
        flexShrink: 0,
        touchAction: "none"
      };
      if (props.stickImage) {
        stickStyle2.background = `url(${props.stickImage})`;
        stickStyle2.backgroundSize = "100%";
      }
      if (state.coordinates !== void 0) {
        stickStyle2 = {
          ...stickStyle2,
          position: "absolute",
          transform: `translate3d(${state.coordinates.relativeX}px, ${state.coordinates.relativeY}px, 0)`
        };
      }
      return stickStyle2;
    });
    const _updatePos = (coordinates) => {
      window.requestAnimationFrame(() => state.coordinates = coordinates);
      if (typeof props.minDistance === "number" && coordinates.distance < props.minDistance)
        return;
      _throttleMoveCallback({
        type: "move",
        x: coordinates.relativeX * 2 / props.size,
        y: -(coordinates.relativeY * 2 / props.size),
        direction: coordinates.direction,
        distance: coordinates.distance
      });
    };
    const _pointerDown = (e) => {
      if (props.disabled || props.followCursor || !baseRef.value || !stickRef.value)
        return;
      _parentRect.value = baseRef.value.getBoundingClientRect();
      state.dragging = true;
      window.addEventListener(
        JoystickComponent.InteractionEvents.PointerUp,
        (event) => _pointerUp(event)
      );
      window.addEventListener(
        JoystickComponent.InteractionEvents.PointerMove,
        (event) => _pointerMove(event)
      );
      _pointerId.value = e.pointerId;
      if (typeof stickRef.value.setPointerCapture === "function") {
        stickRef.value.setPointerCapture(e.pointerId);
      }
      emit("start", { type: "start" });
    };
    const _getDirection = (atan2) => {
      if (atan2 > JoystickComponent.RadianQuadrantBinding.TopRight || atan2 < JoystickComponent.RadianQuadrantBinding.TopLeft) {
        return "FORWARD";
      }
      if (atan2 < JoystickComponent.RadianQuadrantBinding.TopRight && atan2 > JoystickComponent.RadianQuadrantBinding.BottomRight) {
        return "RIGHT";
      }
      if (atan2 < JoystickComponent.RadianQuadrantBinding.BottomLeft) {
        return "LEFT";
      }
      return "BACKWARD";
    };
    const _distance = (x, y) => {
      return Math.hypot(x, y);
    };
    const _distanceToPercentile = (distance) => {
      const percentageBaseSize = distance / (props.size / 2) * 100;
      if (percentageBaseSize > 100)
        return 100;
      return percentageBaseSize;
    };
    const _pointerMove = (event) => {
      event.preventDefault();
      if (state.dragging) {
        if (!_parentRect.value)
          return;
        if (!props.followCursor && event.pointerId !== _pointerId.value)
          return;
        const absoluteX = event.clientX;
        const absoluteY = event.clientY;
        let relativeX = absoluteX - _parentRect.value.left - _radius.value;
        let relativeY = absoluteY - _parentRect.value.top - _radius.value;
        const dist = _distance(relativeX, relativeY);
        const bounded = shapeBoundsFactory(
          props.controlPlaneShape || props.baseShape,
          absoluteX,
          absoluteY,
          relativeX,
          relativeY,
          dist,
          _radius.value,
          props.size,
          _parentRect.value
        );
        relativeX = bounded.relativeX;
        relativeY = bounded.relativeY;
        const atan2 = Math.atan2(relativeX, relativeY);
        _updatePos({
          relativeX,
          relativeY,
          distance: _distanceToPercentile(dist),
          direction: _getDirection(atan2),
          axisX: absoluteX - _parentRect.value.left,
          axisY: absoluteY - _parentRect.value.top
        });
      }
    };
    const _pointerUp = (event) => {
      if (event.pointerId !== _pointerId.value && event.type !== JoystickComponent.InteractionEvents.FollowStop) {
        return;
      }
      window.requestAnimationFrame(() => {
        state.dragging = false;
        if (!props.sticky)
          state.coordinates = void 0;
      });
      window.removeEventListener(JoystickComponent.InteractionEvents.PointerUp, _pointerUp);
      window.removeEventListener(JoystickComponent.InteractionEvents.PointerMove, _pointerMove);
      _pointerId.value = void 0;
      let evt = { type: "stop" };
      if (props.sticky && state.coordinates) {
        evt = {
          ...evt,
          x: state.coordinates.relativeX * 2 / props.size,
          y: state.coordinates.relativeY * 2 / props.size,
          direction: state.coordinates.direction,
          distance: state.coordinates.distance
        };
      }
      emit("stop", evt);
    };
    const _followStart = () => {
      if (baseRef.value)
        _parentRect.value = baseRef.value.getBoundingClientRect();
      state.dragging = true;
      window.addEventListener(JoystickComponent.InteractionEvents.PointerMove, _pointerMove);
      emit("start", { type: "start" });
    };
    const _followStop = () => {
      window.removeEventListener(JoystickComponent.InteractionEvents.PointerMove, _pointerMove);
      _pointerUp(new PointerEvent(JoystickComponent.InteractionEvents.FollowStop));
    };
    watch(
      () => props.followCursor,
      () => props.followCursor ? _followStart() : _followStop(),
      { immediate: true }
    );
    onBeforeUnmount(() => _followStop());
    const __returned__ = { props, emit, state, baseRef, stickRef, _parentRect, _pointerId, _stickSize, _radius, shapeFactory, shapeBoundsFactory, getWithinBounds, _throttleMoveCallback, getBaseShapeStyle, getStickShapeStyle, baseStyle, stickStyle, _updatePos, _pointerDown, _getDirection, _distance, _distanceToPercentile, _pointerMove, _pointerUp, _followStart, _followStop };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = ["disabled"];
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    ref: "baseRef",
    class: normalizeClass(["joystick", { "joystick--disabled": $setup.props.disabled }]),
    style: normalizeStyle($setup.baseStyle)
  }, [
    createBaseVNode("button", {
      ref: "stickRef",
      disabled: $setup.props.disabled,
      class: normalizeClass(["joystick__stick", { "joystick__stick--disabled": $setup.props.disabled }]),
      style: normalizeStyle($setup.stickStyle),
      onPointerdown: $setup._pointerDown
    }, null, 46, _hoisted_1)
  ], 6);
}
_sfc_main$1.__file = "src/Joystick.vue";
const Joystick = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1], ["__file", "/home/runner/work/vue-joystick-component/vue-joystick-component/src/Joystick.vue"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Joystick.story",
  setup(__props, { expose }) {
    expose();
    const __returned__ = { get logEvent() {
      return logEvent;
    }, get Joystick() {
      return Joystick;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Story = resolveComponent("Story");
  return openBlock(), createBlock(_component_Story, null, {
    default: withCtx(() => [
      createVNode($setup["Joystick"], {
        style: { "margin": "50px" },
        onMove: _cache[0] || (_cache[0] = ($event) => $setup.logEvent("move", $event)),
        onStart: _cache[1] || (_cache[1] = ($event) => $setup.logEvent("start", $event)),
        onStop: _cache[2] || (_cache[2] = ($event) => $setup.logEvent("stop", $event))
      })
    ]),
    _: 1
  });
}
_sfc_main.__file = "stories/Joystick.story.vue";
const Joystick_story = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/vue-joystick-component/vue-joystick-component/stories/Joystick.story.vue"]]);
export {
  Joystick_story as default
};
