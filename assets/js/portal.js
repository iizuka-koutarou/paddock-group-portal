const state = {
  clockIn: localStorage.getItem("paddock_clock_in") || "",
  clockOut: localStorage.getItem("paddock_clock_out") || "",
  breakStatus: localStorage.getItem("paddock_break_status") || "",
  breakReason: localStorage.getItem("paddock_break_reason") || "",
  breakOutTime: localStorage.getItem("paddock_break_out_time") || "",
  breakReturnTime: localStorage.getItem("paddock_break_return_time") || "",
};

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];
const PORTAL_DAILY_MESSAGE_KEY = "paddock_portal_daily_message";

const DEFAULT_DAILY_QUOTES = {
  spring: [
    "春の風のように、やわらかな笑顔でお客様をお迎えしましょう。",
    "新しい季節の始まりに、丁寧なひと声で安心を届けましょう。",
  ],
  summer: [
    "暑い日こそ、最初のひと言に涼しさと思いやりを添えましょう。",
    "ご来店の瞬間に、爽やかな挨拶で心地よさをつくりましょう。",
  ],
  autumn: [
    "雨の日のご来店には、いつも以上の感謝を言葉にしましょう。",
    "実りの季節こそ、落ち着いた応対で信頼を積み重ねましょう。",
  ],
  winter: [
    "寒い季節ほど、あたたかい声掛けがお客様の心に残ります。",
    "冷える朝こそ、先回りした気配りで安心感を届けましょう。",
  ],
  all: [
    "小さな気配りが、次のご来店につながる一番のサービスです。",
    "整った身だしなみと明るい挨拶が、信頼の第一歩です。",
    "お客様の一日が少し良くなる接客を心がけましょう。",
  ],
};

function pad(value) {
  return String(value).padStart(2, "0");
}

function getTimeParts(date = new Date()) {
  return {
    h: pad(date.getHours()),
    m: pad(date.getMinutes()),
    s: pad(date.getSeconds()),
  };
}

function nowTime() {
  const { h, m, s } = getTimeParts();
  return `${h}:${m}:${s}`;
}

function formatDate(date = new Date()) {
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日（${WEEKDAYS[date.getDay()]}）`;
}

function getTimePeriod(date = new Date()) {
  const hour = date.getHours();
  if (hour >= 5 && hour < 11) return "morning";
  if (hour >= 11 && hour < 17) return "noon";
  if (hour >= 17 && hour < 23) return "evening";
  return "night";
}

function getGreeting(period) {
  switch (period) {
    case "morning":
      return "おはようございます。";
    case "noon":
      return "こんにちは。";
    case "evening":
      return "お疲れ様です。";
    default:
      return "遅くまでお疲れ様です。";
  }
}

function getSeason(date = new Date()) {
  const month = date.getMonth() + 1;
  if ([3, 4, 5].includes(month)) return "spring";
  if ([6, 7, 8].includes(month)) return "summer";
  if ([9, 10, 11].includes(month)) return "autumn";
  return "winter";
}

function getDefaultDailyMessage(date = new Date()) {
  const season = getSeason(date);
  const seasonalQuotes = DEFAULT_DAILY_QUOTES[season] || [];
  const pool = seasonalQuotes.concat(DEFAULT_DAILY_QUOTES.all);
  const index = date.getDate() % pool.length;
  return pool[index];
}

function updateClock() {
  const now = new Date();
  const period = getTimePeriod(now);

  const currentTime = document.getElementById("currentTime");
  const currentDate = document.getElementById("currentDate");
  const greetingText = document.getElementById("greetingText");
  const greetingName = document.getElementById("greetingName");
  const serviceMessage = document.getElementById("serviceMessage");
  const dailyMessage = document.getElementById("dailyMessage");
  const messageText = getDailyMessage();
  const currentUserName = localStorage.getItem("name") || localStorage.getItem("currentUserName");

  if (currentTime) currentTime.textContent = nowTime();
  if (currentDate) currentDate.textContent = formatDate(now);
  if (greetingText) greetingText.textContent = getGreeting(period);
  if (greetingName && currentUserName) greetingName.textContent = `${currentUserName}さん`;
  if (serviceMessage) serviceMessage.textContent = messageText;
  if (dailyMessage) dailyMessage.textContent = messageText;

  renderAttendance();
}

function getDailyMessage() {
  const fromStorage = localStorage.getItem(PORTAL_DAILY_MESSAGE_KEY);
  if (fromStorage && fromStorage.trim()) return fromStorage.trim();
  return getDefaultDailyMessage();
}

function parseDateTime(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function formatStoredTime(value) {
  const d = parseDateTime(value);
  if (!d) return "--:--:--";
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function formatDuration(ms) {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${pad(h)}時間${pad(m)}分${pad(s)}秒`;
}

