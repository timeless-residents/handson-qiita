---
title: Hammerspoon実践活用：Mac作業効率を劇的に向上させる自動化レシピ集
tags:
  - Hammerspoon
  - Mac
  - 自動化
  - 効率化
  - Lua
  - 生産性向上
  - ショートカット
private: false
updated_at: 2025-01-28T22:45:48.722Z
id: null
organization_url_name: null
slide: false
ignorePublish: false
---

# Hammerspoon実践活用：Mac作業効率を劇的に向上させる自動化レシピ集

この記事では、Macの作業効率を劇的に向上させる自動化ツール「Hammerspoon」の実践的な活用方法を解説します。Hammerspoonは、Luaスクリプトを用いてMacの様々な操作を自動化できる強力なツールです。この記事を読むことで、日々の作業を効率化し、より快適なMacライフを送ることができるでしょう。

## 1. はじめに：Hammerspoonで実現できることと、なぜ今Hammerspoonなのか

Hammerspoonは、Macのシステムレベルの操作をLuaスクリプトで制御できる、非常に柔軟な自動化ツールです。ウィンドウ操作、クリップボード管理、アプリケーションの起動や操作、さらにはカスタムメニューやHUDの作成まで、幅広い自動化が可能です。

なぜ今Hammerspoonなのか？ MacにはAutomatorやショートカットアプリといった自動化ツールがありますが、Hammerspoonはそれらよりも高度なカスタマイズ性と柔軟性を提供します。プログラミングの知識が必要になるものの、その分、より複雑で高度な自動化を実現できます。特に、開発者や頻繁にMacを使うパワーユーザーにとって、Hammerspoonは手放せないツールとなるでしょう。

## 2. 必須設定：Hammerspoon導入と初期設定の最適化

Hammerspoonを使い始めるための基本的な設定について解説します。

### 2.1. インストールと設定ファイルの基本構造

Hammerspoonのインストールは公式サイトからdmgファイルをダウンロードして実行するだけです。

