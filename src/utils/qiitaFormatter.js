const YAML = require('yaml');

function generateQiitaFrontMatter(title, tags, isPrivate = false) {
    // 現在の日時をISO文字列として取得し、クォートで囲む
    const currentDate = `'${new Date().toISOString()}'`;

    const frontMatter = {
        title: title,
        tags: tags,
        private: isPrivate,
        updated_at: currentDate, // クォートで囲まれた文字列を設定
        id: null,
        organization_url_name: null,
        slide: false,
        ignorePublish: false
    };

    return `---\n${YAML.stringify(frontMatter)}---\n\n`;
}

function formatQiitaArticle(title, tags, content, isPrivate = false) {
    const frontMatter = generateQiitaFrontMatter(title, tags, isPrivate);
    return frontMatter + content;
}

module.exports = {
    generateQiitaFrontMatter,
    formatQiitaArticle
};