function setStatusBadge(statusText, className) {
  const status = document.getElementById("workStatus");
  if (!status) return;
  status.textContent = statusText;
  status.className = `status-badge ${className || ""}`.trim();
  status.setAttribute("aria-label", `現在の勤務状態：${statusText}`);
}

function renderAttendance() {
  const clockInTime = document.getElementById("clockInTime");
  const clockOutTime = document.getElementById("clockOutTime");
  const breakOutTime = document.getElementById("breakOutTime");
  const breakReturnTime = document.getElementById("breakReturnTime");
  const workDuration = document.getElementById("workDuration");
  const clockInLabel = document.getElementById("clockInLabel");
  const clockOutLabel = document.getElementById("clockOutLabel");
  const breakOutLabel = document.getElementById("breakOutLabel");
  const breakReturnLabel = document.getElementById("breakReturnLabel");
  const workDurationLabel = document.getElementById("workDurationLabel");
  const breakStatusInfo = document.getElementById("breakStatusInfo");
  const clockInButton = document.querySelector(".btn-start");
  const breakButton = document.querySelector(".btn-break");
  const returnButton = document.querySelector(".btn-return");
  const clockOutButton = document.querySelector(".btn-end");

  const start = parseDateTime(state.clockIn);
  const end = parseDateTime(state.clockOut);
  const isBreak = state.breakStatus === "out";

  if (clockInTime) clockInTime.textContent = start ? formatStoredTime(state.clockIn) : "--:--:--";
  if (clockOutTime) clockOutTime.textContent = end ? formatStoredTime(state.clockOut) : "--:--:--";
  if (breakOutTime) breakOutTime.textContent = state.breakOutTime ? formatStoredTime(state.breakOutTime) : "--:--:--";
  if (breakReturnTime) breakReturnTime.textContent = state.breakReturnTime ? formatStoredTime(state.breakReturnTime) : "--:--:--";

  if (clockInLabel) clockInLabel.textContent = start ? "出社済み" : "未打刻";
  if (clockOutLabel) clockOutLabel.textContent = end ? "退勤済み" : "未退勤";
  if (breakOutLabel) breakOutLabel.textContent = state.breakOutTime ? "外出済み" : "未外出";
  if (breakReturnLabel) breakReturnLabel.textContent = state.breakReturnTime ? "戻り済み" : "未戻り";

  if (start && end) {
    if (workDuration) workDuration.textContent = formatDuration(end - start);
    if (workDurationLabel) workDurationLabel.textContent = "確定";
    setStatusBadge("勤務終了", "is-done");
    if (clockInButton) clockInButton.disabled = true;
    if (breakButton) breakButton.disabled = true;
    if (returnButton) returnButton.disabled = true;
    if (clockOutButton) clockOutButton.disabled = true;
    if (breakStatusInfo) breakStatusInfo.textContent = "勤務は終了しました。";
  } else if (start && isBreak) {
    if (workDuration) workDuration.textContent = formatDuration(new Date() - start);
    if (workDurationLabel) workDurationLabel.textContent = "外出中";
    setStatusBadge("外出中", "is-break");
    if (clockInButton) clockInButton.disabled = true;
    if (breakButton) breakButton.disabled = true;
    if (returnButton) returnButton.disabled = false;
    if (clockOutButton) clockOutButton.disabled = true;
    if (breakStatusInfo) {
      breakStatusInfo.textContent = state.breakReason ? `外出中：${state.breakReason}` : "外出中です。";
    }
  } else if (start) {
    if (workDuration) workDuration.textContent = formatDuration(new Date() - start);
    if (workDurationLabel) workDurationLabel.textContent = "勤務中";
    setStatusBadge("勤務中", "is-working");
    if (clockInButton) clockInButton.disabled = true;
    if (breakButton) breakButton.disabled = false;
    if (returnButton) returnButton.disabled = true;
    if (clockOutButton) clockOutButton.disabled = false;
    if (breakStatusInfo) breakStatusInfo.textContent = "";
  } else {
    if (workDuration) workDuration.textContent = "00時間00分00秒";
    if (workDurationLabel) workDurationLabel.textContent = "未確定";
    setStatusBadge("出社前", "is-pending");
    if (clockInButton) clockInButton.disabled = false;
    if (breakButton) breakButton.disabled = true;
    if (returnButton) returnButton.disabled = true;
    if (clockOutButton) clockOutButton.disabled = true;
    if (breakStatusInfo) breakStatusInfo.textContent = "";
  }
}

