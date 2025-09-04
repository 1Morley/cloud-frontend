import { v4 as uuidv4 } from 'uuid';

export default function generateUuid() {
    let uuid = uuidv4();
    return uuid
}