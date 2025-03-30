"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = __importDefault(require("node:fs"));
const LogTextColor_1 = require("C:/snapshot/project/obj/models/spt/logging/LogTextColor");
const MessageType_1 = require("C:/snapshot/project/obj/models/enums/MessageType");
const GiveUserPresetSptCommand_1 = require("./GiveUserPresetSptCommand");
class GiveUI {
    preSptLoad(container) {
        container.register("GiveUserPresetSptCommand", GiveUserPresetSptCommand_1.GiveUserPresetSptCommand);
        container.resolve("SptCommandoCommands").registerSptCommandoCommand(container.resolve("GiveUserPresetSptCommand"));
        const logger = container.resolve('WinstonLogger');
        const databaseServer = container.resolve('DatabaseServer');
        const saveServer = container.resolve('SaveServer');
        const watermark = container.resolve('Watermark');
        const preAkiModLoader = container.resolve('PreSptModLoader');
        const commandoDialog = container.resolve('CommandoDialogueChatBot');
        const sptDialog = container.resolve('SptDialogueChatBot');
        const profileHelper = container.resolve('ProfileHelper');
        const giftService = container.resolve('GiftService');
        const staticRouterModService = container.resolve('StaticRouterModService');
        const dynamicRouterModService = container.resolve('DynamicRouterModService');
        // Hook up a new static route
        staticRouterModService.registerStaticRouter('GiveUIModRouter', [
            {
                url: '/give-ui/server',
                action: (_url, _info, _sessionId, _output) => {
                    logger.log(`[give-ui] Loading server info`, LogTextColor_1.LogTextColor.GREEN);
                    const version = watermark.getVersionTag();
                    const serverPath = node_path_1.default.resolve();
                    const modsInstalled = Object.values(preAkiModLoader.getImportedModDetails());
                    const giveUiMod = modsInstalled.find((m) => m.name === 'give-ui');
                    const modVersion = giveUiMod?.version;
                    const maxLevel = profileHelper.getMaxLevel();
                    const gifts = giftService.getGifts();
                    return Promise.resolve(JSON.stringify({ version, path: serverPath, modVersion, maxLevel, gifts }));
                },
            },
            {
                url: '/give-ui/profiles',
                action: (_url, _info, _sessionId, _output) => {
                    logger.log(`[give-ui] Loading profiles`, LogTextColor_1.LogTextColor.GREEN);
                    return Promise.resolve(JSON.stringify(saveServer.getProfiles()));
                },
            },
            {
                url: '/give-ui/items',
                action: (_url, _info, _sessionId, _output) => {
                    logger.log(`[give-ui] Loading items`, LogTextColor_1.LogTextColor.GREEN);
                    return Promise.resolve(JSON.stringify({
                        items: databaseServer.getTables().templates.items,
                        globalPresets: databaseServer.getTables().globals.ItemPresets
                    }));
                },
            },
            {
                url: '/give-ui/commando',
                action: (_url, request, sessionId, _output) => {
                    const command = request.message;
                    logger.log(`[give-ui] Sending to commando: [${command}]`, LogTextColor_1.LogTextColor.GREEN);
                    const message = {
                        dialogId: sessionId,
                        type: MessageType_1.MessageType.SYSTEM_MESSAGE,
                        text: command,
                        replyTo: undefined,
                    };
                    const response = commandoDialog.handleMessage(sessionId, message);
                    return Promise.resolve(JSON.stringify({ response }));
                },
            },
            {
                url: '/give-ui/spt',
                action: (_url, request, sessionId, _output) => {
                    const command = request.message;
                    logger.log(`[give-ui] Sending to spt: [${command}]`, LogTextColor_1.LogTextColor.GREEN);
                    const message = {
                        dialogId: sessionId,
                        type: MessageType_1.MessageType.SYSTEM_MESSAGE,
                        text: command,
                        replyTo: undefined,
                    };
                    const response = sptDialog.handleMessage(sessionId, message);
                    return Promise.resolve(JSON.stringify({ response }));
                },
            },
        ], 'give-ui-top-level-route');
        dynamicRouterModService.registerDynamicRouter('GiveUIDynamicModRouter', [{
                url: '/give-ui/cache',
                action: (url, _request, _sessionId, _output) => {
                    const cacheID = url.replace('/give-ui/cache/', '');
                    const serverPath = node_path_1.default.resolve();
                    const cachePath = node_path_1.default.join(serverPath, 'user', 'sptappdata', 'live');
                    try {
                        const indexJson = node_fs_1.default.readFileSync(node_path_1.default.join(cachePath, 'index.json'), 'utf8');
                        const index = JSON.parse(indexJson);
                        const image = index[cacheID];
                        try {
                            const file = node_fs_1.default.readFileSync(node_path_1.default.join(cachePath, `${image}.png`), { encoding: 'base64' });
                            return Promise.resolve(JSON.stringify({ imageBase64: file }));
                        }
                        catch (e) {
                            return Promise.resolve(JSON.stringify({ error: 404 }));
                        }
                    }
                    catch (e) {
                        return Promise.resolve(JSON.stringify({ error: 404 }));
                    }
                },
            }], 'give-ui-top-level-dynamic-route');
    }
}
module.exports = { mod: new GiveUI() };
//# sourceMappingURL=mod.js.map