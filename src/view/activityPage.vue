<template>
  <Layout :breadcrumbItems="breadcrumbItems" :currentPage="currentPage">
    <div class="w-full max-w-5xl mx-auto mb-6" v-loading="loading" :element-loading-svg="svg">
      <h1 class="text-3xl font-bold text-gray-900 mb-4">{{ $t('page.activity.title') }}</h1>
      <div class="rainbow-border mb-6"></div>

      <template v-if="activities.length > 0">
        <div ref="container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <ActivityCard v-for="(activity, index) in activities" :key="index" :activity="activity"
            :serviceField="serviceField" :serviceLocation="serviceLocation" :serviceObject="serviceObject"
            @click="handleActivityCard(activity.activityId, activity)"
            class="transition-all duration-300 hover:shadow-lg hover:-translate-y-1" />
        </div>
      </template>
      <div v-else class="flex flex-col items-center justify-center py-12 min-h-[50vh]">
        <Icon icon="mdi:clipboard-text-clock-outline" class="text-5xl md:text-6xl mb-4 text-gray-300" />
        <p class="text-lg md:text-xl font-semibold text-gray-500">{{ $t('component.noDataArea.title') }}</p>
        <p class="mt-2 text-gray-400">{{ $t('component.noDataArea.content') }}</p>
      </div>

      <el-pagination v-if="total > 0" v-model:page-size="pageSize" v-model:current-page="pageNum" :total="total"
        @current-change="handleCurrentChange" layout="prev, pager, next"
        class="mt-8 sticky bottom-2 z-10 bg-white/80 backdrop-blur-sm py-2 rounded-lg shadow-sm" :background="true"
        :hide-on-single-page="true" />


    </div>
  </Layout>
</template>

<script setup>
import { defineComponent, ref, onMounted, getCurrentInstance } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import Layout from '../components/Layout.vue';
import ActivityCard from '../components/ActivityCard.vue';
import { getPublishActivities, listInfo, getPublishActivities2 } from '../api/openness/openness';
import { Icon } from '@iconify/vue';

defineComponent(['ActivityCard', 'Layout', 'Icon']);

const { t } = useI18n();

const { proxy } = getCurrentInstance();
const dictDatas = proxy.useDict('service_location', 'service_field', 'service_object');
const serviceField = dictDatas.service_field;
const serviceObject = dictDatas.service_object;
const serviceLocation = dictDatas.service_location;
const router = useRouter();
const loading = ref(false);
const pageNum = ref(1);
const pageSize = ref(6);
const total = ref(0);

// SVG for loading animation
const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <g fill="none" fill-rule="evenodd">
      <path fill="currentColor" d="M12 4.5a7.5 7.5 0 1 0 0 15a7.5 7.5 0 0 0 0-15M1.5 12C1.5 6.201 6.201 1.5 12 1.5S22.5 6.201 22.5 12S17.799 22.5 12 22.5S1.5 17.799 1.5 12" opacity="0.1"/>
      <path fill="currentColor" d="M12 4.5a7.46 7.46 0 0 0-5.187 2.083a1.5 1.5 0 0 1-2.075-2.166A10.46 10.46 0 0 1 12 1.5a1.5 1.5 0 0 1 0 3"/>
    </g>
  </svg>
`;

const breadcrumbItems = [
  { label: t('breadCrumb.home'), path: '/' },
  { label: t('breadCrumb.activityPage'), path: '/activity' },
];

const currentPage = t('breadCrumb.activityPage');
const activities = ref([]);

const handleActivityCard = (activityId, type) => {
  // console.log(1111111111, type.activityStatus)
  if (type.activityStatus == 4) {
    // 提示活动已结束
    proxy.$message.warning(t('page.activity.activities.activityEnd'));
  } else {
    router.push({ name: 'activityDetail', query: { activityId: activityId } });
  }
};

const getList = () => {
  loading.value = true;
  const params = {
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    // orderByColumn: 'publish_time,activity_id',
    // isAsc: 'desc'
  };
  getPublishActivities2(params).then((res) => {
    console.log('已经发布的', res.rows);

    activities.value = res.rows;
    total.value = res.total;
    loading.value = false;
  }).catch(error => {
    console.error('Failed to fetch activities:', error);
    loading.value = false;
  });
};

const handleCurrentChange = (val) => {
  pageNum.value = val;
  getList();
};

onMounted(() => {
  getList();


  // getPublishActivities2().then(res => {
  //   if (res.code == 200) {
  //     console.log("已经发布的活动列表", res.rows);

  //   }
  // })




});
</script>

<style scoped>
.rainbow-border {
  height: 4px;
  background: linear-gradient(to right, #ff6b6b, #feca57, #48dbfb, #ff9ff3, #54a0ff);
  border-radius: 2px;
}
</style>
