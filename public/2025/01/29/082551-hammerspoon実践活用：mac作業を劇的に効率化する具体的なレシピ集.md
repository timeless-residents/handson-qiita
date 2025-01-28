---
title: Hammerspoon実践活用：Mac作業を劇的に効率化する具体的なレシピ集
tags:
  - Hammerspoon
  - Mac
  - 効率化
  - 自動化
  - Lua
  - ショートカット
  - クリップボード
  - ウィンドウ操作
  - 開発環境
private: false
updated_at: "'2025-01-28T23:25:51.207Z'"
id: null
organization_url_name: null
slide: false
ignorePublish: false
---

# Hammerspoon実践活用：Mac作業を劇的に効率化する具体的なレシピ集

この記事では、Macの作業効率を劇的に向上させるツール「Hammerspoon」の実践的な活用方法を、具体的なレシピ集としてご紹介します。Hammerspoonは、Luaスクリプトを使ってMacの様々な操作を自動化できる強力なツールです。この記事を読むことで、ウィンドウ操作、クリップボード拡張、アプリケーション操作の自動化といった、日々の作業を効率化するための具体的な方法を習得し、あなただけの快適な開発環境を構築できるようになります。

## 【基本編】Hammerspoon導入と設定：快適な開発環境構築の第一歩

まずはHammerspoonの導入と基本的な設定を行い、快適な開発環境を構築するための第一歩を踏み出しましょう。

### Hammerspoonのインストールと初期設定

