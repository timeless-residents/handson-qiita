---
title: 'MacOS自動化実践ガイド: ShortcutsとHammerspoonで業務効率を最大化'
tags:
  - macOS
  - 効率化
  - 自動化
  - Shortcuts
  - Hammerspoon
private: false
updated_at: '2025-01-30T13:35:02+09:00'
id: f75d689f7ce9be16b3b2
organization_url_name: null
slide: false
ignorePublish: false
---

# MacOS自動化実践ガイド: ShortcutsとHammerspoonで業務効率を最大化

## はじめに: なぜShortcutsとHammerspoonを組み合わせるのか？

この記事では、MacOSの自動化ツールであるShortcutsとHammerspoonを組み合わせることで、日々の業務効率を劇的に向上させる方法を解説します。Shortcutsは直感的なインターフェースで簡単なタスクを自動化するのに適しており、HammerspoonはLuaスクリプトによる高度なカスタマイズが可能です。この2つを連携させることで、単純な作業から複雑なワークフローまで、幅広い自動化を実現できます。 

**この記事を読むことで、以下のことができるようになります。**

*   Shortcutsを使って、ファイル操作、テキスト処理、Web API連携などの基本的なタスクを自動化する。
*   Hammerspoonを導入し、Luaスクリプトの基礎を理解して、高度な自動化環境を構築する。
*   ShortcutsとHammerspoonを連携させ、アプリケーションの起動、ウィンドウ操作、クリップボード拡張など、より複雑なワークフローを実装する。
*   実際の業務で役立つ自動化スクリプトの例を参考に、自身の作業を効率化する。
*   自動化におけるトラブルシューティングやセキュリティに関する注意点を理解する。

## Shortcutsで始める: 簡単なタスク自動化レシピ

Shortcutsは、ドラッグ＆ドロップでアクションを組み合わせて自動化フローを作成できるツールです。ここでは、具体的なレシピをいくつか紹介します。

### ファイル操作: 特定フォルダのファイルを日付順に並び替える

1.  **「ファイル」アクション**で、対象フォルダを選択します。
2.  **「ファイルを取得」アクション**で、フォルダ内のファイルを取得します。
3.  **「並び替え」アクション**で、「作成日」または「変更日」を基準に並び替えます。
4.  **「ファイル」アクション**で、並び替えたファイルを別のフォルダに移動またはコピーします。

### テキスト処理: クリップボードのテキストをMarkdown形式に変換する

1.  **「クリップボードの内容を取得」アクション**で、クリップボードのテキストを取得します。
2.  **「テキスト」アクション**で、Markdown形式に変換するルールを定義します。（例: `> {クリップボード} `）
3.  **「クリップボードにコピー」アクション**で、変換後のテキストをクリップボードにコピーします。

### Web API連携: 現在の天気を取得して通知する

1.  **「URLを取得」アクション**で、天気予報APIのURLを指定します。
    ```
    例: https://api.openweathermap.org/data/2.5/weather?q=Tokyo&appid=YOUR_API_KEY
    ```
2.  **「JSONを取得」アクション**で、APIレスポンスをJSON形式で取得します。
3.  **「辞書から値を取得」アクション**で、必要な情報（例: 天気、気温）を抽出します。
4.  **「通知を表示」アクション**で、取得した情報を通知します。

## Hammerspoon導入: 高度な自動化のための環境構築

Hammerspoonは、Luaスクリプトを使用してMacOSを高度にカスタマイズできるツールです。

### インストール