function clockIn() {
  if (state.clockIn) return;
  const now = new Date().toISOString();
  state.clockIn = now;
  state.clockOut = "";
  state.breakStatus = "";
  state.breakReason = "";
  state.breakOutTime = "";
  state.breakReturnTime = "";
  localStorage.setItem("paddock_clock_in", state.clockIn);
  localStorage.removeItem("paddock_clock_out");
  localStorage.removeItem("paddock_break_status");
  localStorage.removeItem("paddock_break_reason");
  localStorage.removeItem("paddock_break_out_time");
  localStorage.removeItem("paddock_break_return_time");
  renderAttendance();
}

function clockOut() {
  if (!state.clockIn || state.clockOut || state.breakStatus === "out") {
    return;
  }
  state.clockOut = new Date().toISOString();
  localStorage.setItem("paddock_clock_out", state.clockOut);
  renderAttendance();
}

function openBreakModal() {
  if (!state.clockIn || state.clockOut || state.breakStatus === "out") return;
  document.getElementById("breakModal").classList.add("is-open");
}

function closeBreakModal() {
  document.getElementById("breakModal").classList.remove("is-open");
}

function submitBreak() {
  const reasonInput = document.getElementById("breakReasonInput");
  const reason = reasonInput ? reasonInput.value.trim() : "";
  if (!reason) {
    alert("外出理由を入力してください。");
    return;
  }
  state.breakStatus = "out";
  state.breakReason = reason;
  state.breakOutTime = new Date().toISOString();
  localStorage.setItem("paddock_break_status", state.breakStatus);
  localStorage.setItem("paddock_break_reason", state.breakReason);
  localStorage.setItem("paddock_break_out_time", state.breakOutTime);
  closeBreakModal();
  renderAttendance();
}

function returnFromBreak() {
  if (state.breakStatus !== "out") return;
  state.breakStatus = "";
  state.breakReason = "";
  state.breakReturnTime = new Date().toISOString();
  localStorage.removeItem("paddock_break_status");
  localStorage.removeItem("paddock_break_reason");
  localStorage.setItem("paddock_break_return_time", state.breakReturnTime);
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

  const text = `申請内容：${value} / 理由：${reason}`;
  localStorage.setItem("paddock_correction_request", text);

  const correctionText = document.getElementById("correctionText");
  if (correctionText) correctionText.textContent = text;

  closeCorrection();
  alert("訂正申請を送信しました。管理者画面で確認できます。");
}

