import { SurveyAnswerList } from "@/components/survey-answer-list";
import { getServerAuthToken } from "@/lib/auth-session";
import { requireProfiles } from "@/lib/rbac";
import { listAvailableSurveysService } from "@/services/survey.service";
import { ProfileEnum } from "@/types/auth";

export default async function SurveyResponderPage() {
  await requireProfiles([
    ProfileEnum.PROFESOR,
    ProfileEnum.ADMINISTRATIVO,
    ProfileEnum.ESTUDIANTE,
  ]);

  const token = await getServerAuthToken();

  if (!token) {
    return null;
  }

  const response = await listAvailableSurveysService(token);
  const surveys = response.data ?? [];
  const errorMessage = response.error?.message;

  return (
    <div className="min-h-full bg-gradient-to-b from-zinc-50 via-slate-50 to-blue-50/35 p-6 sm:p-8">
      {errorMessage ? (
        <div className="mx-auto mb-6 w-full max-w-5xl rounded-xl border border-amber-300/70 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {errorMessage}
        </div>
      ) : null}
      <SurveyAnswerList surveys={surveys} />
    </div>
  );
}