1.  [Hammerspoon公式サイト](http://www.hammerspoon.org/)からダウンロードし、インストールします。
2.  `~/.hammerspoon/init.lua` ファイルを作成し、設定を記述します。

### Luaスクリプトの基本

Luaは軽量なスクリプト言語で、Hammerspoonの設定に利用されます。以下は基本的な例です。

```lua
-- ホットキーの登録
hs.hotkey.bind({"cmd", "shift"}, "m", function()
  hs.alert.show("Hello, Hammerspoon!")
end)

-- アプリケーションの起動
hs.hotkey.bind({"cmd", "shift"}, "c", function()
  hs.application.launchOrFocus("Google Chrome")
end)
```

### 設定ファイルの例

```lua
-- ウィンドウ操作
local function moveWindowToScreen(screen, window)
  local screenFrame = screen:frame()
  window:moveToScreen(screen)
  window:setFrame({x=screenFrame.x, y=screenFrame.y, w=screenFrame.w, h=screenFrame.h})
end

hs.hotkey.bind({"ctrl", "alt"}, "left", function()
  local win = hs.window.focusedWindow()
  local currentScreen = win:screen()
  local prevScreen = currentScreen:previous()
  if prevScreen then
    moveWindowToScreen(prevScreen, win)
  end
end)

hs.hotkey.bind({"ctrl", "alt"}, "right", function()
  local win = hs.window.focusedWindow()
  local currentScreen = win:screen()
  local nextScreen = currentScreen:next()
  if nextScreen then
    moveWindowToScreen(nextScreen, win)
  end
end)
```

## ShortcutsとHammerspoonの連携: 複雑なワークフローの実現

ShortcutsからHammerspoonの機能を呼び出すことで、より複雑な自動化が可能です。

### ShortcutsからHammerspoonのスクリプトを実行する

1.  Hammerspoonで、実行したいスクリプトを関数として定義します。
    ```lua
    function myCustomFunction(param)
        hs.alert.show("Param: " .. param)
    end
    ```
2.  Shortcutsの**「URLを取得」アクション**で、HammerspoonのカスタムURLスキームを呼び出します。
    ```
    例: hammerspoon://myCustomFunction?param=test
    ```
3.  Hammerspoon側で、カスタムURLスキームをハンドリングする設定を追加します。
    ```lua
    hs.urlevent.bind("myCustomFunction", function(params)
      myCustomFunction(params.param)
    end)
    ```

### 具体例: アプリケーション起動、ウィンドウ操作、クリップボード拡張

*   **Shortcuts**で特定のアプリを起動し、**Hammerspoon**でそのアプリのウィンドウを特定の位置に移動させる。
*   **Shortcuts**でクリップボードの内容を取得し、**Hammerspoon**で特定のフォーマットに変換してからクリップボードにコピーする。
*   **Shortcuts**で特定のWebページを開き、**Hammerspoon**でそのページの特定の要素を抽出する。

## 実例: 業務効率を上げる自動化スクリプト集

### メール処理: 特定の差出人からのメールを自動でアーカイブする

1.  **Shortcuts**で、メールアプリのAPIを使い、特定の差出人からのメールを検索します。
2.  **Shortcuts**で、検索結果のメールをアーカイブします。
3.  **Hammerspoon**で、メールアプリが起動している場合のみ、この処理を実行するように設定します。

### Slack連携: 特定のチャンネルの未読メッセージ数を通知する

1.  **Shortcuts**で、Slack APIを使い、特定のチャンネルの未読メッセージ数を取得します。
2.  **Shortcuts**で、取得した未読メッセージ数を通知します。
3.  **Hammerspoon**で、特定の時間帯のみ、この処理を実行するように設定します。

### 開発環境のセットアップ: プロジェクトごとにターミナルとエディタを起動する

1.  **Shortcuts**で、プロジェクトのディレクトリを引数として、Hammerspoonのスクリプトを実行します。
2.  **Hammerspoon**で、指定されたディレクトリでターミナルを開き、エディタを起動します。
3.  **Hammerspoon**で、ターミナルとエディタのウィンドウを適切な位置に配置します。

## トラブルシューティングと注意点

### よくあるエラーと解決策

*   **Shortcutsの実行エラー**: アクションのパラメータ設定や、APIキーの入力ミスなどを確認します。
*   **Hammerspoonのスクリプトエラー**: Luaの構文エラーや、APIの使い方が間違っている可能性があります。Hammerspoonのコンソールでエラーメッセージを確認します。
*   **ShortcutsとHammerspoonの連携エラー**: カスタムURLスキームの設定や、Hammerspoon側のハンドラーの設定を確認します。

### セキュリティに関する考慮事項

*   APIキーなどの機密情報をスクリプトに直接記述しないように注意します。環境変数やキーチェーンなどを活用しましょう。
*   Hammerspoonのスクリプトは、実行権限を適切に管理しましょう。
*   信頼できないソースからのスクリプトは実行しないようにしましょう。

## まとめ: 自動化の未来と更なる学習リソース

ShortcutsとHammerspoonを組み合わせることで、MacOSの自動化の可能性は無限に広がります。この記事で紹介した例を参考に、自身の業務に合わせてカスタマイズし、更なる効率化を目指しましょう。

### 更なる学習リソース

*   **Shortcuts**: Apple公式サイトのドキュメントや、オンラインコミュニティを参考にしましょう。
*   **Hammerspoon**: Hammerspoon公式サイトのドキュメントや、GitHubのリポジトリを参考にしましょう。
*   **Lua**: Luaの公式ドキュメントや、オンラインチュートリアルを参考にしましょう。

### 参考リンク

*   [Shortcuts 公式サイト](https://support.apple.com/ja-jp/guide/shortcuts/welcome/ios)
*   [Hammerspoon 公式サイト](http://www.hammerspoon.org/)
*   [Lua 公式サイト](https://www.lua.org/)
