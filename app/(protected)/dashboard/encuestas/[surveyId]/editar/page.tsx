import { notFound } from "next/navigation";

import { SurveyCreateForm } from "@/components/survey-create-form";
import { getServerAuthToken } from "@/lib/auth-session";
import { requireProfiles } from "@/lib/rbac";
import { getSurveyByIdService } from "@/services/survey.service";
import { ProfileEnum } from "@/types/auth";

type EditSurveyPageProps = {
  params: Promise<{
    surveyId: string;
  }>;
};

export default async function EditSurveyPage({ params }: EditSurveyPageProps) {
  await requireProfiles([ProfileEnum.PROFESOR, ProfileEnum.ADMINISTRATIVO]);

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
    <div className="p-8">
      <SurveyCreateForm initialSurvey={response.data} />
    </div>
  );
}
