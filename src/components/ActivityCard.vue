<template>
  <div
    class="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 transition-[transform,shadow] duration-300">
    <div class="relative">
      <div v-if="activity.activityPictures && isImageValid" class="aspect-video overflow-hidden">
        <img :src="activity.activityPictures" :alt="truncateDescription(activity.activityName, 10)"
          class="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          @error="handleImageError" />
      </div>
      <div v-else :class="['aspect-video flex items-center justify-center p-4', gradientClass]">
        <span class="text-2xl md:text-3xl text-white font-medium line-clamp-3 text-center">{{
          truncateDescription(activity.activityName, 15) }}</span>
      </div>
    </div>
    <div class="p-3 md:p-4 xl:p-5">
      <h3 class="text-lg md:text-xl xl:text-xl font-bold text-gray-800 mb-2 truncate">{{ activity.activityName }}</h3>
      <p class="text-xs md:text-sm xl:text-sm text-gray-600 mb-3 xl:mb-4 line-clamp-2">{{
        truncateDescription(activity.details, 50) }}</p>
      <div
        class="flex items-center mb-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        <div class="flex space-x-2 min-w-max">
          <dict-tag v-for="(tag, index) in visibleTags" :key="index" :options="tag.type" :value="tag.value" />
        </div>
      </div>
      <div
        class="grid grid-cols-[1fr_1fr] gap-y-3 md:gap-y-3 xl:gap-y-4 py-2 xl:py-3 border-t border-gray-100 items-center">
        <div class="flex items-center gap-x-2 min-w-0">
          <Icon icon="mdi:calendar" class="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span class="truncate">{{ activity.startTime }}</span>
        </div>
        <div class="flex items-center justify-end gap-x-2 min-w-0">
          <Icon icon="mdi:clock-outline" class="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span class="truncate">{{ activity.duration }} {{ $t('page.activity.activities.hours') }}</span>
        </div>
      </div>
      <div class="grid grid-cols-[1fr_1fr] gap-y-3 py-2 border-t border-gray-100 items-center">
        <div class="flex items-center gap-x-2 min-w-0">
          <Icon icon="mdi:map-marker" class="flex w-4 h-4 text-gray-400 flex-shrink-0" />
          <span class="truncate" :title="activity.address">{{ activity.address }}</span>
        </div>
        <div class="flex items-center justify-end gap-x-2 min-w-0">
          <Icon icon="mdi:account-group" class="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span class="truncate">
            {{ $t('page.activity.activities.recruitNumber') }}: {{ activity.recruitNumber }}
          </span>
        </div>
        <div class="flex items-center justify-start gap-x-2 min-w-0 px-3 py-1 rounded">
          <span style="padding: 2px 4px; border-radius: 4px; font-size: 12px;" :style="{
            backgroundColor:
              activity.publishStatus == 1 ? '#f4f4f5' :
                activity.publishStatus == 2 ? '#edf5fe' :
                  activity.publishStatus == 3 ? '#f1f9ec' :
                    activity.publishStatus == 4 ? '#f4f4f5' : '',
            color:
              activity.publishStatus == 1 ? '#909399' :
                activity.publishStatus == 2 ? '#409EFF' :
                  activity.publishStatus == 3 ? '#67C23A' :
                    activity.publishStatus == 4 ? '#909399' : ''
          }">
            {{ $t(`page.activity.activities.status.${activity.publishStatus}`) }}
          </span>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { defineComponent, computed, defineProps, watch, ref } from 'vue';
import { Icon } from '@iconify/vue';
import { getGradientColor } from '../utils/gradientColors';

const isImageValid = ref(true);

const handleImageError = () => {
  isImageValid.value = false;
};

const gradientClass = computed(() => {
  return getGradientColor(props.activity);
});

const visibleTags = computed(() => {
  const tags = [
    { type: 'serviceField', value: props.activity.serviceField },
    { type: 'serviceObject', value: props.activity.serviceObject },
    { type: 'serviceLocation', value: props.activity.serviceLocation }
  ];
  return tags.filter(tag => tag.value);
});

defineComponent(['Icon']);

const props = defineProps({
  activity: {
    type: Object,
    required: true,
  },
  serviceField: {
    type: Array,
    required: true,
    default: () => [],
  },
  serviceObject: {
    type: Array,
    required: true,
    default: () => [],
  },
  serviceLocation: {
    type: Array,
    required: true,
    default: () => [],
  },
});

const serviceFields = ref([]);
const serviceObjects = ref([]);
const serviceLocations = ref([]);

watch(() => props.serviceField, (newValue) => {
  serviceFields.value = newValue;
}, { deep: true, immediate: true });

watch(() => props.serviceObject, (newValue) => {
  serviceObjects.value = newValue;
}, { deep: true, immediate: true });

watch(() => props.serviceLocation, (newValue) => {
  serviceLocations.value = newValue;
}, { deep: true, immediate: true });

const baseURL = import.meta.env.VITE_APP_BASE_API;

const getStatusClass = (status) => {
  switch (status) {
    case 'open':
      return 'bg-green-500 text-white';
    case 'full':
      return 'bg-yellow-500 text-white';
    case 'closed':
      return 'bg-red-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
};

const truncateDescription = (details, maxLength = 100) => {
  return details && details.length > maxLength
    ? details.substring(0, maxLength) + '...'
    : details;
};

// export default defineComponent({
//   name: 'ActivityCard',
//   components: {
//     Icon,
//   },
//   props: {
//     activity: {
//       type: Object,
//       required: true,
//     },
//   },
//   setup(props) {
//     const { proxy } = getCurrentInstance();
//     const { serviceLocation,serviceField,serviceObject } = proxy.useDict('service_location', 'service_field', 'service_object');

//     const baseURL = import.meta.env.VITE_APP_BASE_API;
//     const gradientClass = computed(() => {
//       if (props.activity.gradientColor && gradients[props.activity.gradientColor]) {
//         return gradients[props.activity.gradientColor];
//       }
//       const colors = Object.values(gradients);
//       return colors[Math.floor(Math.random() * colors.length)];
//     });
//     const getStatusClass = (status) => {
//       switch (status) {
//       case 'open':
//         return 'bg-green-500 text-white';
//       case 'full':
//         return 'bg-yellow-500 text-white';
//       case 'closed':
//         return 'bg-red-500 text-white';
//       default:
//         return 'bg-gray-500 text-white';
//       }
//     };

//     const truncateDescription = (details, maxLength = 100) => {
//       return details && details.length > maxLength
//         ? details.substring(0, maxLength) + '...'
//         : details;
//     };

//     return { getStatusClass, truncateDescription, gradientClass,baseURL };
//   },
// });

</script>