# Portal Components

Portal HOME Version 1.0 RC の基準コンポーネントです。

## ファイル
- assets/components/portal-components.css
- assets/components/portal-components.js

## Layout
- portal-layout
- portal-sidebar
- portal-header
- page-container

## Dashboard
- weather-card
- attendance-card
- announcement-card
- event-card
- academy-card

## UI
- primary-button
- secondary-button
- status-badge
- glass-card
- info-card
- section-title

## 基本セット
```html
<link rel="stylesheet" href="assets/components/portal-components.css" />
<script src="https://unpkg.com/lucide@0.469.0/dist/umd/lucide.min.js" defer></script>
<script src="assets/components/portal-components.js" defer></script>
```

## 使用例
```html
<portal-layout>
  <portal-sidebar></portal-sidebar>
  <page-container>
    <portal-header name="飯塚さん" team="Kawasaki Plaza 焼津"></portal-header>
    <attendance-card></attendance-card>
    <section class="dashboard-two-col">
      <announcement-card></announcement-card>
      <weather-card></weather-card>
    </section>
    <academy-card href="paddock-group-academy-main/welcome.html"></academy-card>
    <event-card></event-card>
  </page-container>
</portal-layout>
```
