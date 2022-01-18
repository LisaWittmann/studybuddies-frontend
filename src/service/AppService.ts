import { reactive, readonly } from "vue";

const appFeedbackState = reactive({
  opened: false,
  headline: "",
  subline: "",
  error: "",
  link: "",
  linkText: "",
});

const appState = reactive({
  loading: false,
});

function setFeedback(
  headline: string,
  subline?: string,
  link?: string,
  linkText?: string
) {
  resetFeedback();
  appFeedbackState.headline = headline;
  appFeedbackState.subline = subline ? subline : "";
  appFeedbackState.link = link ? link : "";
  appFeedbackState.linkText = linkText ? linkText : "";
  appFeedbackState.opened = true;
}

function setFeedbackError(headline: string, error: string, linkText: string) {
  resetFeedback();
  appFeedbackState.headline = headline;
  appFeedbackState.error = error;
  appFeedbackState.linkText = linkText;
  appFeedbackState.opened = true;
}

function resetFeedback() {
  appFeedbackState.opened = false;
  appFeedbackState.headline = "";
  appFeedbackState.subline = "";
  appFeedbackState.error = "";
  appFeedbackState.link = "";
  appFeedbackState.linkText = "";
}

function startLoading() {
  appState.loading = true;
}

function endLoading() {
  appState.loading = false;
}

export function useAppService() {
  return {
    appFeedbackState: readonly(appFeedbackState),
    appState: readonly(appState),
    setFeedback,
    setFeedbackError,
    resetFeedback,
    startLoading,
    endLoading,
  };
}
