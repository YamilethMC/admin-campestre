import JSZip from 'jszip';

const MAX_BATCH_SIZE_BYTES = 30 * 1024 * 1024; // 30 MB (safety margin under 32MB limit)

/**
 * Reads a ZIP file and splits its PDF contents into batches of ≤30MB (uncompressed size).
 * @param {File} file - The large ZIP file to split
 * @param {number} maxBatchBytes - Maximum uncompressed size per batch (default 30MB)
 * @returns {Promise<{ batches: File[], totalFiles: number }>}
 */
export async function splitZipIntoBatches(file, maxBatchBytes = MAX_BATCH_SIZE_BYTES) {
  const arrayBuffer = await file.arrayBuffer();
  const sourceZip = await JSZip.loadAsync(arrayBuffer);

  const pdfEntries = [];

  for (const [filename, zipEntry] of Object.entries(sourceZip.files)) {
    if (!zipEntry.dir && filename.toLowerCase().endsWith('.pdf')) {
      const content = await zipEntry.async('uint8array');
      pdfEntries.push({
        name: filename.includes('/') ? filename.split('/').pop() : filename,
        content,
        size: content.byteLength,
      });
    }
  }

  if (pdfEntries.length === 0) {
    throw new Error('No se encontraron archivos PDF dentro del ZIP');
  }

  const batchGroups = [];
  let currentGroup = [];
  let currentSize = 0;

  for (const entry of pdfEntries) {
    const fileSize = entry.size;

    if (currentSize + fileSize > maxBatchBytes && currentGroup.length > 0) {
      batchGroups.push(currentGroup);
      currentGroup = [];
      currentSize = 0;
    }

    currentGroup.push(entry);
    currentSize += fileSize;
  }

  if (currentGroup.length > 0) {
    batchGroups.push(currentGroup);
  }

  const batches = await Promise.all(
    batchGroups.map(async (group, index) => {
      const zip = new JSZip();
      for (const entry of group) {
        zip.file(entry.name, entry.content);
      }
      const blob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } });
      return new File([blob], `batch-${index + 1}.zip`, { type: 'application/zip' });
    })
  );

  return {
    batches,
    totalFiles: pdfEntries.length,
    batchSizes: batchGroups.map(g => g.length),
  };
}
