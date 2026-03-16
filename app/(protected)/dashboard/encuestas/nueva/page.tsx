import { SurveyCreateForm } from "@/components/survey-create-form";
import { requireProfiles } from "@/lib/rbac";
import { ProfileEnum } from "@/types/auth";

export default async function NewSurveyPage() {
  await requireProfiles([ProfileEnum.PROFESOR, ProfileEnum.ADMINISTRATIVO]);

  return (
    <div className="p-8">
      <SurveyCreateForm />
    </div>
  );
}
