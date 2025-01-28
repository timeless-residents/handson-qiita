const { genAI, generationConfig } = require('../config/gemini');

async function enhanceStructure(title, outline) {
    const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash-exp",
        generationConfig,
    });

    const prompt = `
技術記事のタイトルとアウトラインを、より実践的で価値の高い内容になるように改善してください。

原題：${title}

現在のアウトライン：
${outline.join('\n')}

以下の点を考慮して改善案を提示してください：
1. テーマに関する最新のベストプラクティスを反映
2. 実務での具体的な課題解決に役立つ内容
3. 各セクションに具体的な実装例やコード例を含める
4. トラブルシューティングや注意点も含める
5. タグは5つ以内にしてください
6. 必ず以下のJSON形式で出力してください。前後の説明は一切不要です：

{
    "title": "改善後のタイトル",
    "outline": [
        "セクション1",
        "セクション2"
    ],
    "tags": ["タグ1", "タグ2", "タグ3"]
}`;

    try {
        const chatSession = model.startChat({
            generationConfig,
            history: [],
        });
        const result = await chatSession.sendMessage(prompt);
        const text = result.response.text();

        // JSONの部分を抽出
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('JSONが見つかりません');
        }

        // 余分な空白や改行を整形
        const sanitizedJson = jsonMatch[0]
            .replace(/[\n\r]/g, ' ')         // 改行を空白に
            .replace(/\s+/g, ' ')            // 連続する空白を1つに
            .replace(/"\s+}/g, '"}')         // 末尾の余分な空白を除去
            .replace(/"\s+]/g, '"]')         // 配列末尾の余分な空白を除去
            .replace(/}\s+/g, '}')           // オブジェクト後の余分な空白を除去
            .replace(/]\s+/g, ']')           // 配列後の余分な空白を除去
            .trim();

        try {
            const response = JSON.parse(sanitizedJson);

            // 必須フィールドの検証
            if (!response.title || !Array.isArray(response.outline) || !Array.isArray(response.tags)) {
                throw new Error('必須フィールドが不足しています');
            }

            // タグが空の場合はデフォルトタグを設定
            if (response.tags.length === 0) {
                response.tags = ["Programming"];
            }

            return response;

        } catch (parseError) {
            console.error('JSON parse error:', parseError);
            console.error('Sanitized JSON:', sanitizedJson);
            throw parseError;
        }

    } catch (error) {
        console.error('Structure enhancement error:', error);
        // エラー時はオリジナルの内容を返す
        return {
            title: title,
            outline: outline,
            tags: ["Programming"]
        };
    }
}

module.exports = {
    enhanceStructure
};