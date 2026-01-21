import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  "https://zcmzuetusvpmvubbjlmx.supabase.co",
  "sb_publishable_-BGJLAySaH7bQ5lBIZF9zg_eohK-xEn"
);

/* Auth */
const { data: { user } } = await supabase.auth.getUser();
if (!user) location.href = "index.html";

/* Load dashboard data */
const { data, error } = await supabase
  .from("parent_assessment_dashboard")
  .select("*")
  .order("academic_year", { ascending: false });

if (error) {
  document.getElementById("status").innerText = error.message;
  throw error;
}

/* Group by child */
const children = {};
data.forEach(r => {
  if (!children[r.student_id]) {
    children[r.student_id] = {
      name: r.student_name,
      records: []
    };
  }
  children[r.student_id].records.push(r);
});

/* Render child tabs */
const tabs = document.getElementById("childrenTabs");
Object.entries(children).forEach(([id, child], index) => {
  const btn = document.createElement("button");
  btn.innerText = child.name;
  btn.onclick = () => renderResults(id);
  if (index === 0) btn.click();
  tabs.appendChild(btn);
});

/* Populate years */
const years = [...new Set(data.map(r => r.academic_year))];
document.getElementById("yearSelect").innerHTML =
  years.map(y => `<option value="${y}">${y}</option>`).join("");

document.getElementById("yearSelect").onchange =
document.getElementById("termSelect").onchange = () => {
  const active = document.querySelector("#childrenTabs button.active");
  if (active) active.click();
};

/* Render results */
function renderResults(studentId) {
  document.querySelectorAll("#childrenTabs button")
    .forEach(b => b.classList.remove("active"));
  event.target.classList.add("active");

  const year = document.getElementById("yearSelect").value;
  const term = document.getElementById("termSelect").value;

  const records = children[studentId].records.filter(r =>
    (!year || r.academic_year === year) &&
    (!term || r.term === term)
  );

  const container = document.getElementById("results");

  if (!records.length) {
    container.innerHTML = "<p>No records found.</p>";
    return;
  }

  container.innerHTML = records.map(r => `
    <div style="border:1px solid #ccc; padding:10px; margin-bottom:10px;">
      <strong>${r.learning_area}</strong><br>
      ${r.competency}<br>
      <b>${r.achievement_level}</b><br>
      <i>${r.remarks || ""}</i>
    </div>
  `).join("");
}