* [Hammerspoon 公式サイト](http://www.hammerspoon.org/)

インストール後、設定ファイルである `init.lua` を編集する必要があります。このファイルは、`~/.hammerspoon/init.lua` に配置されています。ファイルが存在しない場合は、自分で作成してください。`init.lua` は、Hammerspoonの起動時に実行されるLuaスクリプトです。

```lua
-- init.luaの例
hs.alert.show("Hammerspoon is loaded!")
```

### 2.2. Lua言語の基礎：Hammerspoonを使いこなすための最低限の知識

HammerspoonはLua言語で記述します。Lua言語の基本的な知識があると、より柔軟にHammerspoonを使いこなせます。ここでは、Hammerspoonでよく使うLuaの基本構文を紹介します。

*   **変数:** `local variable_name = value`
*   **関数:**
    ```lua
    local function function_name(parameter1, parameter2)
        -- 関数の処理
        return result
    end
    ```
*   **テーブル:** `local my_table = {key1 = "value1", key2 = "value2"}`
*   **条件分岐:**
    ```lua
    if condition then
        -- 処理
    elseif another_condition then
        -- 別の処理
    else
        -- それ以外の処理
    end
    ```
*   **ループ:**
    ```lua
    for i = 1, 10 do
        -- 処理
    end
    ```

これらの基本的な構文を理解することで、Hammerspoonのスクリプトを読み書きできるようになります。

### 2.3. 設定ファイルのリロードとデバッグ方法

設定ファイルを変更した後は、Hammerspoonを再起動するか、設定ファイルをリロードする必要があります。Hammerspoonのメニューバーアイコンから「Reload Config」を選択することで、設定ファイルがリロードされます。

デバッグには、Hammerspoonのコンソールを使用します。コンソールは、Hammerspoonのメニューバーアイコンから「Open Console」を選択することで開けます。`hs.alert.show()` や `print()` を使用して、変数の値や処理結果をコンソールに出力できます。

## 3. 実践レシピ1：ウィンドウ操作の自動化

ウィンドウ操作の自動化は、Hammerspoonの最も強力な機能の一つです。

### 3.1. ウィンドウのリサイズと移動をキーボードでコントロール

キーボードショートカットを使って、ウィンドウをリサイズしたり移動したりできます。

#### 3.1.1. 具体的なコード例：画面分割と最大化

以下のコードは、`Ctrl + Left` でウィンドウを左半分に、`Ctrl + Right` で右半分に、`Ctrl + Up` で最大化する例です。

```lua
local function moveWindow(direction)
  local win = hs.window.focusedWindow()
  if not win then return end

  local screen = win:screen()
  local frame = screen:frame()

  local newFrame = {}
  if direction == "left" then
    newFrame = {x = frame.x, y = frame.y, w = frame.w / 2, h = frame.h}
  elseif direction == "right" then
    newFrame = {x = frame.x + frame.w / 2, y = frame.y, w = frame.w / 2, h = frame.h}
  elseif direction == "max" then
    newFrame = frame
  end

  win:setFrame(newFrame)
end

hs.hotkey.bind({"ctrl"}, "left", function() moveWindow("left") end)
hs.hotkey.bind({"ctrl"}, "right", function() moveWindow("right") end)
hs.hotkey.bind({"ctrl"}, "up", function() moveWindow("max") end)
```

#### 3.1.2. 複数ディスプレイ環境でのウィンドウ操作

複数ディスプレイ環境でも、上記コードを少し変更するだけで、それぞれのディスプレイでウィンドウを操作できます。

```lua
local function moveWindowToNextScreen()
  local win = hs.window.focusedWindow()
  if not win then return end

  local currentScreen = win:screen()
  local nextScreen = currentScreen:next()
  if not nextScreen then
    nextScreen = hs.screen.allScreens()[1]
  end

  local currentFrame = win:frame()
  local nextFrame = nextScreen:frame()

  local newFrame = {
    x = nextFrame.x + (currentFrame.x - currentScreen:frame().x),
    y = nextFrame.y + (currentFrame.y - currentScreen:frame().y),
    w = currentFrame.w,
    h = currentFrame.h
  }
  win:setFrame(newFrame)
end

hs.hotkey.bind({"ctrl", "shift"}, "right", moveWindowToNextScreen)
```

### 3.2. アプリケーションごとのウィンドウ配置を記憶

アプリケーションごとにウィンドウの配置を記憶し、次に起動したときに同じ位置に表示させることができます。

#### 3.2.1. 具体的なコード例：特定のアプリを特定の場所に開く

```lua
local appWindowPositions = {
  ["iTerm2"] = {x = 0, y = 0, w = 800, h = 600},
  ["Google Chrome"] = {x = 800, y = 0, w = 800, h = 600},
}

hs.window.filter.new(function(win)
  local appName = win:application():name()
  if appWindowPositions[appName] then
    win:setFrame(appWindowPositions[appName])
  end
end):start()
```

## 4. 実践レシピ2：クリップボード拡張とテキスト操作の効率化

クリップボードの拡張やテキスト操作の自動化も、Hammerspoonの便利な機能です。

### 4.1. クリップボード履歴の管理と活用

クリップボード履歴を管理し、過去にコピーしたテキストを簡単に再利用できます。

#### 4.1.1. 具体的なコード例：クリップボード履歴表示と選択

```lua
local clipboardHistory = {}
local clipboardIndex = 0
local maxHistorySize = 10

local function addClipboardHistory()
  local currentClipboard = hs.pasteboard.getContents()
  if #clipboardHistory == 0 or clipboardHistory[#clipboardHistory] ~= currentClipboard then
    table.insert(clipboardHistory, currentClipboard)
    if #clipboardHistory > maxHistorySize then
      table.remove(clipboardHistory, 1)
    end
  end
end

hs.hotkey.bind({"ctrl", "shift"}, "v", function()
  addClipboardHistory()
  local choices = {}
  for i, v in ipairs(clipboardHistory) do
    table.insert(choices, {text = v})
  end
  hs.chooser.show(choices, function(selected)
    if selected then
      hs.pasteboard.setContents(clipboardHistory[selected])
    end
  end)
end)

```

### 4.2. テキストスニペットの登録と展開

よく使うテキストスニペットを登録しておき、キーボードショートカットで展開できます。

#### 4.2.1. 具体的なコード例：よく使うメール署名や定型文の挿入

```lua
local snippets = {
  ["sig"] = "Best regards,\nYour Name",
  ["address"] = "123 Main Street\nAnytown, CA 12345",
}

hs.hotkey.bind({"ctrl", "alt"}, "s", function()
  hs.textinput.show(function(text)
    if snippets[text] then
      hs.pasteboard.setContents(snippets[text])
      hs.eventtap.keyStroke("v", {"cmd"})
    end
  end)
end)
```

### 4.3. テキスト変換と整形を自動化

テキストの変換や整形を自動化できます。

#### 4.3.1. 具体的なコード例：全角/半角変換、大文字/小文字変換

```lua
local function convertText(conversionType)
  local selectedText = hs.pasteboard.getContents()
  if not selectedText then return end

  local convertedText
  if conversionType == "fullwidth" then
    convertedText = hs.utf8.toFullWidth(selectedText)
  elseif conversionType == "halfwidth" then
    convertedText = hs.utf8.toHalfWidth(selectedText)
  elseif conversionType == "uppercase" then
    convertedText = string.upper(selectedText)
  elseif conversionType == "lowercase" then
    convertedText = string.lower(selectedText)
  end

  hs.pasteboard.setContents(convertedText)
  hs.eventtap.keyStroke("v", {"cmd"})
end

hs.hotkey.bind({"ctrl", "alt"}, "f", function() convertText("fullwidth") end)
hs.hotkey.bind({"ctrl", "alt"}, "h", function() convertText("halfwidth") end)
hs.hotkey.bind({"ctrl", "alt"}, "u", function() convertText("uppercase") end)
hs.hotkey.bind({"ctrl", "alt"}, "l", function() convertText("lowercase") end)
```

## 5. 実践レシピ3：アプリケーションの起動と操作の自動化

アプリケーションの起動や操作を自動化することで、作業効率を大幅に向上させることができます。

### 5.1. 特定のアプリケーションをキーボードショートカットで起動

よく使うアプリケーションをキーボードショートカットで素早く起動できます。

#### 5.1.1. 具体的なコード例：よく使うアプリをワンキーで起動

```lua
local function launchApp(appName)
  local app = hs.application.find(appName)
  if app then
    app:activate()
  else
    hs.application.launch(appName)
  end
end

hs.hotkey.bind({"cmd"}, "t", function() launchApp("iTerm2") end)
hs.hotkey.bind({"cmd"}, "c", function() launchApp("Google Chrome") end)
```

### 5.2. アプリケーションのメニュー操作を自動化

アプリケーションのメニュー項目をキーボードで実行できます。

#### 5.2.1. 具体的なコード例：特定のメニュー項目をキーボードで実行

```lua
local function executeMenuItem(appName, menuPath)
  local app = hs.application.find(appName)
  if not app then return end

  app:menu():selectMenuItem(menuPath)
end

hs.hotkey.bind({"ctrl", "alt"}, "n", function() executeMenuItem("Google Chrome", {"File", "New Window"}) end)
```

### 5.3. アプリケーション間の連携を強化

アプリケーション間でデータをやり取りすることで、より複雑な自動化を実現できます。

#### 5.3.1. 具体的なコード例：特定のアプリから別のアプリへデータを渡す

```lua
local function sendTextToApp(text, appName)
  local app = hs.application.find(appName)
  if not app then return end

  hs.pasteboard.setContents(text)
  app:activate()
  hs.eventtap.keyStroke("v", {"cmd"})
end

hs.hotkey.bind({"ctrl", "alt"}, "p", function()
  local selectedText = hs.pasteboard.getContents()
  if selectedText then
    sendTextToApp(selectedText, "iTerm2")
  end
end)
```

## 6. 実践レシピ4：カスタムメニューとHUDの作成

Hammerspoonを使って、カスタムメニューやHUDを作成できます。

### 6.1. Hammerspoonによるカスタムメニューの作成

よく使うアクションをまとめたカスタムメニューを作成できます。

#### 6.1.1. 具体的なコード例：よく使うアクションをまとめたメニュー

```lua
local myMenu = hs.menubar.new()
myMenu:setTitle("My Menu")
myMenu:setMenu({
  {title = "Reload Config", fn = function() hs.reload() end},
  {title = "Open Console", fn = function() hs.console.show() end},
  {title = "Quit Hammerspoon", fn = function() hs.terminate() end},
})
```

### 6.2. 情報を表示するHUDの作成

CPU使用率やバッテリー残量などの情報を表示するHUDを作成できます。

#### 6.2.1. 具体的なコード例：CPU使用率やバッテリー残量を表示

```lua
local myHUD = hs.hud.new()

local function updateHUD()
  local cpuUsage = hs.process.cpuUsage()
  local battery = hs.battery.current()
  myHUD:text(string.format("CPU: %.2f%%\nBattery: %.0f%%", cpuUsage, battery.level * 100))
end

hs.timer.doEvery(1, updateHUD)
hs.hotkey.bind({"ctrl", "alt"}, "h", function() myHUD:show() end)
```

## 7. トラブルシューティングと注意点

Hammerspoonを使用する上で注意すべき点や、トラブルシューティングについて解説します。

### 7.1. 設定ファイルが反映されない場合の対処法

設定ファイルが反映されない場合は、以下の点を確認してください。

*   `init.lua` の構文エラー：コンソールでエラーメッセージを確認し、修正してください。
*   設定ファイルのリロード：Hammerspoonを再起動するか、メニューから「Reload Config」を実行してください。
*   権限の問題：Hammerspoonがシステムイベントを監視するための権限が許可されているか確認してください。

### 7.2. Hammerspoonのパフォーマンスに関する注意点

Hammerspoonは、多くの処理を自動化するとCPU負荷が高くなる場合があります。不要な処理は削除し、効率的なスクリプトを書くように心がけてください。

### 7.3. セキュリティに関する注意点

Hammerspoonは、システムレベルの操作を行うため、セキュリティ上の注意が必要です。信頼できるスクリプトのみを使用し、セキュリティ設定を適切に行うようにしてください。

## 8. まとめと今後の展望

この記事では、Hammerspoonの実践的な活用方法について解説しました。Hammerspoonは、Macの作業効率を劇的に向上させる強力なツールです。この記事を参考に、ぜひHammerspoonを使いこなして、より快適なMacライフを送ってください。

今後の展望として、Hammerspoonのコミュニティは活発であり、様々な拡張機能やライブラリが公開されています。それらを活用することで、さらに高度な自動化が可能になります。ぜひ、Hammerspoonの可能性を追求してみてください。

**参考リンク:**

*   [Hammerspoon 公式サイト](http://www.hammerspoon.org/)
*   [Hammerspoon GitHub リポジトリ](https://github.com/Hammerspoon/hammerspoon)
*   [Lua 公式サイト](https://www.lua.org/)