function resetDemo() {
  if (!confirm("デモ用データを初期化しますか？")) return;
  localStorage.removeItem("paddock_clock_in");
  localStorage.removeItem("paddock_clock_out");
  localStorage.removeItem("paddock_correction_request");
  localStorage.removeItem("paddock_break_status");
  localStorage.removeItem("paddock_break_reason");
  localStorage.removeItem("paddock_break_out_time");
  localStorage.removeItem("paddock_break_return_time");
  state.clockIn = "";
  state.clockOut = "";
  state.breakStatus = "";
  state.breakReason = "";
  state.breakOutTime = "";
  state.breakReturnTime = "";
  const correctionText = document.getElementById("correctionText");
  if (correctionText) correctionText.textContent = "現在、申請はありません。";
  renderAttendance();
}

function weatherIcon(telop = "") {
  if (typeof telop === "number") {
    if ([95, 96, 99].includes(telop)) return "⛈";
    if ([61, 63, 65, 80, 81, 82].includes(telop)) return "☔";
    if ([71, 73, 75, 77].includes(telop)) return "☃";
    if ([0, 1].includes(telop)) return "☀";
    if ([2, 3, 45, 48].includes(telop)) return "☁";
    return "○";
  }
  if (telop.includes("雷")) return "⛈";
  if (telop.includes("雨")) return "☔";
  if (telop.includes("雪")) return "☃";
  if (telop.includes("くも") || telop.includes("曇")) return "☁";
  if (telop.includes("晴")) return "☀";
  return "○";
}

function renderWeatherFallback() {
  const yaizuDays = [
    { date: "6/28", day: "土", telop: "雨", max: 28, min: 22 },
    { date: "6/29", day: "日", telop: "くもり", max: 30, min: 23 },
    { date: "6/30", day: "月", telop: "晴れ", max: 32, min: 24 },
    { date: "7/1", day: "火", telop: "くもり", max: 31, min: 24 },
    { date: "7/2", day: "水", telop: "雨", max: 29, min: 23 },
    { date: "7/3", day: "木", telop: "晴れ", max: 33, min: 24 },
    { date: "7/4", day: "金", telop: "くもり", max: 30, min: 23 },
  ];
  const shizuokaDays = [
    { date: "6/28", day: "土", telop: "くもり", max: 29, min: 23 },
    { date: "6/29", day: "日", telop: "晴れ", max: 31, min: 24 },
    { date: "6/30", day: "月", telop: "晴れ", max: 33, min: 25 },
    { date: "7/1", day: "火", telop: "くもり", max: 32, min: 25 },
    { date: "7/2", day: "水", telop: "雨", max: 30, min: 24 },
    { date: "7/3", day: "木", telop: "晴れ", max: 34, min: 25 },
    { date: "7/4", day: "金", telop: "くもり", max: 31, min: 24 },
  ];
  renderWeatherDays("weatherYaizuList", yaizuDays);
  renderWeatherDays("weatherShizuokaList", shizuokaDays);
  const updated = document.getElementById("weatherUpdated");
  if (updated) updated.textContent = "天気情報を取得できない場合はサンプル表示になります。";
  const summary = document.getElementById("headerWeatherSummary");
  if (summary) summary.textContent = "焼津市/静岡市 7日予報（サンプル）";
}

function simplifyTelop(telop) {
  if (typeof telop === "number") {
    if ([95, 96, 99].includes(telop)) return "雷雨";
    if ([61, 63, 65, 80, 81, 82].includes(telop)) return "雨";
    if ([71, 73, 75, 77].includes(telop)) return "雪";
    if ([0, 1].includes(telop)) return "晴";
    if ([2, 3, 45, 48].includes(telop)) return "くもり";
    return "情報";
  }
  if (telop.includes("雷")) return "雷雨";
  if (telop.includes("雨")) return "雨";
  if (telop.includes("雪")) return "雪";
  if (telop.includes("晴")) return "晴";
  if (telop.includes("くも") || telop.includes("曇")) return "くもり";
  return "情報";
}

