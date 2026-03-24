import { useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, X, CheckCircle } from "lucide-react";

const MAX_FILES = 3;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

type FormStatus = "idle" | "submitting" | "success" | "error";

export function ContactPage() {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [feedbackType, setFeedbackType] = useState("");
  const [details, setDetails] = useState("");
  const [screenshots, setScreenshots] = useState<File[]>([]);
  const [browserOs, setBrowserOs] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const valid = files.filter((f) => f.size <= MAX_FILE_SIZE);
    setScreenshots((prev) => [...prev, ...valid].slice(0, MAX_FILES));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (index: number) => {
    setScreenshots((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const formData = new FormData();
      formData.append("feedbackType", feedbackType);
      formData.append("details", details);
      formData.append("browserOs", browserOs);
      formData.append("email", email);
      screenshots.forEach((file) => formData.append("screenshots", file));

      const res = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to send");
      }

      setStatus("success");
      setFeedbackType("");
      setDetails("");
      setScreenshots([]);
      setBrowserOs("");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "An error occurred"
      );
    }
  };

  if (status === "success") {
    return (
      <main className="mx-auto max-w-2xl px-6 py-16 text-center">
        <CheckCircle className="mx-auto mb-4 size-12 text-[#22C55E]" />
        <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2">
          {t("contact.successTitle")}
        </h2>
        <p className="text-[#6B7280]">{t("contact.successDescription")}</p>
        <Button
          className="mt-6 bg-[#22C55E] hover:bg-[#16A34A]"
          onClick={() => setStatus("idle")}
        >
          {t("contact.sendAnother")}
        </Button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <Helmet>
        <title>Contact – timelapse-gif</title>
        <meta name="description" content="Send feedback, report bugs, or request features for timelapse-gif." />
        <link rel="canonical" href="https://timelapse-gif.pages.dev/contact" />
      </Helmet>
      <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2">
        {t("contact.title")}
      </h2>
      <p className="text-sm text-[#6B7280] mb-8">{t("contact.description")}</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Feedback Type */}
        <div className="space-y-2">
          <Label htmlFor="feedbackType">
            {t("contact.feedbackType")} <span className="text-red-500">*</span>
          </Label>
          <Select value={feedbackType} onValueChange={setFeedbackType} required>
            <SelectTrigger id="feedbackType" className="w-full">
              <SelectValue placeholder={t("contact.feedbackTypePlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bug">{t("contact.types.bug")}</SelectItem>
              <SelectItem value="feature">
                {t("contact.types.feature")}
              </SelectItem>
              <SelectItem value="question">
                {t("contact.types.question")}
              </SelectItem>
              <SelectItem value="other">{t("contact.types.other")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Details */}
        <div className="space-y-2">
          <Label htmlFor="details">
            {t("contact.details")} <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder={t("contact.detailsPlaceholder")}
            rows={5}
            required
          />
        </div>

        {/* Screenshots */}
        <div className="space-y-2">
          <Label>{t("contact.screenshots")}</Label>
          <p className="text-xs text-[#6B7280]">
            {t("contact.screenshotsHint")}
          </p>
          <div className="flex flex-wrap gap-2">
            {screenshots.map((file, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 rounded-md bg-[#F3F4F6] px-3 py-1.5 text-sm"
              >
                <span className="max-w-[150px] truncate">{file.name}</span>
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="text-[#9CA3AF] hover:text-[#EF4444]"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
          {screenshots.length < MAX_FILES && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="size-4" />
              {t("contact.addScreenshot")}
            </Button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Browser & OS */}
        <div className="space-y-2">
          <Label htmlFor="browserOs">{t("contact.browserOs")}</Label>
          <Input
            id="browserOs"
            value={browserOs}
            onChange={(e) => setBrowserOs(e.target.value)}
            placeholder={t("contact.browserOsPlaceholder")}
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">{t("contact.email")}</Label>
          <p className="text-xs text-[#6B7280]">{t("contact.emailHint")}</p>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
          />
        </div>

        {/* Error */}
        {status === "error" && (
          <p className="text-sm text-red-500">{errorMessage}</p>
        )}

        {/* Submit */}
        <Button
          type="submit"
          className="w-full bg-[#22C55E] hover:bg-[#16A34A]"
          disabled={!feedbackType || !details || status === "submitting"}
        >
          {status === "submitting"
            ? t("contact.submitting")
            : t("contact.submit")}
        </Button>
      </form>
    </main>
  );
}
