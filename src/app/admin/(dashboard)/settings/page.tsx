import { getBusinessSettings } from "@/lib/data/business-settings";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { ChangePasswordForm } from "@/components/admin/ChangePasswordForm";

export default async function SettingsPage() {
  const settings = await getBusinessSettings();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-medium text-dark-text">Settings</h1>
      <SettingsForm settings={settings} />
      <ChangePasswordForm />
    </div>
  );
}
