# PADDOCK Design System v1.0

**Version:** 1.0
**Project:** PADDOCK Portal
**Status:** Official Development Standard

---

# 1. Design Philosophy

## Purpose

PADDOCK Portalは、PADDOCK GROUPの社員が毎朝最初に開く社内ポータルである。

単なる業務システムではなく、

* 仕事を始める
* 学ぶ
* 情報を共有する
* 仲間とつながる

ためのプラットフォームとして設計する。

すべての画面は

**「迷わない・見やすい・毎日使いたくなる」**

ことを最優先とする。

---

# Core Concept

Portalは情報を管理するためではなく、

社員が気持ちよく一日を始められる場所である。

そのため、

情報量よりも

情報整理を重視する。

機能よりも

使いやすさを優先する。

---

# Design Keywords

* Simple
* Clean
* Premium
* Comfortable
* Friendly
* Professional
* PADDOCK Brand

---

# UI Philosophy

余白を大切にする。

文字を詰め込み過ぎない。

色を使い過ぎない。

カードで情報を整理する。

迷わせない導線を作る。

---

# Portal HOME

Portal HOMEは

社員が毎朝確認するダッシュボードである。

最初に確認できる情報は

・今日の社長からのひとこと

・勤怠

・Googleカレンダー

・お知らせ

・目標

・通知

・天気

・記念日

とする。

Portal HOMEだけで

今日必要な情報を把握できる設計を目指す。

---

# Academy

Academyは

社員が成長する場所である。

Portalより少し落ち着いたデザインを採用する。

講座へ集中できることを最優先とする。

学習ページと理解度テストは分離する。

講座の最後に

「既読にする」

ボタンを設置し、

既読後に理解度テストへ進める設計とする。

---

# Admin

管理画面は

社長・マネージャー・経理が利用する。

情報量は多くても、

一目で会社の状況が把握できるレイアウトを採用する。

---

# My Page

社員自身の情報を管理する画面。

表示内容

・プロフィール

・所属

・入社日

・勤続年数

・今年の目標

・今月の目標

・保有資格

・資格更新日

・家族・大切な人

・ログアウト

---

# Brand Identity

Portal

Academy

管理画面

すべて

PADDOCK GROUP

という一つのブランドで統一する。

画面の役割は違っても、

世界観は統一する。

---

# Development Goal

社員が

「毎日開きたい」

と思えるPortalを作る。

学びたくなるAcademyを作る。

管理しやすい管理画面を作る。

PADDOCK GROUP専用の業務プラットフォームとして、

長く使える品質を目指す。

# 2. Component Library

## Purpose

すべての画面で同じコンポーネントを使用する。

Portal・Academy・管理画面・マイページでデザインを統一する。

新しい画面を追加する場合も、本章のコンポーネントを再利用すること。

---

# Card

Portalの基本UI。

すべての情報はカード単位で表示する。

## Rule

・背景：White

・Border：薄いグレー

・角丸：16px

・Padding：24px

・影：非常に薄い

・カード高さは可能な限り統一する

・タイトルは左上固定

・本文は読みやすい余白を確保する

---

# Attendance Card

Portal HOME専用。

表示内容

・出勤

・外出

・戻り

・退勤

・勤務時間

・リセット（テスト用）

勤務ボタンは大きくし過ぎず、

操作しやすさを優先する。

---

# Weather Card

Portal HOME専用。

表示

・焼津市

・静岡市

上下2段表示。

1週間天気。

コンパクトに表示する。

---

# Calendar Card

Googleカレンダー（月表示）

予定は

・休み

・イベント

・K会議

・D会議

・全体会議

を表示。

Googleカレンダーを開くボタンを配置する。

---

# Notice Card

新着順。

最大5件表示。

「すべて見る」を設置。

通知と連携する。

---

# Message Card

カードタイトル

「今日の社長からのひとこと」

Portal HOMEでは閲覧のみ。

管理画面から編集する。

カードは横長。

高さは控えめ。

---

# Goal Card

表示

・今年の目標

・今月の目標

Portal HOMEでは閲覧。

編集はマイページ。

管理者・マネージャーは管理画面から編集可能。

---

# Birthday Card

表示

・社員誕生日

・入社記念日

社員誕生日は当日のみ表示。

水曜日・木曜日の場合は金曜日表示。

---

# Academy Card

表示

・受講中講座

・受講状況

・Academyへ進むボタン

理解度テストは表示しない。

---

# Profile Card

右上固定。

表示

・フルネーム

・所属店舗

・役職

メニュー

・マイページ

・設定

・ログアウト

---

# Notification

右上ベルアイコン。

未読件数表示。

対象

・お知らせ

・承認

・Academy

・資格更新

・社員誕生日

・入社記念日

・家族誕生日（本人・社長・管理者）

---

# Sidebar

全ページ共通。

固定表示。

Portal HOME

スケジュール

休み申請

お知らせ

Academy

マイページ

各種申請

店舗情報

設定

現在のページは強調表示する。

---

# Header

全ページ共通。

表示内容

・PADDOCKロゴ

・ページタイトル

・現在時刻（秒表示）

・通知

・プロフィール

Headerは固定表示とする。

---

# Footer

Version表示のみ。

余計な情報は表示しない。

Portal Version 1.0
