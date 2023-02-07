import { BatchInterceptor } from "@mswjs/interceptors";
import { ClientRequestInterceptor } from "@mswjs/interceptors/lib/interceptors/ClientRequest";
import { XMLHttpRequestInterceptor } from "@mswjs/interceptors/lib/interceptors/XMLHttpRequest";
import { FetchInterceptor } from "@mswjs/interceptors/lib/interceptors/fetch";

/** params: {targetEnv,reportUrl,reporter,config} */
export const initTool = ({ targetEnv, reportUrl, reporter, config }) => {
  const interceptor = new BatchInterceptor({
    name: "global-interceptor",
    interceptors: [
      new ClientRequestInterceptor(),
      new XMLHttpRequestInterceptor(),
      new FetchInterceptor(),
    ],
  });
  interceptor.apply();
  interceptor.on("request", (request, requestId) => {
    console.warn("[envCheckTool]", request.method, request.url, requestId);
    checkIsEnvCorrespond(request.url, targetEnv, reportUrl, reporter, config);
  });
};

const checkIsEnvCorrespond = (url, targetEnv, reportUrl, reporter, config) => {
  console.log(url, targetEnv, reportUrl, reporter, config);
  if (url.includes(targetEnv)) {
    fetch(reportUrl, {
      method: "POST",
      data: JSON.stringify({
        url: url,
        targetEnv: targetEnv,
        reporter: reporter,
        config,
      }),
    });
  }
};

