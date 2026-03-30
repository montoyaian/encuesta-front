import { notFound } from "next/navigation";

import { SurveyAnswerForm } from "@/components/survey-answer-form";
import { getServerAuthToken } from "@/lib/auth-session";
import { requireProfiles } from "@/lib/rbac";
import { getSurveyByIdService } from "@/services/survey.service";
import { ProfileEnum } from "@/types/auth";

type SurveyResponderDetailPageProps = {
  params: Promise<{
    surveyId: string;
  }>;
};

export default async function SurveyResponderDetailPage({
  params,
}: SurveyResponderDetailPageProps) {
  await requireProfiles([
    ProfileEnum.PROFESOR,
    ProfileEnum.ADMINISTRATIVO,
    ProfileEnum.ESTUDIANTE,
  ]);

  const token = await getServerAuthToken();

  if (!token) {
    return null;
  }

  const { surveyId } = await params;
  const response = await getSurveyByIdService(token, surveyId);

  if (response.error) {
    if (response.error.status === 404) {
      notFound();
    }

    throw new Error(response.error.message);
  }

  if (!response.data) {
    notFound();
  }

  return (
    <div className="bg-zinc-50 p-8">
      <SurveyAnswerForm survey={response.data} />
    </div>
  );
}
