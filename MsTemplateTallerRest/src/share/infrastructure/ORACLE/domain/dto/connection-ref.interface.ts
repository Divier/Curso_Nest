/**
 * Clase encargada de definir la interfaz que retornará las estadisticas del pool
 */
export interface ConnectionRef {
    alias: string;
    close: () => Promise<void>;
    getStatistics();
}
