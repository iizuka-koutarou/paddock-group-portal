const state = {
  clockIn: localStorage.getItem("paddock_clock_in") || "",
  clockOut: localStorage.getItem("paddock_clock_out") || "",
};

function nowTime() {
  return new Date().toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" });
}

function parseTime(value) {
  if (!value) return null;
  const [h, m] = value.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

function renderAttendance() {
  document.getElementById("clockInTime").textContent = state.clockIn || "--:--";
  document.getElementById("clockOutTime").textContent = state.clockOut || "--:--";

  const status = document.getElementById("workStatus");
  if (state.clockOut) status.textContent = "退勤済み";
  else if (state.clockIn) status.textContent = "勤務中";
  else status.textContent = "未打刻";

  const start = parseTime(state.clockIn);
  const end = parseTime(state.clockOut);
  if (start && end) {
    const diffMin = Math.max(0, Math.round((end - start) / 60000));
    const h = Math.floor(diffMin / 60);
    const m = diffMin % 60;
    document.getElementById("workDuration").textContent = `${h}時間${m}分`;
  } else {
    document.getElementById("workDuration").textContent = "--";
  }
}

function clockIn() {
  if (!state.clockIn || confirm("出社時刻を上書きしますか？")) {
    state.clockIn = nowTime();
    state.clockOut = "";
    localStorage.setItem("paddock_clock_in", state.clockIn);
    localStorage.removeItem("paddock_clock_out");
    renderAttendance();
  }
}

function clockOut() {
  if (!state.clockIn) {
    alert("先に出社を打刻してください。");
    return;
  }
  state.clockOut = nowTime();
  localStorage.setItem("paddock_clock_out", state.clockOut);
  renderAttendance();
}

function openCorrection() {
  document.getElementById("correctionModal").classList.add("is-open");
}

function closeCorrection() {
  document.getElementById("correctionModal").classList.remove("is-open");
}

function submitCorrection() {
  const value = document.getElementById("correctionValue").value.trim();
  const reason = document.getElementById("correctionReason").value.trim();
  if (!value || !reason) {
    alert("訂正内容と理由を入力してください。");
    return;
  }
  document.getElementById("correctionText").textContent = `${value} / 理由：${reason}`;
  closeCorrection();
  alert("訂正申請を受け付けました。管理者確認待ちです。");
}

renderAttendance();
