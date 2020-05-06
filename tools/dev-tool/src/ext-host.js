Object.defineProperty(exports, '__esModule', { value: true });
const ext_process_base_1 = require('../../../packages/kaitian-extension/lib/hosted/ext.process-base');
const ide_core_common_1 = require('../../../packages/core-common');

const builtinCommands = [
    {
        id: 'test:builtinCommand:test',
        handler: (args) => {
            return 'fake token';
        },
    },
];
ext_process_base_1.extProcessInit({
    builtinCommands,
    logLevel: ide_core_common_1.LogLevel.Info,
});