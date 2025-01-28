const { execSync } = require('child_process');

function getClipboardContent() {
    try {
        if (process.platform === 'darwin') {
            return execSync('pbpaste').toString();
        } else if (process.platform === 'win32') {
            return execSync('powershell Get-Clipboard').toString();
        } else {
            return execSync('xclip -selection clipboard -o').toString();
        }
    } catch (error) {
        console.error('クリップボードの内容を取得できませんでした:', error);
        process.exit(1);
    }
}

function parseClipboardContent(content) {
    const lines = content.split('\n').filter(line => line.trim());
    
    if (lines.length === 0) {
        throw new Error('クリップボードの内容が空です');
    }

    // 最初の行をタイトルとして扱う
    const title = lines[0].replace(/^[「」]/g, '').trim();

    // 残りの行からアウトラインを抽出
    const outline = lines
        .slice(1)
        .filter(line => line.trim().startsWith('* ') || line.trim().startsWith('- '))
        .map(line => line.replace(/^[\*\-]\s+/, '').trim());

    if (outline.length === 0) {
        throw new Error('アウトラインが見つかりませんでした。各項目は "* " または "- " で始まる行として記述してください。');
    }

    return { title, outline };
}

module.exports = {
    getClipboardContent,
    parseClipboardContent
};