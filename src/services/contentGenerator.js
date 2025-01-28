const { genAI, generationConfig } = require('../config/gemini');

async function generateContent(title, outline) {
    const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash-exp",
        generationConfig,
    });

    const prompt = `
技術記事のタイトルとアウトラインから、実践的で価値の高い記事を生成してください。

タイトル：${title}

アウトライン：
${outline.join('\n')}

以下の点を考慮して記事を執筆してください：
1. 冒頭で記事の目的と読者が得られる価値を明確に説明
2. 各セクションは具体的な実装例やコード例を含める
3. 実務での具体的な課題解決に役立つ内容
4. トラブルシューティングや注意点も含める
5. 参考リンクや関連情報の提案を含める
6. 前後の補足説明は不要でマークダウンのみ出力する

出力形式：
1. Qiitaのマークダウン形式で出力
2. 各セクションは適切な見出しレベルを使用
3. コードブロックは言語指定を含める
`;

    try {

        const chatSession = model.startChat({
            generationConfig,
            history: [],
        });
        const result = await chatSession.sendMessage(prompt);
        const text = result.response.text();
        return text;
    } catch (error) {
        console.error('Content generation error:', error);
        throw error;
    }
}

module.exports = {
    generateContent
};