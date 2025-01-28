require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { GEMINI_API_KEY } = require('./config/gemini');
const { getClipboardContent, parseClipboardContent } = require('./utils/clipboard');
const { enhanceStructure } = require('./services/structureEnhancer');
const { generateContent } = require('./services/contentGenerator');
const { formatQiitaArticle } = require('./utils/qiitaFormatter');

async function main() {
    if (!GEMINI_API_KEY) {
        console.error('環境変数 GEMINI_API_KEY が設定されていません。');
        process.exit(1);
    }

    try {
        // クリップボードからコンテンツを取得
        console.log('📋 クリップボードから内容を取得中...');
        const clipboardContent = getClipboardContent();
        const { title, outline } = parseClipboardContent(clipboardContent);

        // 構成を改善
        console.log('🔄 記事の構成を改善中...');
        const enhanced = await enhanceStructure(title, outline);
        
        // コンテンツを生成
        console.log('✍️ 記事を生成中...');
        const content = await generateContent(enhanced.title, enhanced.outline);

        // Qiita記事のフォーマットに変換
        const article = formatQiitaArticle(
            enhanced.title,
            enhanced.tags,
            content
        );

        // 現在の日時を取得
        const now = new Date();
        
        // フォルダパスの生成（YYYY/MM/DD/）
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const folderPath = path.join('public', String(year), month, day);

        // 時分秒の取得（HHMMSS）
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const timeStr = `${hours}${minutes}${seconds}`;

        // ファイル名の生成（HHMMSS-title.md）
        const sanitizedTitle = enhanced.title.toLowerCase().replace(/\s+/g, '-');
        const filename = `${timeStr}-${sanitizedTitle}.md`;

        // フォルダが存在しない場合は作成
        fs.mkdirSync(folderPath, { recursive: true });

        // ファイルの保存
        const fullPath = path.join(folderPath, filename);
        fs.writeFileSync(fullPath, article);

        // 完了報告
        console.log('\n✨ Qiita記事を生成しました！');
        console.log(`📝 タイトル: ${enhanced.title}`);
        console.log(`🏷️  タグ: ${enhanced.tags.join(', ')}`);
        console.log(`📂 保存先: ${path.resolve(fullPath)}`);

    } catch (error) {
        console.error('エラーが発生しました:', error);
        process.exit(1);
    }
}

main().catch(console.error);