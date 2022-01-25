import { reactive, readonly } from "vue";

const feedbackState = reactive({
  opened: false,
  headline: "",
  subline: "",
  error: "",
  link: "",
  linkText: "",
});

const globalState = reactive({
  loading: false,
  username: "",
  errormessage: "",
});

function setFeedback(
  headline: string,
  subline?: string,
  link?: string,
  linkText?: string
) {
  resetFeedback();
  feedbackState.headline = headline;
  feedbackState.subline = subline ? subline : "";
  feedbackState.link = link ? link : "";
  feedbackState.linkText = linkText ? linkText : "";
  feedbackState.opened = true;
}

function setFeedbackError(headline: string, error: string, linkText: string) {
  resetFeedback();
  feedbackState.headline = headline;
  feedbackState.error = error;
  feedbackState.linkText = linkText;
  feedbackState.opened = true;
}

function resetFeedback() {
  feedbackState.opened = false;
  feedbackState.headline = "";
  feedbackState.subline = "";
  feedbackState.error = "";
  feedbackState.link = "";
  feedbackState.linkText = "";
}

function startLoading() {
  globalState.loading = true;
}

function endLoading() {
  globalState.loading = false;
}

function setUsername(username: string) {
  globalState.username = username;
}

export function useAppService() {
  return {
    feedbackState: readonly(feedbackState),
    globalState: readonly(globalState),
    setFeedback,
    setFeedbackError,
    resetFeedback,
    startLoading,
    endLoading,
    setUsername,
  };
}
