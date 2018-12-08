![versionBadge](https://img.shields.io/badge/latest-v0.1.6-green.svg)
[![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE)

# Trello Burndown Chrome Extension

## What's this

This repository is a tool which shows Burndown chart for Trello. This is a Google Chrome Extension Plugin.

## Getting Started

1. Clone this repository.

このリポジトリをクローンしてください。

2. Open `chrome://extensions/` with Google Chrome.

`chrome://extensions/`をGoogleChromeで開いてください。

3. Enable the `Developer Mode`.

ディベロッパーモードを有効にしてください。

4. Click "Read the extension that is not packaged" and select `TrelloBurnDownChromeExtension/src/`

パッケージ化されていない拡張機能を読み込むをクリックし、`TrelloBurnDownChromeExtension/src/`のディレクトリを選択。

5. You are Ready to use this tool!

準備完了です！

## How to use

右上のアイコンをクリックすると、ポップアップウィンドウが表示されます。

### 初回

1. 右上のボタンから設定画面を開いてください。

2. baseUrlを入力。(サーバー管理者の方に聞いてください)

3. Get the developer keyをクリックし、ApiKeyを入力フォームにコピペしてください

4. Get the token をクリックし、Tokenを入力フォームにコピペしてください

5. 「←」でグラフ画面に遷移後、HOMEからグラフの設定値の変更を押下し、以下を入力。

  1. ボードを選択

  2. 開始日と終了日を入力

  3. (土日以外の休日があれば)休日をカンマ区切りで入力(形式: YYYY/MM/DD)

6. メニューバーの更新アイコンを押下

7. グラフが表示される

### 2回目以降

1. 前回入力したデータがLocalStorageに保存されており、その値が適用される

2. 修正したい場合は初回の場合と同様にパラメータを入力
