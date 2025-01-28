const YAML = require('yaml');

function generateQiitaFrontMatter(title, tags, isPrivate = false) {
    const frontMatter = {
        title: title,
        tags: tags,
        private: isPrivate,
        updated_at: new Date().toISOString(),
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