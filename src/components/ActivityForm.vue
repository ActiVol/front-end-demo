<template>
  <div class="w-full max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
    <el-form ref="formRef" :model="form" :rules="rules" class="space-y-6" :validate-on-rule-change="false">
      <!-- 用户名 -->
      <!-- <el-form-item :label="$t('page.logTime.username')" prop="username" label-position="top">
        <el-input v-model="form.username" :placeholder="$t('page.logTime.enterUsername')" />
        <span class="mt-1 text-gray-500 text-sm"> $t('page.logTime.usernameTip') </span>
      </el-form-item> -->

      <!-- 活动名称 -->
      <el-form-item :label="$t('page.logTime.activityName')" prop="activityName" label-position="top">
        <el-input v-model="form.activityName" :placeholder="$t('page.logTime.enterActivityName')">
          <template #prefix>
            <el-icon>
              <House />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>

      <!-- 活动地址 -->
      <el-form-item :label="$t('page.logTime.activityLocation')" prop="address" label-position="top">
        <el-input v-model="form.address" :placeholder="$t('page.logTime.enterActivityLocation')">
          <template #prefix>
            <el-icon>
              <LocationInformation />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>

      <!-- 开始时间 -->
      <el-form-item :label="$t('page.logTime.startTime')" prop="startTime" label-position="top">
        <el-date-picker v-model="form.startTime" type="datetime" :placeholder="$t('page.logTime.selectStartTime')"
          style="width: 100%;" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" />
      </el-form-item>

      <!-- 结束时间 -->
      <el-form-item :label="$t('page.logTime.endTime')" prop="endTime" label-position="top">
        <el-date-picker v-model="form.endTime" type="datetime" :placeholder="$t('page.logTime.selectEndTime')"
          style="width: 100%;" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" />
      </el-form-item>

      <!-- 活动时长 -->
      <el-form-item :label="$t('page.logTime.duration')" prop="duration" label-position="top">
        <el-input v-model="form.duration" type="number" :placeholder="$t('page.logTime.enterDuration')">
          <template #prefix>
            <el-icon>
              <Timer />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>

      <!-- 招募人数 -->
      <el-form-item :label="$t('page.logTime.recruitNumber')" prop="recruitNumber" label-position="top">
        <el-input v-model="form.recruitNumber" type="number" :placeholder="$t('page.logTime.enterRecruitNumber')">
          <template #prefix>
            <el-icon>
              <User />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>
      <!-- {{serviceFieldOptions}} -->
      <!-- 服务领域 -->
      <el-form-item :label="$t('page.logTime.serviceField')" prop="serviceField" label-position="top">
        <el-select v-model="form.serviceField" :placeholder="$t('page.logTime.selectServiceField')" style="width: 100%">

          <el-option v-for="item in serviceFieldOptions" :key="item.dictCode" :label="item.dictLabel"
            :value="item.dictCode">
          </el-option>
        </el-select>
      </el-form-item>

      <!-- 服务对象 -->
      <el-form-item :label="$t('page.logTime.serviceObject')" prop="serviceObject" label-position="top">
        <el-select v-model="form.serviceObject" :placeholder="$t('page.logTime.selectServiceObject')"
          style="width: 100%">
          <el-option v-for="item in serviceObjectOptions" :key="item.dictCode" :label="item.dictLabel"
            :value="item.dictCode">
          </el-option>
        </el-select>
      </el-form-item>

      <!-- 服务场所 -->
      <el-form-item :label="$t('page.logTime.serviceLocation')" prop="serviceLocation" label-position="top">
        <el-select v-model="form.serviceLocation" :placeholder="$t('page.logTime.selectServiceLocation')"
          style="width: 100%">
          <el-option v-for="item in serviceLocationOptions" :key="item.dictCode" :label="item.dictLabel"
            :value="item.dictCode">
          </el-option>
        </el-select>
      </el-form-item>

      <!-- 举办者姓名 -->
      <el-form-item :label="$t('page.logTime.organizerName')" prop="organizerName" label-position="top">
        <el-input v-model="form.organizerName" :placeholder="$t('page.logTime.enterOrganizerName')">
          <template #prefix>
            <el-icon>
              <User />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>

      <!-- 举办者邮箱 -->
      <el-form-item :label="$t('page.logTime.organizerEmail')" prop="organizerEmail" label-position="top">
        <el-input v-model="form.organizerEmail" :placeholder="$t('page.logTime.enterOrganizerEmail')">
          <template #prefix>
            <el-icon>
              <Message />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>

      <!-- 活动详情 -->
      <el-form-item :label="$t('page.logTime.activityDescription')" prop="details" label-position="top">
        <el-input v-model="form.details" type="textarea" :rows="3"
          :placeholder="$t('page.logTime.enterActivityDescription')">
          <template #prefix>
            <el-icon>
              <Document />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>

      <!-- 活动图片 -->
      <el-form-item :label="$t('page.logTime.activityPictures')" prop="activityPictures" label-position="top">
        <ImageUpload v-model="form.activityPictures" :limit="1" />
      </el-form-item>

      <!-- 提交按钮 -->
      <div>
        <el-button :loading="loading" size="large" type="primary"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          @click.prevent="handleSubmit">
          <span v-if="!loading">{{ $t('page.logTime.submit') }}</span>
          <span v-else>{{ $t('page.logTime.submitting') }}</span>
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
const router = useRouter();
import { ElMessage } from 'element-plus';
import { ref, computed, onMounted } from 'vue';
import { addSelfRecord } from '@/api/openness/openness';
import { getDicts } from '@/api/openness/openness'; // 引入获取字典数据的方法
import { getToken } from '../utils/auth';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const loading = ref(false);
const isLoggedIn = getToken();
const formRef = ref(null);

