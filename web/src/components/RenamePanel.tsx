import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { ImageFile } from "@/types";
import { useRename } from "@/hooks/useRename";

interface RenamePanelProps {
  images: ImageFile[];
}

export function RenamePanel({ images }: RenamePanelProps) {
  const { t } = useTranslation();
  const { renamePlan, prefix, setPrefix, downloadZip, isZipping } =
    useRename(images);

  if (images.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-4">
        {t("rename.noImages")}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium whitespace-nowrap">
          {t("rename.prefix")}
        </label>
        <Input
          value={prefix}
          onChange={(e) => setPrefix(e.target.value)}
          placeholder={t("rename.prefixPlaceholder")}
          className="max-w-xs"
        />
      </div>

      <div className="border rounded-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-2 font-medium">
                {t("rename.original")}
              </th>
              <th className="text-left p-2 font-medium">
                {t("rename.newName")}
              </th>
            </tr>
          </thead>
          <tbody>
            {renamePlan.map((entry, i) => (
              <tr key={i} className="border-t">
                <td className="p-2 font-mono text-xs">
                  {entry.original.originalName}
                </td>
                <td className="p-2 font-mono text-xs">{entry.newName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Button onClick={downloadZip} disabled={isZipping || renamePlan.length === 0}>
        {isZipping ? t("rename.downloading") : t("rename.download")}
      </Button>
    </div>
  );
}
