const YAML = require('yaml');

function generateQiitaFrontMatter(title, tags, isPrivate = false) {
    // 日本時間のタイムゾーンオフセットを設定
    const now = new Date();
    const jstDate = new Date(now.getTime() + (9 * 60 * 60 * 1000));
    
    // YYYY-MM-DDThh:mm:ss+09:00 形式にフォーマット
    const currentDate = jstDate.toISOString()
        .replace(/\.\d+Z$/, '+09:00');

    const frontMatter = {
        title: title,
        tags: tags,
        private: isPrivate,
        updated_at: currentDate,
        id: null,
        organization_url_name: null,
        slide: false,
        ignorePublish: false
    };

    // YAMLの設定でクォートの扱いをカスタマイズ
    const yamlOptions = {
        defaultStringType: 'QUOTE_SINGLE',
        defaultKeyType: 'PLAIN'
    };

    return `---\n${YAML.stringify(frontMatter, yamlOptions)}---\n\n`;
}

function formatQiitaArticle(title, tags, content, isPrivate = false) {
    const frontMatter = generateQiitaFrontMatter(title, tags, isPrivate);
    return frontMatter + content;
}

module.exports = {
    generateQiitaFrontMatter,
    formatQiitaArticle
};