import ExifReader from "exifreader";

/**
 * Port of rename.py:17-31 get_exif_datetime()
 * Falls back to file.lastModified (rename.py:34-36 get_file_datetime())
 */
export async function getImageDate(
  file: File
): Promise<{ date: Date; source: "exif" | "file_modified" }> {
  try {
    const buffer = await file.arrayBuffer();
    const tags = ExifReader.load(buffer);

    const dtTag = tags["DateTimeOriginal"] ?? tags["DateTime"];

    if (dtTag?.description) {
      const parsed = dtTag.description.replace(
        /^(\d{4}):(\d{2}):(\d{2})/,
        "$1-$2-$3"
      );
      return { date: new Date(parsed), source: "exif" };
    }
  } catch {
    // Fall through to file modified time
  }

  return { date: new Date(file.lastModified), source: "file_modified" };
}