1. 公式サイト([https://www.hammerspoon.org/](https://www.hammerspoon.org/))からHammerspoonをダウンロードし、インストールします。
2. アプリケーションを起動すると、メニューバーにHammerspoonのアイコンが表示されます。
3. 初回起動時には、アクセシビリティの許可を求められるので、システム環境設定で許可してください。

### `init.lua` の基本構造と設定ファイルの管理

Hammerspoonの設定は、`~/.hammerspoon/init.lua` というLuaスクリプトファイルに記述します。このファイルがHammerspoonの心臓部です。

```lua
-- 基本的な設定例
hs.hotkey.bind({"cmd", "shift"}, "r", function()
  hs.reload()
  hs.alert.show("Config Reloaded")
end)

-- 他の設定はここに記述
```

この例では、`cmd + shift + r` を押すと設定ファイルをリロードし、通知を表示する設定をしています。

設定ファイルは、テキストエディタで編集できます。設定を更新したら、Hammerspoonのメニューから「Reload Config」を選択するか、上記のショートカットでリロードしましょう。

### おすすめの拡張機能（Modules）紹介と導入方法

Hammerspoonには、様々な機能を拡張するモジュールが用意されています。以下にいくつかの例を紹介します。

- **hs.window:** ウィンドウ操作を制御するモジュール
- **hs.hotkey:** キーボードショートカットを定義するモジュール
- **hs.clipboard:** クリップボードを操作するモジュール
- **hs.application:** アプリケーションを操作するモジュール

これらのモジュールは、`init.lua` の先頭で以下のように読み込みます。

```lua
local window = require("hs.window")
local hotkey = require("hs.hotkey")
local clipboard = require("hs.clipboard")
local application = require("hs.application")
```

### 開発効率を上げるための基本設定例：ウィンドウ操作、アプリケーション起動

以下に、開発効率を上げるための基本的な設定例を示します。

```lua
-- ウィンドウを左半分に移動
hs.hotkey.bind({"cmd", "ctrl"}, "left", function()
  local win = hs.window.focusedWindow()
  local screen = win:screen()
  local rect = screen:frame()
  rect.w = rect.w / 2
  win:setFrame(rect)
end)

-- ウィンドウを右半分に移動
hs.hotkey.bind({"cmd", "ctrl"}, "right", function()
  local win = hs.window.focusedWindow()
  local screen = win:screen()
  local rect = screen:frame()
  rect.x = rect.x + rect.w / 2
  rect.w = rect.w / 2
  win:setFrame(rect)
end)

-- iTerm2を起動
hs.hotkey.bind({"cmd", "ctrl"}, "t", function()
  hs.application.launchOrFocus("iTerm2")
end)
```

これらの設定により、`cmd + ctrl + left/right` でウィンドウを左右にリサイズし、`cmd + ctrl + t` でiTerm2を起動できるようになります。

## 【実践編1】ウィンドウ操作を極める：キーボードだけでマルチディスプレイを制覇

Hammerspoonを使うことで、キーボードだけでウィンドウ操作を自在に行えるようになります。マルチディスプレイ環境でのウィンドウ配置を自動化し、作業効率を大幅に向上させましょう。

### ウィンドウ移動・リサイズをキーボードショートカットで実現

上記の基本設定例に加え、さらに詳細なウィンドウ操作を実装できます。

```lua
-- ウィンドウを最大化
hs.hotkey.bind({"cmd", "ctrl"}, "m", function()
  local win = hs.window.focusedWindow()
  win:maximize()
end)

-- ウィンドウを次のディスプレイに移動
hs.hotkey.bind({"cmd", "ctrl", "shift"}, "right", function()
  local win = hs.window.focusedWindow()
  local screen = win:screen()
  local nextScreen = screen:next()
  win:moveToScreen(nextScreen)
end)

-- ウィンドウを前のディスプレイに移動
hs.hotkey.bind({"cmd", "ctrl", "shift"}, "left", function()
  local win = hs.window.focusedWindow()
  local screen = win:screen()
  local prevScreen = screen:previous()
  win:moveToScreen(prevScreen)
end)
```

これらの設定で、`cmd + ctrl + m` でウィンドウを最大化、`cmd + ctrl + shift + right/left` でウィンドウを次の/前のディスプレイに移動できます。

### マルチディスプレイ環境でのウィンドウ配置を自動化

複数のディスプレイを使用している場合、ウィンドウを特定の場所に自動配置すると便利です。

```lua
-- 特定のアプリを特定のディスプレイに自動配置する
function auto_place_window(appName, screenNum, x, y, w, h)
  hs.application.watcher.new(appName, function(app, event)
    if event == hs.application.watcher.launched then
      hs.timer.doAfter(0.1, function()
        local win = app:mainWindow()
        local screen = hs.screen.allScreens()[screenNum]
        win:moveToScreen(screen)
        win:setFrame({x=x, y=y, w=w, h=h})
      end)
    end
  end):start()
end

auto_place_window("iTerm2", 1, 0, 0, 800, 600) -- iTerm2を1番目のディスプレイの左上に配置
auto_place_window("Google Chrome", 2, 100, 100, 1000, 800) -- Chromeを2番目のディスプレイの少しずらした位置に配置
```

この例では、`iTerm2`を1番目のディスプレイの左上に、`Google Chrome`を2番目のディスプレイの少しずらした位置に自動配置しています。

### 仮想デスクトップとの連携：ワークスペースをスムーズに切り替え

仮想デスクトップとの連携も可能です。例えば、特定のアプリケーションを特定のデスクトップに表示させることもできます。

```lua
-- 特定のアプリを特定のデスクトップに表示する
function auto_move_to_space(appName, spaceNum)
  hs.application.watcher.new(appName, function(app, event)
    if event == hs.application.watcher.launched then
      hs.timer.doAfter(0.1, function()
        local win = app:mainWindow()
        win:moveToSpace(spaceNum)
      end)
    end
  end):start()
end

auto_move_to_space("iTerm2", 1) -- iTerm2を1番目のデスクトップに移動
auto_move_to_space("Google Chrome", 2) -- Chromeを2番目のデスクトップに移動
```

この設定で、`iTerm2`は1番目のデスクトップ、`Google Chrome`は2番目のデスクトップに自動的に表示されます。

### 注意点：ディスプレイ設定との競合、ショートカットの重複回避

- ディスプレイ設定との競合：Hammerspoonのウィンドウ操作設定と、macOSのウィンドウ操作設定が競合する場合があります。必要に応じて、macOSの設定を変更してください。
- ショートカットの重複回避：他のアプリケーションで使用しているショートカットと重複しないように注意してください。

## 【実践編2】クリップボード拡張：コピペ作業を爆速化する

Hammerspoonのクリップボード拡張機能を使うことで、コピペ作業を大幅に効率化できます。

### クリップボード履歴管理：過去のコピー内容を瞬時に呼び出す

クリップボードの履歴を管理することで、過去にコピーした内容を瞬時に呼び出せるようになります。

```lua
local clipboardHistory = {}
local historySize = 20

-- クリップボードの内容を履歴に追加
hs.clipboard.setWatcher(function(text)
  if text then
    table.insert(clipboardHistory, 1, text)
    if #clipboardHistory > historySize then
      table.remove(clipboardHistory)
    end
  end
end)

-- クリップボード履歴をGUIで表示
hs.hotkey.bind({"cmd", "shift"}, "v", function()
  local menu = hs.menubar.new()
  for i, text in ipairs(clipboardHistory) do
    menu:addMenuItem(string.sub(text, 1, 50) .. (string.len(text) > 50 and "..." or ""), function()
      hs.clipboard.setContents(text)
    end)
  end
  menu:show()
end)
```

この設定では、クリップボードの内容が履歴に保存され、`cmd + shift + v` で履歴をGUIメニューで表示し、選択した内容をクリップボードにセットできます。

### クリップボードへのテキスト加工：不要な改行削除、HTMLエンティティ変換

クリップボードにコピーしたテキストを加工することも可能です。

```lua
-- クリップボードの改行を削除
hs.hotkey.bind({"cmd", "shift"}, "n", function()
  local text = hs.clipboard.getContents()
  if text then
    local processedText = string.gsub(text, "\n", "")
    hs.clipboard.setContents(processedText)
  end
end)

-- クリップボードのHTMLエンティティをデコード
function decode_html_entities(text)
  text = string.gsub(text, "&quot;", "\"")
  text = string.gsub(text, "&apos;", "'")
  text = string.gsub(text, "&lt;", "<")
  text = string.gsub(text, "&gt;", ">")
  text = string.gsub(text, "&amp;", "&")
  return text
end

hs.hotkey.bind({"cmd", "shift"}, "h", function()
  local text = hs.clipboard.getContents()
  if text then
    local processedText = decode_html_entities(text)
    hs.clipboard.setContents(processedText)
  end
end)
```

`cmd + shift + n` でクリップボードの改行を削除、`cmd + shift + h` でHTMLエンティティをデコードできます。

### スニペット機能：定型文をショートカットで入力

スニペット機能を使うことで、定型文をショートカットで入力できます。

```lua
local snippets = {
  email = "your_email@example.com",
  address = "Your Address, City, State",
  sig = "Best regards,\nYour Name"
}

for key, value in pairs(snippets) do
  hs.hotkey.bind({"cmd", "ctrl"}, key, function()
    hs.paste(value)
  end)
end
```

この設定では、`cmd + ctrl + email` でメールアドレス、`cmd + ctrl + address` で住所、`cmd + ctrl + sig` で署名が入力されます。

### 注意点：セキュリティに関する考慮、クリップボードデータの扱い

- セキュリティに関する考慮：クリップボードには機密情報が含まれる可能性があります。クリップボード履歴を保存する際は、セキュリティに十分注意してください。
- クリップボードデータの扱い：クリップボードの内容を加工する際は、意図しないデータの変更がないか確認してください。

## 【実践編3】アプリケーション操作の自動化：ルーチンワークから解放される

Hammerspoonを使ってアプリケーション操作を自動化することで、ルーチンワークから解放され、よりクリエイティブな作業に集中できるようになります。

### アプリケーション起動・終了・切り替えをキーボードで操作

アプリケーションの起動、終了、切り替えをキーボードショートカットで操作できます。

```lua
-- アプリケーションを起動
hs.hotkey.bind({"cmd", "ctrl"}, "g", function()
  hs.application.launchOrFocus("Google Chrome")
end)

-- アプリケーションを終了
hs.hotkey.bind({"cmd", "ctrl", "shift"}, "g", function()
  local app = hs.application.get("Google Chrome")
  if app then
    app:kill()
  end
end)

-- アプリケーションを切り替え
hs.hotkey.bind({"cmd", "ctrl"}, "tab", function()
  hs.application.switchToNext()
end)
```

`cmd + ctrl + g` でGoogle Chromeを起動、`cmd + ctrl + shift + g` でGoogle Chromeを終了、`cmd + ctrl + tab` で次のアプリケーションに切り替えられます。

### アプリケーション固有の操作を自動化：ブラウザ操作、ターミナル操作

アプリケーション固有の操作も自動化できます。

```lua
-- Chromeで新しいタブを開く
hs.hotkey.bind({"cmd", "ctrl"}, "n", function()
  local chrome = hs.application.get("Google Chrome")
  if chrome then
    chrome:activate()
    hs.eventtap.keyStroke({"cmd"}, "t")
  end
end)

-- iTerm2で新しいタブを開く
hs.hotkey.bind({"cmd", "ctrl", "shift"}, "n", function()
  local iterm = hs.application.get("iTerm2")
  if iterm then
    iterm:activate()
    hs.eventtap.keyStroke({"cmd"}, "t")
  end
end)
```

`cmd + ctrl + n` でChromeで新しいタブを開き、`cmd + ctrl + shift + n` でiTerm2で新しいタブを開きます。

### 特定のアプリで特定のショートカットを無効化/有効化

特定のアプリケーションで特定のショートカットを無効化/有効化することも可能です。

```lua
-- iTerm2でcmd+wを無効化
local itermDisable = hs.hotkey.new({"cmd"}, "w", nil)
hs.application.watcher.new("iTerm2", function(app, event)
  if event == hs.application.watcher.focused then
    itermDisable:disable()
  elseif event == hs.application.watcher.unfocused then
    itermDisable:enable()
  end
end):start()
```

この設定では、iTerm2がアクティブな間は`cmd + w` が無効化されます。

### 注意点：アプリのバージョンアップによる動作不良、APIの変更

- アプリのバージョンアップによる動作不良：アプリケーションのバージョンアップにより、Hammerspoonのスクリプトが動作しなくなる場合があります。必要に応じてスクリプトを修正してください。
- APIの変更：HammerspoonのAPIが変更された場合、スクリプトの修正が必要になる場合があります。

## 【応用編】カスタマイズの深化：自分だけの快適環境を構築

Hammerspoonを使いこなすためには、Lua言語の基礎知識があると便利です。

### Lua言語の基礎：Hammerspoonを使いこなすための最低限の知識

- 変数、データ型（数値、文字列、テーブル）
- 条件分岐 (if, else, elseif)
- 繰り返し (for, while)
- 関数
- モジュールの利用

Lua言語の基礎を学ぶことで、より高度な自動化を実現できます。

### 独自の機能実装：より高度な自動化に挑戦

Lua言語の知識を活かして、独自の機能を実装してみましょう。例えば、特定のWebサイトを自動で開く、特定のファイルを自動で開く、といった自動化も可能です。

### 設定ファイルのバージョン管理：Gitを使ったバックアップと共有

`init.lua` は重要な設定ファイルなので、Gitを使ってバージョン管理することをおすすめします。

1.  `~/.hammerspoon` ディレクトリをGitリポジトリとして初期化します。
2.  `init.lua` をコミットします。
3.  GitHubなどのリモートリポジトリにプッシュします。

これにより、設定ファイルのバックアップや、他の環境への共有が容易になります。

## 【トラブルシューティングとQ&A】よくある問題とその解決策

Hammerspoonを使用する上でよくある問題とその解決策を紹介します。

### Hammerspoonが動作しない場合の対処法

- アクセシビリティの許可を確認してください。
- `init.lua` に構文エラーがないか確認してください。
- Hammerspoonを再起動してみてください。

### ショートカットキーが競合する場合の解決策

- 他のアプリケーションで使用していないショートカットキーを使用してください。
- Hammerspoonの設定で、競合しているショートカットキーを無効化してください。

### 設定ファイルが読み込まれない場合の対処法

- `init.lua` のパスが正しいか確認してください。
- `init.lua` に構文エラーがないか確認してください。
- Hammerspoonを再起動してみてください。

### よくある質問とその回答

- Q: Hammerspoonは安全ですか？
  - A: Hammerspoonはオープンソースのソフトウェアであり、安全に利用できます。ただし、クリップボードの履歴を保存する際は、セキュリティに注意してください。
- Q: Hammerspoonの設定は難しいですか？
  - A: Lua言語の知識があると便利ですが、基本的な設定は簡単にできます。この記事を参考に、少しずつ設定をカスタマイズしてみてください。

### コミュニティリソースの紹介：情報収集と問題解決のヒント

- 公式ドキュメント: [https://www.hammerspoon.org/docs/](https://www.hammerspoon.org/docs/)
- GitHubリポジトリ: [https://github.com/Hammerspoon/hammerspoon](https://github.com/Hammerspoon/hammerspoon)
- コミュニティフォーラム: [https://groups.google.com/forum/#!forum/hammerspoon](https://groups.google.com/forum/#!forum/hammerspoon)

これらのリソースを活用して、Hammerspoonに関する情報を収集し、問題解決に役立ててください。

この記事が、あなたのMac作業効率向上の一助となれば幸いです。
