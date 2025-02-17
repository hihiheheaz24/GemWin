import InPacket from "../../Lobby/LobbyScript/Script/networks/Network.InPacket";
import OutPacket from "../../Lobby/LobbyScript/Script/networks/Network.OutPacket";


const { ccclass } = cc._decorator;

export namespace cmd {
    export class Code {
        static SUBCRIBE = 2003;
        static UNSUBCRIBE = 2004;
        static CHANGE_ROOM = 2005;
        static PLAY = 2001;
        static UPDATE_RESULT = 2001;
        static UPDATE_POT = 2002;
        static AUTO = 2006;
        static STOP_AUTO = 2006;
        static FORCE_STOP_AUTO = 2008;
        static DATE_X2 = 2009;
        static BIG_WIN = 2010;
        static FREE = 2011;
        static FREE_DAI_LY = 2012;
        static MINIMIZE = 2013;
        static UPDATE_JACKPOT_SLOTS = 10003;
        static SUBCRIBE_HALL_SLOT = 10001;
    }
    export class ReceiveFreeDaiLy extends InPacket {
      
        freeSpin = 0;

      
        constructor(data: Uint8Array) {
            super(data);
           
            this.freeSpin = this.getByte();
            
        }
    }
    export class SendSubcribe extends OutPacket {
        constructor(roomId: number) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.SUBCRIBE);
            this.packHeader();
            this.putByte(roomId);
            this.updateSize();
        }
    }

    export class ReceiveDateX2 extends InPacket {
        
        ngayX2 = "";
        remain = 0;
        currentMoney = 0;
        freeSpin = 0;
        lines = "";
        currentRoom = 0;

      
        constructor(data: Uint8Array) {
            super(data);
           
            this.ngayX2 = this.getString();
            this.remain = this.getByte();
            this.currentMoney = this.getLong();
            this.freeSpin = this.getByte();
            this.lines = this.getString();
            this.currentRoom = this.getByte();
        }
    }
    export class SendUnSubcribe extends OutPacket {
        constructor(roomId: number) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.UNSUBCRIBE);
            this.packHeader();
            this.putByte(roomId);
            this.updateSize();
        }
    }
    export class ResUpdateJackpotSlots extends InPacket {
        pots = "";

        constructor(data: Uint8Array) {
            super(data);
            this.pots = this.getString()
        }
    }
    export class SendPlay extends OutPacket {
        constructor(betValue: number, lines: string) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.PLAY);
            this.packHeader();
            this.putInt(betValue);
            this.putString(lines);
            this.updateSize();
        }
    }
    export class SendChangeRoom extends OutPacket {
        constructor(roomLeavedId: number, roomJoinedId: number) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.CHANGE_ROOM);
            this.packHeader();
            this.putByte(roomLeavedId);
            this.putByte(roomJoinedId);
            this.updateSize();
        }
    }
    export class ReceiveUpdatePot extends InPacket {
        valueRoom1 = 0;
        valueRoom2 = 0;
        valueRoom3 = 0;
        valueRoom4 = 0;
        x21 = 0;
        x22 = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.valueRoom1 = this.getLong();
            this.valueRoom2 = this.getLong();
            this.valueRoom3 = this.getLong();
            this.valueRoom4 = this.getLong();
            this.x21 = this.getByte();
            this.x22 = this.getByte();
        }
    }
    export class ReceiveResult extends InPacket {
        ref = 0;
        result = 0;
        matrix = "";
        linesWin = "";
        haiSao = "";
        prize = 0;
        currentMoney = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.ref = this.getLong();
            this.result = this.getByte();
            this.matrix = this.getString();
            this.linesWin = this.getString();
            this.haiSao = this.getString();
            this.prize = this.getLong();
            this.currentMoney = this.getLong();
        }
    }

    export class ReqSubcribeHallSlot extends OutPacket {
        constructor() {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.SUBCRIBE_HALL_SLOT);
            this.packHeader();
            this.updateSize();
        }
    }
}
export default cmd;