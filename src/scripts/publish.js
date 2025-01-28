const { execSync } = require('child_process');

function getCurrentDate() {
    const now = new Date();
    return now.toISOString().split('T')[0]; // YYYY-MM-DD形式
}

function runCommand(command) {
    try {
        execSync(command, { stdio: 'inherit' });
    } catch (error) {
        console.error(`Command failed: ${command}`);
        process.exit(1);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function focusOnGitHubActions() {
    try {
        // 英数キーを押して日本語入力モードをオフにする
        console.log('\n⌨️  Disabling Japanese input...');
        runCommand('osascript -e \'tell application "System Events" to key code 102\''); // 英数キー

        await sleep(100);

        // コマンドパレットを開く
        console.log('🎯 Opening command palette...');
        runCommand('osascript -e \'tell application "System Events" to keystroke "p" using {command down, shift down}\'');
        
        // コマンドパレットが開くのを待つ
        await sleep(800);
        
        // GitHub Actionsコマンドを入力
        console.log('🔍 Focusing on GitHub Actions...');
        runCommand('osascript -e \'tell application "System Events" to keystroke "GitHub Actions: Focus Current"\'');
        
        // エンターキーを押す
        await sleep(200);
        runCommand('osascript -e \'tell application "System Events" to key code 36\''); // 36はreturnキー

        await sleep(200);
        runCommand('osascript -e \'tell application "System Events" to key code 36\''); // 36はreturnキー

        await sleep(5000);

        // GitHub Actionsコマンドを入力
        console.log('🆕 Refreshing on GitHub Actions...');
        runCommand('osascript -e \'tell application "System Events" to keystroke "GitHub Actions: Refresh Current"\'');
        
        // エンターキーを押す
        await sleep(200);
        runCommand('osascript -e \'tell application "System Events" to key code 36\''); // 36はreturnキー

        await sleep(200);
        runCommand('osascript -e \'tell application "System Events" to key code 36\''); // 36はreturnキー

        await sleep(5000);

        // GitHub Actionsコマンドを入力
        console.log('🆕 Refreshing on GitHub Actions...');
        runCommand('osascript -e \'tell application "System Events" to keystroke "GitHub Actions: Refresh Current"\'');
        
        // エンターキーを押す
        await sleep(200);
        runCommand('osascript -e \'tell application "System Events" to key code 36\''); // 36はreturnキー

        await sleep(200);
        runCommand('osascript -e \'tell application "System Events" to key code 36\''); // 36はreturnキー

        await sleep(5000);

        // GitHub Actionsコマンドを入力
        console.log('🆕 Refreshing on GitHub Actions...');
        runCommand('osascript -e \'tell application "System Events" to keystroke "GitHub Actions: Refresh Current"\'');
        
        // エンターキーを押す
        await sleep(200);
        runCommand('osascript -e \'tell application "System Events" to key code 36\''); // 36はreturnキー

        await sleep(200);
        runCommand('osascript -e \'tell application "System Events" to key code 36\''); // 36はreturnキー

        await sleep(5000);

        // GitHub Actionsコマンドを入力
        console.log('🆕 Refreshing on GitHub Actions...');
        runCommand('osascript -e \'tell application "System Events" to keystroke "GitHub Actions: Refresh Current"\'');
        
        // エンターキーを押す
        await sleep(200);
        runCommand('osascript -e \'tell application "System Events" to key code 36\''); // 36はreturnキー

        await sleep(200);
        runCommand('osascript -e \'tell application "System Events" to key code 36\''); // 36はreturnキー

        await sleep(5000);

        // GitHub Actionsコマンドを入力
        console.log('🆕 Refreshing on GitHub Actions...');
        runCommand('osascript -e \'tell application "System Events" to keystroke "GitHub Actions: Refresh Current"\'');
        
        // エンターキーを押す
        await sleep(200);
        runCommand('osascript -e \'tell application "System Events" to key code 36\''); // 36はreturnキー

        await sleep(200);
        runCommand('osascript -e \'tell application "System Events" to key code 36\''); // 36はreturnキー



        
    } catch (error) {
        console.log('\n⚠️ Note: Could not automatically focus GitHub Actions tab');
        console.log('Please check the GitHub Actions tab manually');
    }
}

async function publish() {
    console.log('🔄 Publishing process started...\n');

    try {
        // Git status の確認
        console.log('📊 Checking git status...');
        runCommand('git status');
        
        // 変更の追加
        console.log('\n📝 Adding changes...');
        runCommand('git add .');
        
        // コミット
        const date = getCurrentDate();
        console.log('\n💾 Committing changes...');
        runCommand(`git commit -m "update for ${date}"`);
        
        // プッシュ
        console.log('\n🚀 Pushing to GitHub...');
        runCommand('git push origin main');
        
        console.log('\n✨ Publish complete!');
        console.log('GitHub Actions will start the Qiita publication process...');
        
        // GitHub Actionsタブにフォーカス
        await focusOnGitHubActions();
        
    } catch (error) {
        console.error('\n❌ Error during publish process:', error.message);
        process.exit(1);
    }
}

// Promiseを適切に処理するためにasync/awaitを使用
publish().catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
});