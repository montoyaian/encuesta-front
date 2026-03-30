import { SurveyList } from "@/components/survey-list";
import { getServerAuthToken } from "@/lib/auth-session";
import { requireProfiles } from "@/lib/rbac";
import { listSurveysService } from "@/services/survey.service";
import { ProfileEnum } from "@/types/auth";

export default async function SurveysPage() {
  await requireProfiles([ProfileEnum.PROFESOR, ProfileEnum.ADMINISTRATIVO]);

  const token = await getServerAuthToken();

  if (!token) {
    return null;
  }

  const response = await listSurveysService(token);

  if (response.error) {
    throw new Error(response.error.message);
  }

  const surveys = response.data ?? [];

  return (
    <div className="p-8">
      <SurveyList surveys={surveys} />
    </div>
  );
}
