//科大课程安排表
//科大返回的课程表只有时间，没有节次
const daySelections = [
  { start: 750, end: 835 },
  { start: 840, end: 925 },
  //20min
  { start: 945, end: 1030 },
  { start: 1035, end: 1120 },
  { start: 1125, end: 1210 },
  //午休
  { start: 1400, end: 1445 },
  { start: 1450, end: 1535 },
  //20min
  { start: 1555, end: 1640 },
  { start: 1645, end: 1730 },
  { start: 1735, end: 1820 },
  //晚休
  { start: 1930, end: 2015 },
  { start: 2020, end: 2105 },
  { start: 2110, end: 2155 }
]

function numberToTimeStr(num) {
  //将四位数字转换为时间字符串
  const hours = Math.floor(num / 100)
  const minutes = num % 100
  return hours + ':' + minutes
}
function getSections(start, end) {
  //根据课程时间返回对应节次，以及课程是否完整
  let startFull = false
  let endFull = false
  let sections = []
  for (let i = 0; i < daySelections.length; i++) {
    if (start <= daySelections[i].end && end >= daySelections[i].start) {
      if (daySelections[i].start == start) {
        startFull = true
      }
      if (daySelections[i].end == end) {
        endFull = true
      }
      sections.push(i + 1)
    }
  }
  return [sections, startFull && endFull]
}
function isEqual(obj1, obj2) {
  // 检查两个对象是否相等
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // 检查键的数量是否相同
  if (keys1.length !== keys2.length) {
    return false;
  }

  // 遍历所有键
  for (let key of keys1) {
    if (!obj2.hasOwnProperty(key)) {
      return false;
    }

    // 检查值是否相等
    if (typeof obj1[key] === 'object' && obj1[key] !== null && typeof obj2[key] === 'object' && obj2[key] !== null) {
      // 递归检查嵌套对象
      if (!isEqual(obj1[key], obj2[key])) {
        return false;
      }
    } else if (obj1[key] !== obj2[key]) {
      return false;
    }
  }
  return true;
}
function find(arr, val) {
  //寻找数组中与val相同的元素，返回索引
  //如果找不到，返回-1
  for (let i = 0; i < arr.length; i++) {
    if (isEqual(arr[i], val)) {
      return i
    }
  }
  return -1
}
function scheduleHtmlParser(str) {
  //解析上一步返回的json字符串
  const strJson = JSON.parse(str)
  const lessonList = strJson.result.lessonList
  const scheduleList = strJson.result.scheduleList

  //根据lessonList获取课程基础信息
  //根据课程id建立课程列表
  let courseList = {}
  lessonList.forEach(lesson => {
    //获取教师列表
    let teacherList = []
    const teacherAssignmentList = lesson.teacherAssignmentList
    teacherAssignmentList.forEach(teacherAssignment => {
      teacherList.push(teacherAssignment.name)
    })
    const teacher = teacherList.join(",")

    //课程基础信息
    const lessonResult = {
      name: lesson.courseName, // 课程名称
      position: "", // 上课地点
      teacher: teacher, // 教师名称
      weeks: [], // 周数，使用建议教学周会出问题，改为使用Schedule获取
      scheduleDatas: [],//包括day,sections
      full: true//课程是否完整
    }
    courseList[lesson.id] = lessonResult
  })

  //根据scheduleList获取课程时间和地点
  scheduleList.forEach(schedule => {
    //课程时间
    lessonId = schedule.lessonId
    if (courseList[lessonId]) {
      let [sections, full] = getSections(schedule.startTime, schedule.endTime)
      if (!full && courseList[lessonId].full) {
        //如果不完整在课程名称后加上注释
        courseList[lessonId].name += ('(' + numberToTimeStr(schedule.startTime) + '~' + numberToTimeStr(schedule.endTime) + ')')
        courseList[lessonId].full = false
      }
      scheduleData = {
        day: schedule.weekday,
        sections: sections
      }
      week = schedule.weekIndex
      let i = find(courseList[lessonId].scheduleDatas, scheduleData)
      if (i == -1) {
        //若现有时间表中无此时间表，将该时间表加入，在weeks中新建一个列表，并将当前周数添加到列表中
        courseList[lessonId].scheduleDatas.push(scheduleData)
        courseList[lessonId].weeks.push([week])
      } else {
        //若与现有时间表重复，则将当前周数添加到对应列表中
        courseList[lessonId].weeks[i].push(week)
      }
    }

    //课程地点
    if (courseList[lessonId].position == "") {
      courseList[lessonId].position = schedule.room.building.campus.nameZh + schedule.room.nameZh
    }
  })

  //将courseList转换为小爱课程表列表数据
  let result = []
  for (const courseId in courseList) {
    for (let i = 0; i < courseList[courseId].scheduleDatas.length; i++) {
      result.push({
        name: courseList[courseId].name,
        position: courseList[courseId].position,
        teacher: courseList[courseId].teacher,
        weeks: courseList[courseId].weeks[i],
        day: courseList[courseId].scheduleDatas[i].day,
        sections: courseList[courseId].scheduleDatas[i].sections,
      })
    }
  }

  return result
}