function renderWeatherDays(targetId, days) {
  const wrap = document.getElementById(targetId);
  if (!wrap) return;
  wrap.innerHTML = days.slice(0, 7).map((item) => {
    const shortText = simplifyTelop(item.telop ?? item.weatherCode);
    const hi = Number.isFinite(Number(item.max)) ? `${Math.round(Number(item.max))}℃` : "--";
    const lo = Number.isFinite(Number(item.min)) ? `${Math.round(Number(item.min))}℃` : "--";
    return `
      <div class="weather-day">
        <div class="weather-day-label">${item.day}</div>
        <span class="weather-icon">${weatherIcon(item.telop ?? item.weatherCode)}</span>
        <div class="weather-day-caption">${shortText}</div>
        <div class="weather-temp"><span class="weather-hi">H ${hi}</span><span class="weather-lo">L ${lo}</span></div>
      </div>
    `;
  }).join("");
}

async function loadCityForecast(city) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Asia%2FTokyo&forecast_days=7`;
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error(`weather fetch failed: ${city.name}`);
  const data = await response.json();
  const daily = data?.daily;
  if (!daily || !Array.isArray(daily.time)) throw new Error(`invalid weather data: ${city.name}`);

  return daily.time.map((time, index) => {
    const date = new Date(time);
    return {
      day: WEEKDAYS[date.getDay()],
      weatherCode: daily.weather_code?.[index],
      max: daily.temperature_2m_max?.[index],
      min: daily.temperature_2m_min?.[index],
    };
  });
}

async function loadJmaWeather() {
  const updated = document.getElementById("weatherUpdated");
  const summary = document.getElementById("headerWeatherSummary");
  const cities = [
    { name: "焼津市", lat: 34.8667, lon: 138.3167, targetId: "weatherYaizuList" },
    { name: "静岡市", lat: 34.9756, lon: 138.3828, targetId: "weatherShizuokaList" },
  ];

  try {
    const results = await Promise.all(cities.map((city) => loadCityForecast(city)));
    results.forEach((days, index) => {
      renderWeatherDays(cities[index].targetId, days);
    });

    if (summary) {
      const yaizuToday = results[0]?.[0];
      const shizuokaToday = results[1]?.[0];
      summary.textContent = `焼津 ${simplifyTelop(yaizuToday?.weatherCode)} / 静岡 ${simplifyTelop(shizuokaToday?.weatherCode)}`;
    }
    if (updated) updated.textContent = `公開天気データ / 最終更新 ${formatDate(new Date())} ${nowTime()}`;
  } catch (error) {
    renderWeatherFallback();
  }
}

function initNoticeList() {
  const list = document.getElementById("noticeList");
  if (!list) return;
  const items = Array.from(list.querySelectorAll("li")).filter((li) => !li.classList.contains("empty-state"));
  if (items.length === 0) {
    list.innerHTML = '<li class="empty-state">現在お知らせはありません</li>';
  }
}

function disablePlaceholderLinks() {
  document.querySelectorAll('a[href="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      event.preventDefault();
    });
    anchor.setAttribute("aria-disabled", "true");
    anchor.classList.add("disabled-link");
  });
}

function codeToTelop(code) {
  const map = {
    "100": "晴れ",
    "101": "晴れ時々くもり",
    "110": "晴れのちくもり",
    "200": "くもり",
    "201": "くもり時々晴れ",
    "210": "くもりのち晴れ",
    "300": "雨",
    "301": "雨時々晴れ",
    "302": "雨時々止む",
    "400": "雪",
  };
  return map[String(code)] || "";
}

document.addEventListener("DOMContentLoaded", () => {
  const savedCorrection = localStorage.getItem("paddock_correction_request");
  if (savedCorrection) {
    const correctionText = document.getElementById("correctionText");
    if (correctionText) correctionText.textContent = savedCorrection;
  }

  updateClock();
  setInterval(updateClock, 1000);
  loadJmaWeather();
  initNoticeList();
  disablePlaceholderLinks();
});
