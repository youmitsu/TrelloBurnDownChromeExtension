![versionBadge](https://img.shields.io/badge/latest-v0.1.6-green.svg)

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

1. 以下のURLからTrelloのAPIKEYを取得

https://trello.com/app-key/

2. 以下のURLからTrelloのTokenを取得

https://trello.com/1/authorize?expiration=never&name=&scope=read,write&response_type=token&key={1で取得したAPIKEY}

3. 本プラグインを開き、「Setting」をクリック

  1. 【Backend Settings】ServerURLを入力

  2. 【Trello Authenrication】1で取得したAPIKEYは「Key」に入力。2で取得したTokenは「Token」に入力。
※Token及びKeyは送信時に暗号化されます。

  3. 登録を押下

4. HOMEに遷移後Settingで有効にしたいボードの「Register」ボタンを押し、データの保存を有効化する

5. HOMEからグラフ設定値の変更を押下し、以下を入力

  1. ボードを選択

  2. 開始日と終了日を入力

  3. (土日以外の休日があれば)休日をカンマ区切りで入力(形式: YYYY/MM/DD)

6. メニューバーの更新アイコンを押下

7. グラフが表示される

### 2回目以降

1. 前回入力したデータがLocalStorageに保存されており、その値が適用される

2. 修正したい場合は初回の場合と同様にパラメータを入力