// 字典选项数据
const serviceFieldOptions = ref([]);
const serviceObjectOptions = ref([]);
const serviceLocationOptions = ref([]);

const form = ref({
  username: '',
  activityName: '',
  address: '',
  startTime: null,
  endTime: null,
  duration: null,
  recruitNumber: null,
  serviceField: '',
  serviceObject: '',
  serviceLocation: '',
  organizerName: '',
  organizerEmail: '',
  details: '',
  activityPictures: '',
  deptId: null
});

// 获取字典数据
const getDictData = async () => {
  try {
    // 获取服务领域字典数据
    const serviceFieldRes = await getDicts('service_field');
    serviceFieldOptions.value = serviceFieldRes.data || [];

    // 获取服务对象字典数据
    const serviceObjectRes = await getDicts('service_object');
    serviceObjectOptions.value = serviceObjectRes.data || [];

    // 获取服务场所字典数据
    const serviceLocationRes = await getDicts('service_location');
    serviceLocationOptions.value = serviceLocationRes.data || [];
  } catch (error) {
    ElMessage.error(t('page.logTime.dictLoadError'));
    console.error('获取字典数据失败:', error);
  }
};

onMounted(() => {
  // 页面加载时获取字典数据
  getDictData();
});

const endTimeValidator = (rule, value, callback) => {
  if (value && form.value.startTime) {
    const start = new Date(form.value.startTime).getTime();
    const end = new Date(value).getTime();
    if (end <= start) {
      callback(new Error(t('page.logTime.endTimeError')));
    } else {
      callback();
    }
  }
};

const rules = computed(() => ({
  username: [{ required: true, trigger: 'blur', message: t('page.logTime.usernameRequired') }],
  activityName: [{ required: true, trigger: 'blur', message: t('page.logTime.activityNameRequired') }],
  address: [{ required: true, trigger: 'blur', message: t('page.logTime.activityLocationRequired') }],
  startTime: [{ required: true, trigger: 'change', message: t('page.logTime.startTimeRequired') }],
  endTime: [{ validator: endTimeValidator, trigger: 'change' }],
  duration: [{ required: true, trigger: 'blur', message: t('page.logTime.durationRequired') }],
  recruitNumber: [{ required: true, trigger: 'blur', message: t('page.logTime.recruitNumberRequired') }],
  serviceField: [{ required: true, trigger: 'change', message: t('page.logTime.serviceFieldRequired') }],
  serviceObject: [{ required: true, trigger: 'change', message: t('page.logTime.serviceObjectRequired') }],
  serviceLocation: [{ required: true, trigger: 'change', message: t('page.logTime.serviceLocationRequired') }],
  organizerName: [{ required: true, trigger: 'blur', message: t('page.logTime.organizerNameRequired') }],
  organizerEmail: [
    { required: true, trigger: 'blur', message: t('page.logTime.organizerEmailInvalid') },
    { type: 'email', message: t('page.logTime.organizerEmailInvalid'), trigger: ['blur', 'change'] }
  ],
  details: [{ required: true, trigger: 'blur', message: t('page.logTime.activityDescriptionRequired') }]
}));

const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      addSelfRecord(form.value)
        .then(response => {
          if (response.code === 200) {
            ElMessage.success(t('page.logTime.submitSuccess'));

            setTimeout(() => {
              router.push({ path: '/home' });
            }, 1500);

          } else {
            ElMessage.error(t('page.logTime.submitFail') + response.msg);
          }
        })
        .catch(error => {
          ElMessage.error(t('page.logTime.submitError'));
        })
        .finally(() => {
          loading.value = false;
        });
    }
  });
};
</script>

<style scoped>
.el-form-item {
  margin-bottom: 1.5rem;
}

.el-input,
.el-select,
.el-date-picker {
  width: 100%;
}

.el-textarea__inner {
  min-height: 100px;
}
</style>