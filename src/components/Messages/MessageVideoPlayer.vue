<template>
  <Teleport to="body">
    <div class="flex flex-col items-center justify-center fixed inset-0 z-50 w-screen h-screen bg-black">
      <video ref="videoRef" class="w-full h-full" :src="videoUrl.merged" @ended="onVideoEnd" />
      <!-- Absolute at center -->
      <div v-if="!videoLoaded" class="absolute w-full h-full flex items-center justify-center">
        <div class="w-16 h-16 rounded-full animate-spin">
          <i-mdi-loading class="w-full h-full text-white" />
        </div>
      </div>
      <!-- Controls when ended -->
      <div v-if="videoEnd" class="absolute w-full h-full flex items-center justify-center">
        <div class="flex flex-row gap-4">
          <div class="w-16 h-16">
            <i-mdi-replay
              class="w-full h-full text-white hover:opacity-75 transition"
              @click="onReplayVideo"
            />
          </div>
          <div class="w-16 h-16">
            <i-mdi-close class="w-full h-full text-white hover:opacity-75 transition" @click="onVideoClose" />
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
// import JASSUB from "jassub";
// import workerUrl from "jassub/dist/jassub-worker.js?url";
// import wasmUrl from "jassub/dist/jassub-worker.wasm?url";

import type { MessageContentVideo } from "@/models/messages";
import { getVideoAndAudioUrl } from "@/utils";

const props = defineProps<{
  message: MessageContentVideo;
}>();

const emits = defineEmits<{
  (e: "close", message: MessageContentVideo): void;
}>();

const videoLoaded = ref(false);
const videoEnd = ref(false);
const videoRef = ref<HTMLVideoElement>();
// const renderer = ref<JASSUB>();

const videoUrl = computed(() => {
  // we have two audio and video url
  // audio is opus and wav
  // video is vp9 (ivf)
  return getVideoAndAudioUrl(props.message);
});

function onVideoEnd() {
  videoEnd.value = true;
}

function onReplayVideo() {
  if (videoRef.value) {
    videoEnd.value = false;
    videoRef.value.currentTime = 0;
    videoRef.value.play();
  }
}

function onVideoClose() {
  // if (renderer.value) {
  //   renderer.value.destroy();
  // }

  emits("close", props.message);
}

onMounted(() => {
  // sync audio and video
  const video = videoRef.value;

  if (video) {
    // renderer.value = new JASSUB({
    //   video,
    //   subUrl: `/assets/subs/${props.message.video.video_id}.ass`,
    //   workerUrl,
    //   wasmUrl,
    //   availableFonts: {
    //     "sdk_sc_web strp": "/assets/subs/SDK_SC_Web Strp.ttf"
    //   },
    //   debug: import.meta.env.DEV,
    //   prescaleFactor: 0.8,
    //   onDemandRender: false
    // });

    video.load();

    video.addEventListener("loadeddata", () => {
      videoLoaded.value = true;
      video.play();
    });
  }
});
</script>
