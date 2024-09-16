
async function scheduleHtmlProvider() {
  await loadTool('AIScheduleTools')
  try {
    //选择本科和研究生[x]
    // const identity=await AIScheduleSelect({
    //   titleText: '身份', 
    //   contentText: '请选择您的身份', 
    //   selectList: [
    //     '本科生(未开发)',
    //     '研究生',
    //   ]
    // })
    // if(identity=='本科生(未开发)'){
    //   return 'do not continue'
    // }

    //获取studentId和bizTypeId
    let r = await fetch('https://jw.ustc.edu.cn/for-std/course-select', {
      method: 'GET',
      redirect: 'follow'
    })
    const studentId = Number(r.url.split('/').pop())
    const bizTypeId = 3

    //获取turnId
    r = await fetch('https://jw.ustc.edu.cn/ws/for-std/course-select/open-turns', {
      method: 'POST',
      body: new URLSearchParams({
        bizTypeId: bizTypeId,
        studentId: studentId
      }),
      redirect: 'follow'
    })
    const turnId = JSON.parse(await r.text())[0].id

    //获取lessonIds
    r = await fetch('https://jw.ustc.edu.cn/ws/for-std/course-select/selected-lessons', {
      method: 'POST',
      body: new URLSearchParams({
        turnId: turnId,
        studentId: studentId
      }),
      redirect: 'follow'
    })
    const selectedLessons = JSON.parse(await r.text())
    let lessonIds = []
    selectedLessons.forEach(selectedLesson => lessonIds.push(selectedLesson.id))

    //获取课程信息和排课表
    r = await fetch('https://jw.ustc.edu.cn/ws/schedule-table/datum', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        lessonIds: lessonIds,
        turnId: turnId
      })
    })
    let result = await r.text()

    //返回结果
    return result
  }
  catch (error) {
    console.error(error)
    await AIScheduleAlert(error.message)
    return 'do not continue'
  }
}
