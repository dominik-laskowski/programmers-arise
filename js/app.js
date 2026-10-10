document.addEventListener("DOMContentLoaded", init);

let userName = "";
let currentModule = null;

function $(id){ return document.getElementById(id); }
function showSection(id){
  ["login","modules","player","dashboard"].forEach(s => {
    const el = $(s);
    if(el) el.classList.toggle("hidden", s !== id);
  });
  // move focus to heading for a11y
  const map = {login:"loginHeading", modules:"modulesHeading", player:"playerHeading", dashboard:"dashboardHeading"};
  const h = $(map[id]);
  if(h) h.focus?.();
}
function safeOn(el, ev, fn){ if(el) el.addEventListener(ev, fn); }

function init(){
  safeOn($("startBtn"), "click", onStart);
  safeOn($("submitQuiz"), "click", onSubmitQuiz);
  safeOn($("retryQuiz"), "click", onRetryQuiz);
  safeOn($("exportBtn"), "click", onExport);
  safeOn($("openDashboard"), "click", showDashboard);
  safeOn($("logoutBtn"), "click", onLogout);
  safeOn($("backToModules"), "click", () => showSection("modules"));
  safeOn($("backToModulesFromDashboard"), "click", () => showSection("modules"));
  document.addEventListener("keydown", (e) => { if((e.key||"").toLowerCase() === "d") showDashboard(); });
}

function onStart(){
  userName = ($("username")?.value || "").trim();
  if(!userName){ alert("Enter a display name"); return; }
  const w = $("welcomeName");
  if (w) w.textContent = userName;
  showSection("modules");
  renderModules();
}

async function renderModules(){
  const list = $("moduleList");
  if(!list) return;
  list.innerHTML = "";
  let source = null;
  if (window.fetchVideosFromAPI) {
    try { source = await window.fetchVideosFromAPI(); } catch(e){ source = null; }
  }
  const data = Array.isArray(source) && source.length ? source : (window.videos || []);
  data.forEach(v => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.textContent = v.title;
    btn.setAttribute("aria-label", "Open module " + v.title);
    btn.addEventListener("click", () => startModule(v));
    li.appendChild(btn);
    list.appendChild(li);
  });
  if(!data.length){
    const li = document.createElement("li");
    li.textContent = "No modules available. Please try again later.";
    list.appendChild(li);
  }
}

function startModule(mod){
  currentModule = mod;
  $("moduleTitle").textContent = mod.title;
  const wrap = $("videoWrapper");
  wrap.innerHTML = `<iframe title="${mod.title}" src="https://www.youtube.com/embed/${mod.videoId}" allowfullscreen></iframe>`;
  showSection("player");
  renderQuiz(mod.id);
}

function renderQuiz(moduleId){
  const quizBox = $("quizContainer");
  if(!quizBox || !window.quizzes || !window.quizzes[moduleId]){
    if(quizBox) quizBox.textContent = "No quiz available for this module.";
    return;
  }
  quizBox.innerHTML = "";
  window.quizzes[moduleId].forEach((q, idx) => {
    const div = document.createElement("div");
    div.className = "question";
    div.innerHTML = `<p><strong>Q${idx+1}.</strong> ${q.q}</p>`;
    q.options.forEach((opt, i) => {
      const id = `q${idx}_opt${i}`;
      const input = document.createElement("input");
      input.type = "checkbox";
      input.id = id;
      input.name = `q${idx}`;
      input.value = i;
      input.addEventListener("change", toggleSubmitState);
      const label = document.createElement("label");
      label.setAttribute("for", id);
      label.textContent = opt;
      div.appendChild(input);
      div.appendChild(label);
      div.appendChild(document.createElement("br"));
    });
    const fb = document.createElement("div");
    fb.className = "feedback";
    fb.id = `fb_q${idx}`;
    div.appendChild(fb);
    quizBox.appendChild(div);
  });
  const submit = $("submitQuiz");
  if(submit){ submit.classList.remove("hidden"); submit.disabled = true; }
  const retry = $("retryQuiz");
  if(retry) retry.classList.add("hidden");
  const fbTotal = $("quizFeedback");
  if(fbTotal) fbTotal.textContent = "";
  toggleSubmitState();
}

function toggleSubmitState(){
  const anyChecked = !!document.querySelector("#quizContainer input[type=checkbox]:checked");
  const btn = $("submitQuiz");
  if(btn) btn.disabled = !anyChecked;
}

function onSubmitQuiz(){
  if(!currentModule || !window.quizzes) return;
  const moduleId = currentModule.id;
  const qs = window.quizzes[moduleId] || [];
  let score = 0;

  qs.forEach((q, idx) => {
    const selected = Array.from(document.querySelectorAll(`input[name=q${idx}]:checked`)).map(el => parseInt(el.value, 10));
    const correct = Array.isArray(q.answer) ? q.answer : [q.answer];
    const tp = selected.filter(x => correct.includes(x)).length;
    const partial = correct.length ? (tp / correct.length) : 0;
    score += partial;

    const fb = document.getElementById(`fb_q${idx}`);
    const isPerfect = partial === 1 && selected.length === correct.length;
    if(fb){
      fb.textContent = isPerfect ? (q.explainCorrect || "Correct.") : (q.explainIncorrect || "Review and try again.");
      fb.className = "feedback " + (isPerfect ? "good" : "bad");
    }
  });

  const pct = Math.round((score / Math.max(1, qs.length)) * 100);
  const fbTotal = $("quizFeedback");
  if(fbTotal) fbTotal.textContent = `Score: ${pct}%`;
  saveProgress(moduleId, pct);
  const retry = $("retryQuiz");
  if(retry) retry.classList.remove("hidden");
  const submit = $("submitQuiz");
  if(submit) submit.disabled = true;
}

function onRetryQuiz(){
  if(!currentModule) return;
  renderQuiz(currentModule.id);
}

function showDashboard(){
  renderDashboard();
  showSection("dashboard");
}

function renderDashboard(){
  const tbody = $("progressTable").querySelector("tbody");
  tbody.innerHTML = "";
  const progress = loadProgress();
  const modules = (window.videos || []);
  modules.forEach(m => {
    const attempts = (progress[userName]?.[m.id]?.attempts) || [];
    const best = attempts.length ? Math.max(...attempts) : "-";
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${m.title}</td><td>${best === "-" ? "-" : best + "%"}</td><td>${attempts.join(", ") || "-"}</td>`;
    tbody.appendChild(tr);
  });
}

function onExport(){
  const data = loadProgress();
  const blob = new Blob([JSON.stringify({ user: userName, progress: data[userName] || {} }, null, 2)], {type: "application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `programmers-arise-progress-${(userName||'anon').replace(/\\W+/g,'_')}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function onLogout(){
  userName = "";
  showSection("login");
}

function loadProgress(){
  try{
    return JSON.parse(localStorage.getItem("pa_progress") || "{}");
  }catch(_){ return {}; }
}

function saveProgress(moduleId, pct){
  const data = loadProgress();
  if(!data[userName]) data[userName] = {};
  if(!data[userName][moduleId]) data[userName][moduleId] = { attempts: [] };
  data[userName][moduleId].attempts.push(pct);
  localStorage.setItem("pa_progress", JSON.stringify(data));
}
