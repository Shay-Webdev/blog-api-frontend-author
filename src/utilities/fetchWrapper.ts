interface SuccessResponse<T> {
  status: string;
  data: T;
  message?: string;
  meta?: Record<string, unknown>;
}
export type fetchWrapperParam = {
  url: string | URL | globalThis.Request;
  opts?: Omit<RequestInit, "body"> & {
    body?: BodyInit | Record<string, unknown>;
  };
};
const fetchWrapper = async (props: fetchWrapperParam) => {
  const { url, opts } = props;
  const defaultOpts: RequestInit = {
    mode: "cors",
  };
  let body: BodyInit | Record<string, unknown> | undefined = opts?.body;
  let headers: HeadersInit | undefined = opts?.headers;
  if (body && typeof body === "object" && !(body instanceof ReadableStream)) {
    body = JSON.stringify(body);

    headers = {
      ...headers,
      "Content-Type": "application/json",
    };
  }

  const parsedOpts = {
    ...opts,
    body,
    headers,
  };
  //  console.log("parsed opts in fetch wrapper: ", parsedOpts);

  const abortController = new AbortController();
  const abortTimeout = setTimeout(() => {
    abortController.abort();
  }, 10000);
  try {
    const response = await fetch(url, {
      ...defaultOpts,
      ...parsedOpts,
      signal: abortController.signal,
    });
    clearTimeout(abortTimeout);
    if (response.status >= 400) {
      console.error(
        `fetch request failed in fetch wrapper: `,
        await response.json(),
      );

      throw new Error(
        `Fetch request failed with : ${String(response.status)}, ${String(response.statusText)} `,
      );
    }
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      console.log(`Fetch successfull`);
      const data: SuccessResponse<Record<string, unknown>> =
        await response.json();
      return data;
    } else {
      throw new Error("Response is not JSON");
    }
  } catch (error) {
    clearTimeout(abortTimeout);
    console.error(`Error fetching ${url}: `, error);
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new Error("Request timed out");
      }
      throw error;
    }
    throw new Error(`Unkown Error: ${String(error)}`);
  }
};

const getApi = async (props: fetchWrapperParam) => {
  const { url, opts } = props;
  const fetchParams: fetchWrapperParam = {
    url,
    opts: {
      ...opts,
      method: "GET",
    },
  };
  return fetchWrapper(fetchParams);
};

const postApi = async (props: fetchWrapperParam) => {
  const { url, opts } = props;
  const fetchParams: fetchWrapperParam = {
    url,
    opts: {
      ...opts,
      method: "POST",
    },
  };
  //  console.log(
  //    "props in postApi: ",
  //    props,
  //    "fetch params in postApi: ",
  //    fetchParams,
  //  );
  return fetchWrapper(fetchParams);
};

const deleteApi = async (props: fetchWrapperParam) => {
  const { url, opts } = props;
  const fetchParams: fetchWrapperParam = {
    url,
    opts: {
      ...opts,
      method: "DELETE",
    },
  };
  return fetchWrapper(fetchParams);
};

const putApi = async (props: fetchWrapperParam) => {
  const { url, opts } = props;
  const fetchParams: fetchWrapperParam = {
    url,
    opts: {
      ...opts,
      method: "PUT",
    },
  };
  return fetchWrapper(fetchParams);
};

export { fetchWrapper, getApi, postApi, putApi, deleteApi };
