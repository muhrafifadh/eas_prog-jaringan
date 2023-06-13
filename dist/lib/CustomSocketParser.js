import * as socketIOParser from 'socket.io-parser';
import Vector from '../lib/Vector';
import { getReplacerReviver } from './CustomObjectSerialization';
const { replacer, reviver } = getReplacerReviver({ Vector });
export class Encoder extends socketIOParser.Encoder {
    constructor() {
        super(replacer);
    }
}
export class Decoder extends socketIOParser.Decoder {
    constructor() {
        super(reviver);
    }
}
