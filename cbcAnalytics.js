// cbcAnalytics.js
export function generateCBCAnalytics(gradeClassMap) {
  let analysisResults = [];

  Object.entries(gradeClassMap).forEach(([grade, classes]) => {
    Object.entries(classes).forEach(([cls, students]) => {
      let totalScore = 0;
      let studentCount = 0;
      let subjectPerformances = {};
      let strugglingStudents = [];

      Object.entries(students).forEach(([name, data]) => {
        const scores = Object.values(data.subjects);
        const studentTotal = scores.reduce((a, b) => a + b, 0);
        const studentAvg = scores.length > 0 ? studentTotal / 7 : 0;

        totalScore += studentAvg;
        studentCount++;

        if (studentAvg < 2.5) { // Threshold for meeting expectations
          strugglingStudents.push({ name, admission: data.admission, avg: studentAvg });
        }

        Object.entries(data.subjects).forEach(([sub, score]) => {
          subjectPerformances[sub] ??= { total: 0, count: 0 };
          subjectPerformances[sub].total += score;
          subjectPerformances[sub].count += 1;
        });
      });

      const classMean = studentCount > 0 ? totalScore / studentCount : 0;

      let weakSubjects = [];
      Object.entries(subjectPerformances).forEach(([sub, stats]) => {
        const subAvg = stats.total / stats.count;
        if (subAvg < 2.5) weakSubjects.push({ subject: sub, avg: subAvg });
      });

      analysisResults.push({
        grade,
        className: cls,
        classMean,
        risks: strugglingStudents.length > (studentCount * 0.2) 
          ? "High risk of cohort underperformance in core competency strands." 
          : "Cohort stability aligns with target formative thresholds.",
        weakSubjects,
        strugglingStudents,
        remediations: generateRemediations(weakSubjects, strugglingStudents)
      });
    });
  });

  return analysisResults;
}

function generateRemediations(weakSubjects, strugglingStudents) {
  let actions = [];
  if (weakSubjects.length > 0) {
    actions.push(`Targeted formative re-teaching recommended for: ${weakSubjects.map(w => w.subject).join(", ")}.`);
  }
  if (strugglingStudents.length > 0) {
    actions.push(`Establish individualized learning pathways or peer-support frameworks for ${strugglingStudents.length} identified learners.`);
  }
  return actions;
}
