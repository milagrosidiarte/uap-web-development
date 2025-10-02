// utils/nonceStore.ts

// Mapa en memoria: key = address, value = nonce
const nonceMap = new Map<string, string>();

/**
 * Guarda un nonce asociado a una dirección.
 */
export function saveNonce(address: string, nonce: string): void {
  nonceMap.set(address.toLowerCase(), nonce);
}

/**
 * Obtiene el nonce guardado para una dirección.
 */
export function getNonce(address: string): string | undefined {
  return nonceMap.get(address.toLowerCase());
}

/**
 * Elimina el nonce (se usa una vez en signin).
 */
export function deleteNonce(address: string): void {
  nonceMap.delete(address.toLowerCase());
}
