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

function publish() {
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
        
    } catch (error) {
        console.error('\n❌ Error during publish process:', error.message);
        process.exit(1);
    }
}

publish();