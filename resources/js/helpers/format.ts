/**
 * Memformat tanggal ke format Indonesia lengkap dengan nama hari.
 * Contoh output: "Jumat, 17 Juli 2026"
 *
 * @param date - Nilai tanggal dari backend (string ISO/format Laravel, objek Date, null, atau undefined)
 * @returns String tanggal yang sudah diformat, atau string kosong jika tanggal tidak valid/kosong
 */
export function formatDate(date: string | Date | null | undefined): string {
    if (!date) return '';

    const parsedDate = typeof date === 'string' ? new Date(date) : date;

    // Cek apakah hasil parsing valid (mis. antisipasi string kosong atau format aneh dari backend)
    if (isNaN(parsedDate.getTime())) return '';

    return new Intl.DateTimeFormat('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(parsedDate);
}
