# Trello Burndown Chrome Extension

## What's this

This repository is a tool which shows Burndown chart for Trello. This is a Google Chrome Extension Plugin.

## Getting Started

1. Clone this repository.

このリポジトリをクローンしてください。

2. Open `chrome://extensions/` with Google Chrome.

`chrome://extensions/`をGoogleChromeで開いてください。

3. Click "Read the extension that is not packaged" and select `TrelloBurnDownChromeExtension/src/`

パッケージ化されていない拡張機能を読み込むをクリックし、`TrelloBurnDownChromeExtension/src/`のディレクトリを選択。

4. You are Ready to use this tool!

準備完了です！

## How to use

右上のアイコンをクリックすると、ポップアップウィンドウが表示されます。

### 初回

1. 開始日と終了日を入力

2. (土日以外の休日があれば)休日をカンマ区切りで入力(形式: YYYY/MM/DD)

3. Showをクリック

4. グラフが表示される

### 2回目以降

1. 前回入力したデータがLocalStorageに保存されており、その値が適用される

2. 修正したい場合は初回の場合と同様にパラメータを入力
