import request from '../../utils/request';


// 根据字典类型查询字典数据信息
export function getDicts(dictType) {
  return request({
    url: 'openness/dict/' + dictType,
    method: 'get'
  });
}
// 添加临时活动信息
export function addTempAcitivity(data) {
  return request({
    url: 'openness/tempActivitie/add',
    method: 'post',
    data: data
  });
}
// 已登录用户添加临时活动信息
export function addTempAcitivityByToken(data) {
  return request({
    url: 'volunteer/info',
    method: 'post',
    data: data
  });
}
// 获取发布好的活动信息
export function getPublishActivities(data) {
  return request({
    url: 'openness/activity/getPublishActivities',
    method: 'get',
    params: data
  });
}
// 获取活动详情信息
export function getActivityDetailById(id) {
  return request({
    // url: `openness/activity/getActivityDetailById/${id}`,
    url: `open/front/getActivityDetailById/${id}`,
    method: 'get'
  });
}
// 报名
export function signUpActivity(activityId) {
  return request({
    url: `volunteer/info/signUp/${activityId}`,
    method: 'put'
  });
}

// 获取用户参与活动信息
export function getParticipatedActivities(data) {
  return request({
    url: 'openness/activity/getParticipatedActivities',
    method: 'post',
    data: data
  });
}

// 获取用户参与活动信息
export function getParticipatedActivitiesByToken() {
  return request({
    url: 'volunteer/info/getParticipatedActivitiesByToken',
    method: 'get'
  });
}

// 查询活动信息列表
export function listInfo(query) {
  return request({
    url: '/volunteer/info/list',
    method: 'get',
    params: query
  });
}

// 前台-中间卡片-上面的时长统计
export function getDurationStatistics() {
  return request({
    url: '/open/front/viewState ',
    method: 'get'
  });
}

// 前台中间卡片-下面的参与活动列表，不分页
export function getParticipatedActivities2() {
  return request({
    url: '/open/front/activityDetails',
    method: 'get'
  });
}

// 已经发布的活动列表
export function getPublishActivities2() {
  return request({
    url: '/open/front/publishActivitys',
    method: 'get'
  });
}

// 新增活动信息
export function addSelfRecord(data) {
  return request({
    url: '/activityInfo/selfRecord',
    method: 'post',
    data: data
  })
}