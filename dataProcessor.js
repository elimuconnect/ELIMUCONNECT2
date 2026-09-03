// dataProcessor.js
export function processBroadsheetData(records, avgMap) {
  let gradeClassMap = {};

  records.forEach(r => {
    const grade = r.grade_name
      ? (String(r.grade_name).startsWith("Grade") ? r.grade_name : `Grade ${r.grade_name}`)
      : "Unknown";

    gradeClassMap[grade] ??= {};
    gradeClassMap[grade][r.className] ??= {};
    gradeClassMap[grade][r.className][r.student] ??= {
      admission: r.admission,
      subjects: {}
    };

    const subjectData = avgMap?.[r.student]?.[r.subject];
    if (!subjectData) return;

    const score = levelToScore(subjectData.achievement_level);
    if (typeof score !== "number" || isNaN(score)) return;

    gradeClassMap[grade][r.className][r.student].subjects[r.subject] = score;
  });

  return gradeClassMap;
}
