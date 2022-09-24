import { e2eRepository } from "../repositories/e2eRepository";

async function truncate() {
    await e2eRepository.truncate()
}

export const e2eService = {
    truncate
};