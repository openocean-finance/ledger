import Zemu from '@zondax/zemu';

const catchExit = async () => {
    process.on('SIGINT', () => {
        Zemu.stopAllEmuContainers(() => {
            process.exit();
        });
    });
};

module.exports = async () => {
    await catchExit();
    await Zemu.checkAndPullImage();
    await Zemu.stopAllEmuContainers();
};
