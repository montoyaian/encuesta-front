import { loginUserAction, logoutUserAction, registerUserAction } from "@/actions/auth";
import {
  createSurveyAction,
  deleteSurveyAction,
  submitSurveyAnswersAction,
  updateSurveyAction,
} from "@/actions/survey";

export const actions = {
  auth: {
    registerUserAction,
    loginUserAction,
    logoutUserAction,
  },
  survey: {
    createSurveyAction,
    updateSurveyAction,
    deleteSurveyAction,
    submitSurveyAnswersAction,
  },
};