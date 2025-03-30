"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var GiveUserPresetSptCommand_1;
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GiveUserPresetSptCommand = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const ItemHelper_1 = require("C:/snapshot/project/obj/helpers/ItemHelper");
const MailSendService_1 = require("C:/snapshot/project/obj/services/MailSendService");
const SaveServer_1 = require("C:/snapshot/project/obj/servers/SaveServer");
let GiveUserPresetSptCommand = class GiveUserPresetSptCommand {
    static { GiveUserPresetSptCommand_1 = this; }
    itemHelper;
    mailSendService;
    cloner;
    saveServer;
    static commandRegex = /^spt give-user-preset ((([a-z]{2,5}) )?"(.+)"|\w+)$/;
    constructor(itemHelper, mailSendService, cloner, saveServer) {
        this.itemHelper = itemHelper;
        this.mailSendService = mailSendService;
        this.cloner = cloner;
        this.saveServer = saveServer;
    }
    getCommand() {
        return "give-user-preset";
    }
    getCommandHelp() {
        return 'spt give-user-preset\n========\nSends items to the player through the message system.\n\n\tspt give-user-preset [weaponBuilds.Id]';
    }
    performAction(commandHandler, sessionId, request) {
        if (!GiveUserPresetSptCommand_1.commandRegex.test(request.text)) {
            this.mailSendService.sendUserMessageToPlayer(sessionId, commandHandler, 'Invalid use of give command. Use "help" for more information.');
            return request.dialogId;
        }
        const result = GiveUserPresetSptCommand_1.commandRegex.exec(request.text);
        if (!result[1]) {
            this.mailSendService.sendUserMessageToPlayer(sessionId, commandHandler, `Invalid use of give command. Use "help" for more information.`);
            return request.dialogId;
        }
        const profile = this.saveServer.getProfiles()[sessionId];
        const weaponBuilds = profile.userbuilds.weaponBuilds;
        const weaponBuild = weaponBuilds.find((wb) => wb.Id === result[1]);
        if (!weaponBuild) {
            this.mailSendService.sendUserMessageToPlayer(sessionId, commandHandler, `Couldn't find weapon build for Id: ${result[1]}`);
            return request.dialogId;
        }
        let itemsToSend = this.cloner.clone(weaponBuild.Items);
        itemsToSend = this.itemHelper.replaceIDs(itemsToSend);
        this.itemHelper.setFoundInRaid(itemsToSend);
        this.mailSendService.sendSystemMessageToPlayer(sessionId, "SPT GIVE", itemsToSend);
        return request.dialogId;
    }
};
exports.GiveUserPresetSptCommand = GiveUserPresetSptCommand;
exports.GiveUserPresetSptCommand = GiveUserPresetSptCommand = GiveUserPresetSptCommand_1 = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("ItemHelper")),
    __param(1, (0, tsyringe_1.inject)("MailSendService")),
    __param(2, (0, tsyringe_1.inject)("PrimaryCloner")),
    __param(3, (0, tsyringe_1.inject)("SaveServer")),
    __metadata("design:paramtypes", [typeof (_a = typeof ItemHelper_1.ItemHelper !== "undefined" && ItemHelper_1.ItemHelper) === "function" ? _a : Object, typeof (_b = typeof MailSendService_1.MailSendService !== "undefined" && MailSendService_1.MailSendService) === "function" ? _b : Object, Object, typeof (_c = typeof SaveServer_1.SaveServer !== "undefined" && SaveServer_1.SaveServer) === "function" ? _c : Object])
], GiveUserPresetSptCommand);
//# sourceMappingURL=GiveUserPresetSptCommand.js.map