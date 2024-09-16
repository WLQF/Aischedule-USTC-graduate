async function scheduleTimer({
  providerRes,
  parserRes
} = {}) {
  let startSemesterTimeStr = ''
  let startSemester = await AIScheduleSelect({
    titleText: '开学时间',
    contentText: '请选择学期',
    selectList: [
      '春季学期',
      '秋季学期',
      '自定义'
    ]
  })
  const now = new Date()
  const nowYear = now.getFullYear()
  let startDate = new Date()
  if (startSemester == '春季学期') {
    //月份偏移1
    startDate = new Date(nowYear, 1, 25, 0, 0, 0)
  }
  else if (startSemester == '秋季学期') {
    startDate = new Date(nowYear, 8, 1, 0, 0, 0)
  }
  startSemesterTimeStr = startDate.getTime().toString()
  await AIScheduleAlert({
    titleText: '提示',
    contentText: `-部分上课时间特殊的课程已添加注释，请注意检查冲突课程
      -最近假期将不会显示课程，后续假期你可以重新导入来获取最新的排课
      -获取的课表较为零散，建议关闭“显示非本周课程”
      -开学愉快！`,
    confirmText: '确认'
  })

  return {
    totalWeek: 20,
    startSemester: startSemesterTimeStr,
    startWithSunday: true,
    showWeekend: true,
    forenoon: 5,
    afternoon: 5,
    night: 3,
    sections: [
      { section: 1, startTime: '07:50', endTime: '08:35', },
      { section: 2, startTime: '08:40', endTime: '09:25', },
      { section: 3, startTime: '09:45', endTime: '10:30', },
      { section: 4, startTime: '10:35', endTime: '11:20', },
      { section: 5, startTime: '11:25', endTime: '12:10', },

      { section: 6, startTime: '14:00', endTime: '14:45', },
      { section: 7, startTime: '14:50', endTime: '15:30', },
      { section: 8, startTime: '15:55', endTime: '16:40', },
      { section: 9, startTime: '16:45', endTime: '17:30', },
      { section: 10, startTime: '17:35', endTime: '18:20', },

      { section: 11, startTime: '19:30', endTime: '20:15', },
      { section: 12, startTime: '20:20', endTime: '21:05', },
      { section: 13, startTime: '21:20', endTime: '21:55', },
    ]
  }
}