(function () {
  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function refreshIcons() {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }
  }

  class PortalLayout extends HTMLElement {
    connectedCallback() {
      this.classList.add("portal-layout");
    }
  }

  class PageContainer extends HTMLElement {
    connectedCallback() {
      this.classList.add("page-container");
    }
  }

  class Sidebar extends HTMLElement {
    connectedCallback() {
      if (this.dataset.rendered === "true") return;
      this.classList.add("portal-sidebar");
      const version = escapeHtml(this.getAttribute("version") || "Portal v1.0");
      this.innerHTML =
        '<div class="sidebar-brand">' +
        '<img src="assets/images/logos/paddock-logo.jpg" alt="PADDOCK" class="sidebar-logo" />' +
        "<p>GROUP PORTAL</p>" +
        "</div>" +
        '<nav class="sidebar-nav">' +
        '<a href="#portal" class="active"><i data-lucide="layout-dashboard"></i><span>Portal</span></a>' +
        '<a href="#attendance"><i data-lucide="clock-3"></i><span>勤怠</span></a>' +
        '<a href="#notice"><i data-lucide="bell"></i><span>お知らせ</span></a>' +
        '<a href="#events"><i data-lucide="calendar-days"></i><span>イベント</span></a>' +
        '<a href="#academy"><i data-lucide="graduation-cap"></i><span>Academy</span></a>' +
        '<a href="#mypage"><i data-lucide="user-round"></i><span>マイページ</span></a>' +
        '<a href="paddock-group-academy-main/admin.html"><i data-lucide="settings"></i><span>管理画面</span></a>' +
        "</nav>" +
        '<p class="sidebar-version">' + version + "</p>";
      this.dataset.rendered = "true";
      refreshIcons();
    }
  }

  class Header extends HTMLElement {
    connectedCallback() {
      if (this.dataset.rendered === "true") return;
      this.classList.add("portal-header");
      const name = escapeHtml(this.getAttribute("name") || "飯塚さん");
      const team = escapeHtml(this.getAttribute("team") || "Kawasaki Plaza 焼津");
      this.innerHTML =
        '<div class="header-left">' +
        '<h1><span id="greetingText">こんにちは。</span> <span id="greetingName">' + name + "</span></h1>" +
        '<p id="serviceMessage">今日もお客様へ笑顔で最高のおもてなしを。</p>' +
        "</div>" +
        '<div class="header-right">' +
        '<div class="header-time">' +
        '<strong id="currentTime">--:--:--</strong>' +
        '<span id="currentDate">----年--月--日（--）</span>' +
        "</div>" +
        '<div class="header-weather-summary">' +
        '<p>週間天気</p>' +
        '<a href="#weather" id="headerWeatherSummary">静岡県の予報を表示</a>' +
        "</div>" +
        '<div class="profile-chip" id="mypage">' +
        '<span class="profile-icon"><i data-lucide="user-round"></i></span>' +
        "<div>" +
        "<strong>" + name + "</strong>" +
        "<span>" + team + "</span>" +
        "</div>" +
        "</div>" +
        "</div>";
      this.dataset.rendered = "true";
      refreshIcons();
    }
  }

  class WelcomeCard extends HTMLElement {
    connectedCallback() {
      if (this.dataset.rendered === "true") return;
      this.classList.add("hero-panel", "panel-card");
      const kicker = escapeHtml(this.getAttribute("kicker") || "PADDOCK GROUP PORTAL");
      const greeting = escapeHtml(this.getAttribute("greeting") || "こんにちは。");
      const name = escapeHtml(this.getAttribute("name") || "飯塚さん");
      const message = escapeHtml(this.getAttribute("message") || "今日もお客様へ笑顔で最高のおもてなしを。");
      this.innerHTML =
        '<p class="hero-kicker">' + kicker + "</p>" +
        '<h1><span id="greetingText">' + greeting + '</span> <span id="greetingName">' + name + "</span></h1>" +
        '<p class="hero-note" id="serviceMessage">' + message + "</p>";
      this.dataset.rendered = "true";
    }
  }

  class ClockCard extends HTMLElement {
    connectedCallback() {
      if (this.dataset.rendered === "true") return;
      this.classList.add("tool-card", "time-tool");
      this.innerHTML =
        "<p>現在時刻</p>" +
        '<strong id="currentTime">--:--:--</strong>' +
        '<span id="currentDate">----年--月--日（--）</span>';
      this.dataset.rendered = "true";
    }
  }

  class WeatherCard extends HTMLElement {
    connectedCallback() {
      if (this.dataset.rendered === "true") return;
      this.classList.add("panel-card", "weather-tool");
      this.id = this.id || "weather";
      this.innerHTML =
        '<header class="panel-head weather-head">' +
        "<h3>週間天気</h3>" +
        '<a href="https://www.jma.go.jp/bosai/forecast/" target="_blank" rel="noopener">公開データ ↗</a>' +
        "</header>" +
        '<div class="weather-region-group" aria-live="polite">' +
        '<section class="weather-region-block">' +
        '<div class="weather-region-head"><p>焼津市</p></div>' +
        '<div id="weatherYaizuList" class="weather-list" aria-label="焼津市7日予報">' +
        '<div class="weather-loading">読み込み中...</div>' +
        "</div>" +
        "</section>" +
        '<section class="weather-region-block">' +
        '<div class="weather-region-head"><p>静岡市</p></div>' +
        '<div id="weatherShizuokaList" class="weather-list" aria-label="静岡市7日予報">' +
        '<div class="weather-loading">読み込み中...</div>' +
        "</div>" +
        "</section>" +
        "</div>" +
        '<p id="weatherUpdated" class="weather-updated">気象庁データ / 更新情報なし</p>';
      this.dataset.rendered = "true";
    }
  }

  class DailyMessageCard extends HTMLElement {
    connectedCallback() {
      if (this.dataset.rendered === "true") return;
      this.classList.add("panel-card", "daily-message-card");
      this.id = this.id || "daily-message";
      this.innerHTML =
        '<header class="panel-head">' +
        "<h3>今日のひとこと</h3>" +
        '<a href="paddock-group-academy-main/portal-settings.html">Portal設定 ›</a>' +
        "</header>" +
        '<p id="dailyMessage" class="daily-message-text">管理画面のPortal設定からメッセージを登録してください。</p>' +
        '<p class="daily-message-note">社長メッセージは管理画面から毎朝更新できます。</p>';
      this.dataset.rendered = "true";
    }
  }

  class AttendanceCard extends HTMLElement {
    connectedCallback() {
      if (this.dataset.rendered === "true") return;
      const devResetEnabled = this.getAttribute("dev-reset") !== "off";
      this.classList.add("panel-card", "attendance-card");
      this.id = this.id || "attendance";
      this.innerHTML =
        '<header class="card-head">' +
        "<div>" +
        '<p class="mini-kicker">ATTENDANCE</p>' +
        "<h2>本日の勤務状況</h2>" +
        "</div>" +
        '<span id="workStatus" class="status-badge">未打刻</span>' +
        "</header>" +
        '<div class="attendance-actions">' +
        '<primary-button class="btn-start" icon="log-in" text="出勤" onclickfn="clockIn"></primary-button>' +
        '<primary-button class="btn-break" icon="person-standing" text="外出" onclickfn="openBreakModal"></primary-button>' +
        '<primary-button class="btn-return" icon="undo-2" text="戻り" onclickfn="returnFromBreak"></primary-button>' +
        '<primary-button class="btn-end" icon="log-out" text="退勤" onclickfn="clockOut"></primary-button>' +
        "</div>" +
        '<div class="time-summary">' +
        "<div><span>出勤時刻</span><strong id=\"clockInTime\">--:--:--</strong><em id=\"clockInLabel\">未打刻</em></div>" +
        "<div><span>外出時刻</span><strong id=\"breakOutTime\">--:--:--</strong><em id=\"breakOutLabel\">未外出</em></div>" +
        "<div><span>戻り時刻</span><strong id=\"breakReturnTime\">--:--:--</strong><em id=\"breakReturnLabel\">未戻り</em></div>" +
        "<div><span>退勤時刻</span><strong id=\"clockOutTime\">--:--:--</strong><em id=\"clockOutLabel\">未退勤</em></div>" +
        "<div><span>勤務時間</span><strong id=\"workDuration\">00時間00分00秒</strong><em id=\"workDurationLabel\">未確定</em></div>" +
        "</div>" +
        '<div id="breakStatusInfo" class="attendance-break-info" aria-live="polite"></div>' +
        '<div class="attendance-footer-actions">' +
        '<button type="button" class="link-button" onclick="openCorrection()">訂正申請をする ›</button>' +
        // DEV ONLY: Set <attendance-card dev-reset="off"></attendance-card> to hide in production.
        (devResetEnabled ? '<button type="button" class="dev-reset-button" onclick="resetDemo()">勤務状況をリセット</button>' : "") +
        "</div>";
      this.dataset.rendered = "true";
    }
  }

  class AnnouncementCard extends HTMLElement {
    connectedCallback() {
      if (this.dataset.rendered === "true") return;
      this.classList.add("panel-card", "notice-card");
      this.id = this.id || "notice";
      this.innerHTML =
        '<header class="panel-head">' +
        "<h3>お知らせ</h3>" +
        '<a href="#notice">すべて見る ›</a>' +
        "</header>" +
        '<ul id="noticeList" class="notice-list">' +
        "<li><time>07/01</time><div class=\"notice-body\"><strong><a href=\"#notice\">Portal Version 1.0 開発開始</a></strong><span class=\"tag tag-important\">重要</span></div><a href=\"#notice\" class=\"notice-link\" aria-label=\"詳細を見る\">›</a></li>" +
        "<li><time>07/05</time><div class=\"notice-body\"><strong><a href=\"#notice\">共通教育コンテンツ更新予定</a></strong></div><a href=\"#notice\" class=\"notice-link\" aria-label=\"詳細を見る\">›</a></li>" +
        "<li><time>07/12</time><div class=\"notice-body\"><strong><a href=\"#notice\">全体ミーティング資料を公開予定</a></strong></div><a href=\"#notice\" class=\"notice-link\" aria-label=\"詳細を見る\">›</a></li>" +
        "</ul>";
      this.dataset.rendered = "true";
    }
  }

  class EventCard extends HTMLElement {
    connectedCallback() {
      if (this.dataset.rendered === "true") return;
      this.classList.add("panel-card", "event-card");
      this.id = this.id || "events";
      this.innerHTML =
        '<header class="panel-head">' +
        "<h3>イベント</h3>" +
        '<a href="#events">予定一覧 ›</a>' +
        "</header>" +
        '<div class="event-list">' +
        '<article class="event-item"><p class="event-title">PADDOCK GROUP BBQ</p><div class="event-meta"><span><i data-lucide="calendar-days"></i>07/12（土）</span><span><i data-lucide="clock-3"></i>11:00-15:00</span><span><i data-lucide="map-pin"></i>焼津シーサイド会場</span></div></article>' +
        '<article class="event-item"><p class="event-title">Ninja 試乗会</p><div class="event-meta"><span><i data-lucide="calendar-days"></i>07/20（日）</span><span><i data-lucide="clock-3"></i>10:00-16:00</span><span><i data-lucide="map-pin"></i>Kawasaki Plaza 焼津</span></div></article>' +
        '<article class="event-item"><p class="event-title">Ducati Test Ride Day</p><div class="event-meta"><span><i data-lucide="calendar-days"></i>08/03（日）</span><span><i data-lucide="clock-3"></i>09:30-15:30</span><span><i data-lucide="map-pin"></i>Ducati 静岡</span></div></article>' +
        "</div>";
      this.dataset.rendered = "true";
      refreshIcons();
    }
  }

  class AcademyCard extends HTMLElement {
    connectedCallback() {
      if (this.dataset.rendered === "true") return;
      const href = escapeHtml(this.getAttribute("href") || "paddock-group-academy-main/welcome.html");
      this.classList.add("portal-menu-only");
      this.id = this.id || "academy";
      this.innerHTML =
        '<a href="' + href + '" class="academy-entry-card">' +
        '<img class="academy-thumb" src="assets/images/paddock-top.jpg" alt="Academy" />' +
        "<div><h3>Academy</h3><p>学びで、未来の自分をつくる。</p><span class=\"academy-cta\">Academyへ進む</span></div>" +
        '<span class="card-arrow">›</span>' +
        "</a>";
      this.dataset.rendered = "true";
      refreshIcons();
    }
  }

  class PrimaryButton extends HTMLElement {
    connectedCallback() {
      if (this.dataset.rendered === "true") return;
      const text = escapeHtml(this.getAttribute("text") || this.textContent.trim() || "Button");
      const className = escapeHtml(this.getAttribute("class") || "");
      const onClickFn = escapeHtml(this.getAttribute("onclickfn") || "");
      const icon = escapeHtml(this.getAttribute("icon") || "");
      this.innerHTML = '<button type="button" class="btn ' + className + '"' + (onClickFn ? ' onclick="' + onClickFn + '()"' : "") + '>' + (icon ? '<i data-lucide="' + icon + '"></i>' : "") + '<span>' + text + "</span></button>";
      this.dataset.rendered = "true";
      refreshIcons();
    }
  }

  class SecondaryButton extends HTMLElement {
    connectedCallback() {
      if (this.dataset.rendered === "true") return;
      const text = escapeHtml(this.getAttribute("text") || this.textContent.trim() || "Button");
      const className = escapeHtml(this.getAttribute("class") || "");
      const href = this.getAttribute("href");
      if (href) {
        this.innerHTML = '<a class="secondary-btn ' + className + '" href="' + escapeHtml(href) + '">' + text + "</a>";
      } else {
        this.innerHTML = '<button type="button" class="secondary-btn ' + className + '">' + text + "</button>";
      }
      this.dataset.rendered = "true";
    }
  }

  class StatusBadge extends HTMLElement {
    connectedCallback() {
      if (this.dataset.rendered === "true") return;
      const text = escapeHtml(this.getAttribute("text") || this.textContent.trim() || "-");
      const id = this.getAttribute("id") ? ' id="' + escapeHtml(this.getAttribute("id")) + '"' : "";
      this.innerHTML = '<span class="status-badge"' + id + ">" + text + "</span>";
      this.dataset.rendered = "true";
    }
  }

  class GlassCard extends HTMLElement {
    connectedCallback() {
      this.classList.add("panel-card", "glass-card");
    }
  }

  class InfoCard extends HTMLElement {
    connectedCallback() {
      this.classList.add("panel-card", "info-card");
    }
  }

  class SectionTitle extends HTMLElement {
    connectedCallback() {
      if (this.dataset.rendered === "true") return;
      const title = escapeHtml(this.getAttribute("title") || "");
      const subtitle = escapeHtml(this.getAttribute("subtitle") || "");
      this.innerHTML =
        '<div class="section-title-wrap">' +
        '<h2 class="section-title-main">' + title + "</h2>" +
        (subtitle ? '<p class="section-title-sub">' + subtitle + "</p>" : "") +
        "</div>";
      this.dataset.rendered = "true";
    }
  }

  const defs = [
    ["portal-layout", PortalLayout],
    ["page-container", PageContainer],
    ["portal-sidebar", Sidebar],
    ["portal-header", Header],
    ["welcome-card", WelcomeCard],
    ["clock-card", ClockCard],
    ["weather-card", WeatherCard],
    ["daily-message-card", DailyMessageCard],
    ["attendance-card", AttendanceCard],
    ["announcement-card", AnnouncementCard],
    ["event-card", EventCard],
    ["academy-card", AcademyCard],
    ["primary-button", PrimaryButton],
    ["secondary-button", SecondaryButton],
    ["status-badge", StatusBadge],
    ["glass-card", GlassCard],
    ["info-card", InfoCard],
    ["section-title", SectionTitle],
  ];

  defs.forEach(function (entry) {
    if (!customElements.get(entry[0])) {
      customElements.define(entry[0], entry[1]);
    }
  });

  window.PortalComponents = {
    refreshIcons: refreshIcons,
  };
})();
